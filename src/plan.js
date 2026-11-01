// Builds the plan a guided session follows: a method's steps, adjusted to the student's answers.
//
// A plan is plain data, so it can be saved with a session and checked by validatePlan whatever made it:
//   plan        = { source, steps, changes }
//   source      = "rules" for a plan built from a method's `adapt` rules; a later version could add another source
//                 (for example a plan written by an AI service), which must pass validatePlan before a session uses it
//   steps       = [{ id, title, instruction, minutes, mindset?, example?, tip?, visual?, adjustedFor? }], all text already resolved
//   adjustedFor = [{ kind, because }]: which answers changed this step, and why
//   changes     = [{ kind, because, summary, steps }]: one per rule that applied: the full reason, a few words for the result
//                 card, and the ids of the steps it touched
//
// A method lists its rules as `adapt` in methods.js. Each rule is { when, because, summary, do }:
//   when:    { horizon: ["soon"], struggle: [...] }; every key must match the student's answer (any of the listed ids)
//   because: one sentence, shown on the changed step, saying why it changes
//   summary: the same in a few words (12 at most), shown on the result card
//   do:      a list of operations, run in order:
//     { op: "set", step, fields }                 replace fields of a step (title, instruction, minutes, ...)
//     { op: "append", step, text, field? }        add a sentence to a step's text (instruction unless `field` says otherwise)
//     { op: "insert", step, after | before | at: "start" }   add a new step
//     { op: "drop", step }                        remove a step
//     { op: "capMinutes", max }                   shorten every timer longer than `max` minutes
//   Text in a rule can vary by subject like any step text (see tailor.js), and is added to the subject's own wording.

import { ALL_QUESTIONS } from "./questions.js";
import { resolveStep } from "./tailor.js";

const MAX_STEP_MINUTES = 60;
const QUESTION_IDS = ALL_QUESTIONS.map((question) => question.id);
const TEXT_FIELDS = ["mindset", "example", "tip"];

export function plannedMinutes(steps) {
  return steps.reduce((total, step) => total + step.minutes, 0);
}

/** Whether a rule applies to a situation: every question it lists is answered with one of the answers it lists. */
export function ruleApplies(rule, situation) {
  return Object.entries(rule.when).every(([question, answers]) => answers.includes(situation[question]));
}

function mark(step, kind, because) {
  if (step.adjustedFor?.some((existing) => existing.kind === kind)) return;
  step.adjustedFor = [...(step.adjustedFor ?? []), { kind, because }];
}

/** Runs one rule's operations on `steps` (changing it) and returns the ids of the steps it touched. */
function applyRule(rule, steps, subject, problems) {
  const kind = Object.keys(rule.when)[0];
  const touched = new Set();
  const touch = (step) => {
    mark(step, kind, rule.because);
    touched.add(step.id);
  };
  const indexOf = (id) => {
    const index = steps.findIndex((step) => step.id === id);
    if (index === -1) problems.push(`a rule for ${kind} points at the missing step “${id}”`);
    return index;
  };

  for (const operation of rule.do) {
    if (operation.op === "capMinutes") {
      steps.filter((step) => step.minutes > operation.max).forEach((step) => {
        step.minutes = operation.max;
        touch(step);
      });
      continue;
    }
    if (operation.op === "insert") {
      const anchor = operation.at === "start" ? 0 : indexOf(operation.after ?? operation.before);
      if (anchor === -1) continue;
      const inserted = resolveStep(operation.step, subject);
      if (steps.some((step) => step.id === inserted.id)) problems.push(`a rule for ${kind} inserts “${inserted.id}” twice`);
      steps.splice(operation.at === "start" ? 0 : operation.after ? anchor + 1 : anchor, 0, inserted);
      touch(inserted);
      continue;
    }
    const index = indexOf(operation.step);
    if (index === -1) continue;
    const step = steps[index];
    if (operation.op === "drop") {
      steps.splice(index, 1);
      mark(step, kind, rule.because);
      continue;
    }
    if (operation.op === "set") Object.assign(step, resolveStep(operation.fields, subject));
    else if (operation.op === "append") {
      const field = operation.field ?? "instruction";
      step[field] = step[field] ? `${step[field]} ${operation.text}` : operation.text;
    } else problems.push(`a rule for ${kind} uses the unknown operation “${operation.op}”`);
    touch(step);
  }
  return touched;
}

