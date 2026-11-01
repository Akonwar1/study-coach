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

function matches(when, situation) {
  return Object.entries(when).every(([question, answers]) => answers.includes(situation[question]));
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
    if (!matches(rule.when, situation)) continue;
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
