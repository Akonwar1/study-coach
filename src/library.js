// The method library: filtering and describing methods without any screen code, so it can be tested.

import { QUESTIONS } from "./questions.js";

const FILTER_QUESTION_IDS = ["material", "struggle", "horizon"];

/** The filter groups shown in the library, taken from the coach's own questions. */
export const FILTER_GROUPS = FILTER_QUESTION_IDS.map((id) => {
  const question = QUESTIONS.find((q) => q.id === id);
  return { id, prompt: question.prompt, options: question.options };
});

export const NO_FILTERS = { material: "", struggle: "", horizon: "" };

/**
 * Methods that match every chosen filter ("" means any). A method with an empty list for a
 * filter (for example Pomodoro and material) is not tied to it, so it always matches.
 */
export function filterMethods(methods, filters) {
  return methods.filter((method) =>
    FILTER_QUESTION_IDS.every((id) => {
      const chosen = filters[id];
      const fits = method.fit[id];
      return !chosen || fits.length === 0 || fits.includes(chosen);
    }),
  );
}

export function hasActiveFilters(filters) {
  return FILTER_QUESTION_IDS.some((id) => filters[id]);
}

function labels(questionId, ids) {
  const question = QUESTIONS.find((q) => q.id === questionId);
  return ids.map((id) => question.options.find((o) => o.id === id).label);
}

/** One-line plain-English summary of what a method suits and helps with. */
export function describeFit(method) {
  const material = method.fit.material.length ? labels("material", method.fit.material).join(", ").toLowerCase() : "any material";
  const struggle = labels("struggle", method.fit.struggle).map((label) => `“${label}”`).join(", ");
  return { material, struggle };
}
