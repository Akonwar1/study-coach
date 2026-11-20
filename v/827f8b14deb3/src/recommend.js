import { METHODS } from "./methods.js";
import { QUESTIONS, SUBJECT_QUESTION } from "./questions.js";

const MATERIAL_WEIGHT = 3;
const STRUGGLE_WEIGHT = 6; // the student's stated problem outweighs the kind of material
const TASK_WEIGHT = 3; // what you will be asked to do shifts close calls, but never outweighs your stated problem
const HIGH_UTILITY = 3; // Dunlosky et al.'s “high utility” methods; what we lead with when nothing specific is wrong
const SUBJECT_WEIGHT = 4; // a method built for your subject should win a close call against a general one
const SUBJECT_MISMATCH_PENALTY = 4; // and a method built for another subject should not
const HORIZON_WEIGHT = 2;
const HORIZON_MISMATCH_PENALTY = 4;
const UNMET_REQUIREMENT_PENALTY = 5;

const REASONS = {
  material: (answers) => `It suits ${labelFor("material", answers.material).toLowerCase()}.`,
  struggle: (answers) => `It directly helps with “${labelFor("struggle", answers.struggle)}”.`,
  wellSupported: () => "It is one of the best-supported methods, so it helps even when nothing specific is going wrong.",
  subject: (answers) => `It was built for ${SUBJECT_QUESTION.options.find((o) => o.id === answers.subject).label.toLowerCase()}.`,
  task: (answers) => `It prepares you to ${optionFor("task", answers.task).outcome}.`,
  horizon: (answers) => `It works with your timeline (${labelFor("horizon", answers.horizon).toLowerCase()}).`,
};

function optionFor(questionId, optionId) {
  return QUESTIONS.find((q) => q.id === questionId).options.find((o) => o.id === optionId);
}

function labelFor(questionId, optionId) {
  return optionFor(questionId, optionId).label;
}

/** Returns an error message if the answers are incomplete or invalid, otherwise null. */
export function validateAnswers(answers) {
  for (const question of QUESTIONS) {
    const value = answers?.[question.id];
    if (!value && question.optional) continue;
    if (!value) return `Please answer: ${question.prompt}`;
    if (!question.options.some((o) => o.id === value)) return `Unknown answer for: ${question.prompt}`;
  }
  return null;
}

function scoreMethod(method, answers) {
  const reasons = [];
  const matches = { material: false, struggle: false, subject: false, task: false, horizon: false }; // which answers the method fits
  let score = method.utility;

  if (method.fit.material.includes(answers.material)) {
    matches.material = true;
    score += MATERIAL_WEIGHT;
    reasons.push(REASONS.material(answers));
  }
  const helpsStruggle = method.fit.struggle.includes(answers.struggle);
  if (helpsStruggle) {
    matches.struggle = true;
    score += STRUGGLE_WEIGHT;
    reasons.push(REASONS.struggle(answers));
  }
  if (method.fit.subject && answers.subject) {
    if (method.fit.subject.includes(answers.subject)) {
      matches.subject = true;
      score += SUBJECT_WEIGHT;
      reasons.push(REASONS.subject(answers));
    } else {
      score -= SUBJECT_MISMATCH_PENALTY;
    }
  }
  if (answers.struggle === "none" && method.utility >= HIGH_UTILITY) reasons.push(REASONS.wellSupported());
  if (method.fit.task?.includes(answers.task)) {
    matches.task = true;
    score += TASK_WEIGHT;
    reasons.push(REASONS.task(answers));
  }
  if (method.fit.horizon.includes(answers.horizon)) {
    matches.horizon = true;
    score += HORIZON_WEIGHT;
    if (reasons.length === 0) reasons.push(REASONS.horizon(answers));
  } else {
    score -= HORIZON_MISMATCH_PENALTY;
  }
  if (method.requiresStruggle && !helpsStruggle) score -= UNMET_REQUIREMENT_PENALTY;

  return { method, score, reasons, matches };
}

function specificity(method) {
  const { material, struggle, horizon } = method.fit;
  return -(material.length + struggle.length + horizon.length);
}

/**
 * Picks the best-fitting study methods for the answers.
 * Returns up to `count` results as { method, score, reasons, matches }, best first;
 * `matches` says which of the answers the method fits, for explaining the result.
 * Throws if the answers are incomplete.
 * A method that lists `fit.subject` is favoured for those subjects and held back for the others; the subject
 * answer is optional here, and methods that list no subject ignore it.
 */
export function recommend(answers, count = 2, methods = METHODS) {
  const error = validateAnswers(answers);
  if (error) throw new Error(error);

  // Ties go to the more specific method (fewer situations it claims to fit), then to higher utility.
  return methods.map((method) => scoreMethod(method, answers))
    .sort((a, b) => b.score - a.score || specificity(b.method) - specificity(a.method) || b.method.utility - a.method.utility)
    .slice(0, count);
}