function build(method, situation) {
  const subject = situation.subject ?? "other";
  const problems = [];
  const steps = method.session.map((step, index) => ({ ...resolveStep(step, subject), id: step.id ?? `step-${index + 1}` }));
  const changes = [];
  for (const rule of method.adapt ?? []) {
    if (!ruleApplies(rule, situation)) continue;
    const touched = applyRule(rule, steps, subject, problems);
    changes.push({ kind: Object.keys(rule.when)[0], because: rule.because, summary: rule.summary, steps: steps.filter((step) => touched.has(step.id)).map((step) => step.id) });
  }
  return { plan: { source: "rules", steps, changes }, problems };
}

/**
 * The plan for a method and the student's situation: { material?, horizon?, struggle?, task?, subject? }.
 * With no answers, or for a method with no rules, it is the method's own steps with nothing marked as changed.
 */
export function makePlan(method, situation = {}) {
  return build(method, situation).plan;
}

/** What is wrong with a method's rules for this situation, such as a rule that points at a step that is not there. */
export function planProblems(method, situation = {}) {
  return build(method, situation).problems;
}

function stepError(step, seen) {
  if (!step || typeof step !== "object") return "a step is missing";
  if (typeof step.id !== "string" || !step.id) return "a step has no id";
  if (seen.has(step.id)) return `two steps share the id “${step.id}”`;
  seen.add(step.id);
  for (const field of ["title", "instruction"]) if (typeof step[field] !== "string" || !step[field]) return `“${step.id}” has no ${field}`;
  for (const field of TEXT_FIELDS) if (step[field] !== undefined && (typeof step[field] !== "string" || !step[field])) return `“${step.id}” has a bad ${field}`;
  if (!Number.isInteger(step.minutes) || step.minutes < 0 || step.minutes > MAX_STEP_MINUTES) return `“${step.id}” has a bad timer`;
  if (step.visual !== undefined && (typeof step.visual?.name !== "string" || !step.visual.name)) return `“${step.id}” has a bad picture`;
  if (step.adjustedFor !== undefined) {
    const marks = step.adjustedFor;
    if (!Array.isArray(marks) || !marks.every((mark) => QUESTION_IDS.includes(mark?.kind) && typeof mark.because === "string" && mark.because)) return `“${step.id}” has a bad adjustment note`;
  }
  return null;
}

/** An error message if a session could not run this plan, otherwise null. It checks any plan, however it was made. */
export function validatePlan(plan) {
  if (!plan || typeof plan !== "object") return "there is no plan";
  if (typeof plan.source !== "string") return "the plan does not say where it came from";
  if (!Array.isArray(plan.steps) || plan.steps.length === 0) return "the plan has no steps";
  const seen = new Set();
  for (const step of plan.steps) {
    const error = stepError(step, seen);
    if (error) return error;
  }
  const changesOk = Array.isArray(plan.changes) && plan.changes.every((change) => QUESTION_IDS.includes(change?.kind) && typeof change.because === "string" && typeof change.summary === "string" && Array.isArray(change.steps));
  return changesOk ? null : "the plan's list of changes is malformed";
}

export function planSummary(plan) {
  return { steps: plan.steps.length, minutes: plannedMinutes(plan.steps), changes: plan.changes.length };
}

/**
 * The questions a method has rules for, in quiz order: what a student who picked the method themselves can be asked
 * to personalize it. The subject is left out because the library asks for it on its own.
 */
export function personalizableQuestions(method) {
  const used = new Set((method.adapt ?? []).flatMap((rule) => Object.keys(rule.when)));
  return QUESTION_IDS.filter((id) => id !== "subject" && used.has(id));
}

const KNOWN_OPERATIONS = ["set", "append", "insert", "drop", "capMinutes"];
const MIN_REASON_LENGTH = 20;
const MIN_SUMMARY_LENGTH = 10;
const MAX_SUMMARY_WORDS = 12;

