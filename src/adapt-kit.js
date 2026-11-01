// Building blocks for a method's tailoring rules (see plan.js for what a rule is and how it is applied).
// Each function returns the plain data a rule is written as, so a rule reads as a short list of what changes and why.
// What is shared here is the mechanics only. The wording (the reason, the summary and the advice itself) is always
// written for the method, because two cards on one screen must never repeat each other.

/** A rule: when the student's answers match `when`, run the operations. Operations can be given singly or in lists. */
export const rule = (when, because, summary, ...operations) => ({ when, because, summary, do: operations.flat() });

/** Replace fields of a step, such as its title, instruction, timer or any text. */
export const set = (step, fields) => ({ op: "set", step, fields });

/** Add a sentence to the end of a step's instruction, or of another text field. */
export const append = (step, text, field) => (field === undefined ? { op: "append", step, text } : { op: "append", step, text, field });

export const drop = (step) => ({ op: "drop", step });

/** Shorten every timer that is longer than `max` minutes. */
export const capTimers = (max) => ({ op: "capMinutes", max });

/** Add a new step. It needs an id, a title, an instruction, minutes and a picture that exists. */
export const insertAtStart = (step) => ({ op: "insert", at: "start", step });
export const insertAfter = (anchor, step) => ({ op: "insert", after: anchor, step });
export const insertBefore = (anchor, step) => ({ op: "insert", before: anchor, step });

const DEADLINES = ["soon", "week", "long", "none"];

/**
 * One rule per deadline given, each changing the same step (usually the one that schedules the next review):
 * byDeadline("schedule", { soon: { because, summary, fields }, week: { ... } }).
 */
export function byDeadline(step, cases) {
  return DEADLINES.filter((deadline) => cases[deadline]).map((deadline) => {
    const { because, summary, fields } = cases[deadline];
    return rule({ horizon: [deadline] }, because, summary, set(step, fields));
  });
}
