// Adjusts a method's guided steps to the subject the student is studying.
//
// In methods.js, a step's `instruction`, `mindset`, `example` and `tip` may each be a plain string, or an object
// keyed by subject id with a `default` fallback: { default: "...", quantitative: "...", humanities: "..." }.
// resolveSteps turns those into plain strings for one subject. It is the single place steps are
// produced, so a later version could generate steps with an AI service and return the same shape.

const TAILORED_FIELDS = ["instruction", "mindset", "example", "tip"];

function pick(value, subject) {
  if (value === null || typeof value !== "object") return value;
  return value[subject] ?? value.default;
}

/** Returns the method's walkthrough steps with every field resolved to text for this subject. */
export function resolveSteps(method, subject) {
  return method.session.map((step) => {
    const resolved = { ...step };
    for (const field of TAILORED_FIELDS) {
      if (step[field] === undefined) continue;
      resolved[field] = pick(step[field], subject);
    }
    return resolved;
  });
}
