// For reading a method's tailoring rules without reading code: what each rule changes, shown as before and after,
// and which answers have no rule yet. Used by plans.html, a tool for the student and Claude; the app itself does not use it.
import { makePlan, personalizableQuestions } from "./plan.js";
import { ALL_QUESTIONS } from "./questions.js";

const DIFFED_FIELDS = ["title", "instruction", "mindset", "example", "tip", "minutes"];
const questionFor = (id) => ALL_QUESTIONS.find((question) => question.id === id);

/**
 * One entry per rule of the method: when it applies (as the quiz words it), its reason and summary, and what it changes
 * in the standard plan: fields changed (before and after), steps added and steps dropped.
 */
export function describeRules(method) {
  const standard = makePlan({ ...method, adapt: [] });
  const standardById = new Map(standard.steps.map((step) => [step.id, step]));
  return (method.adapt ?? []).map((candidate) => {
    const situation = Object.fromEntries(Object.entries(candidate.when).map(([question, answers]) => [question, answers[0]]));
    const tailored = makePlan({ ...method, adapt: [candidate] }, situation);
    const tailoredById = new Map(tailored.steps.map((step) => [step.id, step]));
    const changes = [];
    for (const [id, before] of standardById) {
      const after = tailoredById.get(id);
      if (!after) continue;
      for (const field of DIFFED_FIELDS) {
        if (before[field] !== after[field]) changes.push({ step: before.title, field, before: before[field], after: after[field] });
      }
    }
    return {
      when: Object.entries(candidate.when).map(([question, ids]) => ({
        question,
        prompt: questionFor(question).prompt,
        answers: ids.map((id) => questionFor(question).options.find((option) => option.id === id).label),
      })),
      because: candidate.because,
      summary: candidate.summary,
      changes,
      added: tailored.steps.filter((step) => !standardById.has(step.id)).map(({ title, minutes, instruction, mindset }) => ({ title, minutes, instruction, mindset })),
      dropped: standard.steps.filter((step) => !tailoredById.has(step.id)).map(({ title }) => ({ title })),
    };
  });
}

/** For each question the method can adjust to: which answers have a rule and which have none yet, as answer ids in quiz order. */
export function ruleCoverage(method) {
  return personalizableQuestions(method).map((question) => {
    const ids = questionFor(question).options.map((option) => option.id);
    const covered = ids.filter((id) => method.adapt.some((candidate) => candidate.when[question]?.includes(id)));
    return { question, covered, missing: ids.filter((id) => !covered.includes(id)) };
  });
}

/** A rule as the quiz words it, for headings and for matching a reviewer's verdict to the rule: “How long until the exam or deadline? Today to 2 days”. */
export const ruleLabel = (rule) => rule.when.map((condition) => `${condition.prompt} ${condition.answers.join(" or ")}`).join(" · ");

const VERDICTS = ["keep", "rewrite", "cut"];

/**
 * A reviewer's verdicts written out in plain words to paste into a message: counts, then the rules to rewrite and cut with
 * their notes. `review` is { [ruleLabel]: { verdict: "keep" | "rewrite" | "cut", note } }.
 */
export function summarizeReview(methodName, rules, review) {
  const entries = rules.map((rule) => ({ label: ruleLabel(rule), ...review[ruleLabel(rule)] }));
  const count = (verdict) => entries.filter((entry) => entry.verdict === verdict).length;
  const unseen = entries.filter((entry) => !VERDICTS.includes(entry.verdict)).length;
  const lines = [`Review of ${methodName}’s rules`, `Keep: ${count("keep")} · Rewrite: ${count("rewrite")} · Cut: ${count("cut")} · Not looked at yet: ${unseen}`];
  for (const verdict of ["rewrite", "cut"]) {
    const chosen = entries.filter((entry) => entry.verdict === verdict);
    if (chosen.length === 0) continue;
    lines.push("", verdict.toUpperCase(), ...chosen.map((entry) => (entry.note ? `- ${entry.label}: “${entry.note}”` : `- ${entry.label}`)));
  }
  return lines.join("\n");
}
