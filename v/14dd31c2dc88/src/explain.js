// Turns a recommendation into plain words for the student: what they told us and what is going on, why each method fits, and why it ranked where it did.

import { ALL_QUESTIONS } from "./questions.js";

const CLOSE_CALL = 1; // scores this close read as a tie to the student

function optionOf(questionId, optionId) {
  return ALL_QUESTIONS.find((q) => q.id === questionId).options.find((o) => o.id === optionId);
}

function labelOf(questionId, optionId) {
  return optionOf(questionId, optionId).label;
}

/** The student's answers as { id, question, answer } in quiz order, leaving out anything unanswered. */
export function describeAnswers(answers) {
  return ALL_QUESTIONS.filter((question) => answers[question.id]).map((question) => ({
    id: question.id,
    question: question.prompt,
    answer: labelOf(question.id, answers[question.id]),
  }));
}

// How each kind of answer reads when it is the reason one method beat another.
const FIT_PHRASES = {
  struggle: (answers) => `your problem (“${labelOf("struggle", answers.struggle)}”)`,
  material: (answers) => `your material (${labelOf("material", answers.material).toLowerCase()})`,
  task: (answers) => `what you will have to do with it (${labelOf("task", answers.task).toLowerCase()})`,
  subject: (answers) => `your subject (${labelOf("subject", answers.subject).toLowerCase()})`,
  horizon: (answers) => `your deadline (${labelOf("horizon", answers.horizon).toLowerCase()})`,
};
const IMPORTANCE = ["struggle", "subject", "task", "material", "horizon"]; // the order answers weigh in the recommender, roughly

function problemSentence(method, answers, matches) {
  if (answers.struggle === "none" || matches.struggle) return method.why.helps[answers.struggle];
  return `${method.name} does not directly target “${labelOf("struggle", answers.struggle)}”, but it fits the rest of what you told us.`;
}

// How long they have, said the way the student would, and what that allows for any method that fits it.
const TIMELINES = {
  soon: { phrase: "only a day or two", meaning: "That is too little time to spread things out, so you need something that works in one or two sittings." },
  week: { phrase: "a few days to two weeks", meaning: "That is enough time to repeat it across several sessions." },
  long: { phrase: "more than two weeks", meaning: "That gives you room to space sessions out over weeks, which helps what you learn last." },
  none: { phrase: "no deadline", meaning: "Without a deadline you can set your own pace." },
};

/**
 * What is true for every method, said once at the top of the results: your problem in your own words,
 * what is probably going on, and what your deadline allows. Returns { said, diagnosis, timeline }.
 */
export function describeSituation(answers) {
  const timeline = TIMELINES[answers.horizon];
  return {
    said: answers.struggle === "none" ? "You said nothing in particular is getting in your way." : `You said: “${labelOf("struggle", answers.struggle)}”.`,
    diagnosis: optionOf("struggle", answers.struggle).diagnosis,
    timeline: timeline ? `You have ${timeline.phrase}. ${timeline.meaning}` : "",
  };
}

/** One labelled row of a card: which part of the student's situation it is about (`question` is that question's id), their answer, and why this method suits it. */
function row(kind, questionId, answers, text) {
  return { kind, question: questionId, answer: labelOf(questionId, answers[questionId]), text };
}

function rowsFor(method, answers, matches) {
  const rows = [row("For your problem", "struggle", answers, problemSentence(method, answers, matches))];
  if (matches.material) rows.push(row("For your material", "material", answers, method.why.fitsMaterial[answers.material]));
  if (matches.task) rows.push(row("For your task", "task", answers, method.why.fitsTask[answers.task]));
  if (matches.subject) rows.push(row("For your subject", "subject", answers, "It was built for this subject."));
  if (matches.horizon) rows.push(row("For your deadline", "horizon", answers, `A session takes about ${method.minutes} minutes, which fits the time you have.`));
  return rows;
}

function comparisonSentence(answers, result, top) {
  const name = top.method.name;
  const decisive = IMPORTANCE.find((key) => answers[key] && top.matches[key] && !result.matches[key]);
  if (decisive) return `${name} came first because it fits ${FIT_PHRASES[decisive](answers)}, and ${result.method.name} does not.`;
  if (top.score - result.score <= CLOSE_CALL) return `${name} and ${result.method.name} were nearly tied for your answers, and ${name} edged ahead.`;
  return `${name} came first because it scored higher overall for your answers.`;
}

/**
 * Plain-words explanation of one recommendation.
 * `result` is an entry from recommend(), `rank` its position (0 is best), `top` the best entry.
 * Returns { rows, comparison }: labelled rows on how the method suits each part of the student's situation (the problem
 * row always comes first), and, for anything but the best match, why it came behind.
 */
export function explainRecommendation(answers, result, rank, top) {
  return {
    rows: rowsFor(result.method, answers, result.matches),
    comparison: rank === 0 ? null : comparisonSentence(answers, result, top),
  };
}
