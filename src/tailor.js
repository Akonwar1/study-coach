// Adjusts a method's guided steps to the subject the student is studying.
//
// In methods.js, a step's `instruction`, `mindset`, `example` and `tip` may each be a plain string, or an object
// keyed by subject id with a `default` fallback: { default: "...", quantitative: "...", humanities: "..." }.
// resolveSteps turns those into plain strings for one subject. plan.js builds on it to adjust the steps to the rest
// of the student's answers, and is the single place a session's steps come from.

const TAILORED_FIELDS = ["instruction", "mindset", "example", "tip"];

function pick(value, subject) {
  if (value === null || typeof value !== "object") return value;
  return value[subject] ?? value.default;
}

/** Returns one step with every tailored field resolved to text for this subject. */
export function resolveStep(step, subject) {
  const resolved = { ...step };
  for (const field of TAILORED_FIELDS) {
    if (step[field] === undefined) continue;
    resolved[field] = pick(step[field], subject);
  }
  return resolved;
}

/** Returns the method's walkthrough steps with every field resolved to text for this subject. */
export function resolveSteps(method, subject) {
  return method.session.map((step) => resolveStep(step, subject));
}
