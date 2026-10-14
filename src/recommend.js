import { METHODS } from "./methods.js";
import { QUESTIONS } from "./questions.js";

const MATERIAL_WEIGHT = 3;
const STRUGGLE_WEIGHT = 6; // the student's stated problem outweighs the kind of material
const HORIZON_WEIGHT = 2;
const HORIZON_MISMATCH_PENALTY = 4;
const UNMET_REQUIREMENT_PENALTY = 5;

const REASONS = {
  material: (answers) => `It suits ${labelFor("material", answers.material).toLowerCase()}.`,
  struggle: (answers) => `It directly helps with “${labelFor("struggle", answers.struggle)}”.`,
  horizon: (answers) => `It works with your timeline (${labelFor("horizon", answers.horizon).toLowerCase()}).`,
};

function labelFor(questionId, optionId) {
  const question = QUESTIONS.find((q) => q.id === questionId);
  return question.options.find((o) => o.id === optionId).label;
}

/** Returns an error message if the answers are incomplete or invalid, otherwise null. */
export function validateAnswers(answers) {
  for (const question of QUESTIONS) {
    const value = answers?.[question.id];
    if (!value) return `Please answer: ${question.prompt}`;
    if (!question.options.some((o) => o.id === value)) return `Unknown answer for: ${question.prompt}`;
  }
  return null;
}

function scoreMethod(method, answers) {
  const reasons = [];
  let score = method.utility;

  if (method.fit.material.includes(answers.material)) {
    score += MATERIAL_WEIGHT;
    reasons.push(REASONS.material(answers));
  }
  const helpsStruggle = method.fit.struggle.includes(answers.struggle);
  if (helpsStruggle) {
    score += STRUGGLE_WEIGHT;
    reasons.push(REASONS.struggle(answers));
  }
  if (method.fit.horizon.includes(answers.horizon)) {
    score += HORIZON_WEIGHT;
    if (reasons.length === 0) reasons.push(REASONS.horizon(answers));
  } else {
    score -= HORIZON_MISMATCH_PENALTY;
  }
  if (method.requiresStruggle && !helpsStruggle) score -= UNMET_REQUIREMENT_PENALTY;

  return { method, score, reasons };
}

function specificity(method) {
  const { material, struggle, horizon } = method.fit;
  return -(material.length + struggle.length + horizon.length);
}

/**
 * Picks the best-fitting study methods for the answers.
 * Returns up to `count` results as { method, score, reasons }, best first.
 * Throws if the answers are incomplete.
 */
export function recommend(answers, count = 2) {
  const error = validateAnswers(answers);
  if (error) throw new Error(error);

  // Ties go to the more specific method (fewer situations it claims to fit), then to higher utility.
  return METHODS.map((method) => scoreMethod(method, answers))
    .sort((a, b) => b.score - a.score || specificity(b.method) - specificity(a.method) || b.method.utility - a.method.utility)
    .slice(0, count);
}