function operationProblems(operation, baseIds, insertedIds) {
  const problems = [];
  const needsStep = (id) => { if (!baseIds.includes(id)) problems.push(`points at the step “${id}”, which the method does not have`); };
  switch (operation?.op) {
    case "set":
      needsStep(operation.step);
      if (!operation.fields || typeof operation.fields !== "object") problems.push("“set” has no fields to change");
      break;
    case "append":
      needsStep(operation.step);
      if (typeof operation.text !== "string" || !operation.text) problems.push("“append” has no text");
      if (operation.field !== undefined && !["instruction", ...TEXT_FIELDS].includes(operation.field)) problems.push(`“append” names the unknown field “${operation.field}”`);
      break;
    case "drop":
      needsStep(operation.step);
      break;
    case "capMinutes":
      if (!Number.isInteger(operation.max) || operation.max < 1 || operation.max > MAX_STEP_MINUTES) problems.push("a timer cap must be a whole number of minutes, at least 1");
      break;
    case "insert": {
      const { step } = operation;
      const places = [operation.at === "start", operation.after !== undefined, operation.before !== undefined].filter(Boolean).length;
      if (places !== 1) problems.push("an inserted step needs exactly one place: at the start, after a step or before a step");
      if (operation.after !== undefined) needsStep(operation.after);
      if (operation.before !== undefined) needsStep(operation.before);
      const error = step && stepError(step, new Set(baseIds));
      if (!step || error) problems.push(`the inserted step is not valid (${error ?? "missing"})`);
      else {
        if (insertedIds.includes(step.id)) problems.push(`another rule already inserts a step called “${step.id}”`);
        insertedIds.push(step.id);
        if (!step.visual) problems.push(`the inserted step “${step.id}” has no picture`);
      }
      break;
    }
    default:
      problems.push(`uses the unknown operation “${operation?.op}”`);
  }
  return problems;
}

/**
 * What is wrong with a method's tailoring rules, as readable messages (an empty list means they are fine): unknown
 * questions or answers, missing or too long wording, steps that do not exist, an inserted step with no picture, and a
 * rule that changes nothing. Whether a picture name actually exists is for the tests, which can draw it.
 */
export function ruleProblems(method) {
  const rules = method.adapt ?? [];
  if (rules.length === 0) return [];
  const problems = method.session.filter((step) => !step.id).map((step) => `${method.id}: the step “${step.title}” has no id, which its rules need`);
  const baseIds = method.session.map((step) => step.id);
  const insertedIds = [];
  const contentOf = (plan) => JSON.stringify(plan.steps.map(({ adjustedFor, ...content }) => content)); // a rule that only marks a step does not change it
  const standard = contentOf(makePlan({ ...method, adapt: [] }));
  rules.forEach((candidate, index) => {
    const found = [];
    const when = candidate.when;
    if (!when || typeof when !== "object" || Object.keys(when).length === 0) found.push("has no condition");
    else {
      for (const [question, answers] of Object.entries(when)) {
        const options = ALL_QUESTIONS.find((q) => q.id === question)?.options.map((o) => o.id);
        if (!options) found.push(`asks about the unknown question “${question}”`);
        else if (!Array.isArray(answers) || answers.length === 0 || !answers.every((id) => options.includes(id))) found.push(`lists answers that “${question}” does not have`);
      }
    }
    if (typeof candidate.because !== "string" || candidate.because.length < MIN_REASON_LENGTH) found.push("needs a reason of a full sentence");
    const words = typeof candidate.summary === "string" ? candidate.summary.trim().split(/\s+/).length : 0;
    if (typeof candidate.summary !== "string" || candidate.summary.length < MIN_SUMMARY_LENGTH || words > MAX_SUMMARY_WORDS) found.push(`needs a summary of ${MAX_SUMMARY_WORDS} words or fewer`);
    if (!Array.isArray(candidate.do) || candidate.do.length === 0) found.push("has nothing to do");
    else candidate.do.forEach((operation) => found.push(...operationProblems(operation, baseIds, insertedIds)));
    if (found.length === 0) {
      const situation = Object.fromEntries(Object.entries(when).map(([question, answers]) => [question, answers[0]]));
      if (contentOf(makePlan({ ...method, adapt: [candidate] }, situation)) === standard) found.push("changes nothing");
    }
    problems.push(...found.map((text) => `${method.id}, rule ${index + 1} ${JSON.stringify(when)}: ${text}`));
  });
  return problems;
}

/** Two methods must not share a rule's reason or summary: both cards can be on screen together and must not read alike. */
export function crossMethodProblems(methods) {
  const owners = new Map();
  const problems = [];
  for (const method of methods) {
    for (const candidate of method.adapt ?? []) {
      for (const text of [candidate.because, candidate.summary]) {
        const other = owners.get(text);
        if (other && other !== method.id) problems.push(`${other} and ${method.id} both say “${text}”`);
        else owners.set(text, method.id);
      }
    }
  }
  return problems;
}
