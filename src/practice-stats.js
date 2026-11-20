// Your stats: plain numbers from every answer in the question bank (src/question-bank.js), so the student can see how
// they are doing in a class, subject area, topic, question type, level or idea, over a chosen time range. Every number
// is a count or a percentage of a count, never a score made up from weights, so it can be checked against what the
// student did (their ask, 2026-11-15: "quantifiable and real data ... easy, reliable, and intuitive"). No AI request.
import { PRACTICE_DIFFICULTIES, PRACTICE_KINDS } from "./practice.js";
import { categoryFor, ideaCategories, subjectName, topicKey, topicLabelOf } from "./question-bank.js";
import { SUBJECT_QUESTION } from "./questions.js";

const DAY = 86_400_000;
// How many of an idea's latest answers are shown as marks.
const LAST_SHOWN = 5;
const squash = (text) => String(text ?? "").toLowerCase().replace(/\s+/g, " ").trim();
const tidy = (text) => String(text ?? "").replace(/\s+/g, " ").trim();
const startOfDay = (time) => { const day = new Date(time); day.setHours(0, 0, 0, 0); return day.getTime(); };
/** Whole-number % of `part` in `whole`, or null when there is nothing to divide by (so no percentage is made up). */
const percentOf = (part, whole) => (whole === 0 ? null : Math.round((100 * part) / whole));
const isLevel = (id) => PRACTICE_DIFFICULTIES.some((level) => level.id === id);
export const UNGROUPED = "Not grouped yet";
/** A category's key: its topic and its name, since two topics can use the same name. Ungrouped ideas have the name "". */
export const categoryKeyOf = (topic, name) => `${topic}\n${squash(name)}`;
const categoryKey = (row) => categoryKeyOf(row.topicKey, row.category);

/** Every answer in the bank as one flat row, with what it was about. */
function answerRows(bank) {
  return Object.values(bank.topics).flatMap((entry) => {
    const key = topicKey(entry);
    const known = ideaCategories(entry);
    return entry.questions.flatMap((kept) => kept.results.map((result) => ({
      outcome: result.outcome,
      at: result.at,
      level: isLevel(result.level) ? result.level : null,
      kind: kept.question.kind,
      concept: tidy(kept.question.concept) || "Other questions",
      category: categoryFor(entry, kept.question, known),
      question: `${key}\n${kept.key}`,
      topicKey: key,
      course: entry.course,
      topic: topicLabelOf(entry), // the short label where there is one
      typed: entry.topic, // the wording typed in the form
      subject: entry.subject,
    })));
  });
}

/** Whether a row fits the class, subject area, topic and category chosen ("" for any). */
const fits = (row, { course = "", subject = "", topic = "", category = "" }) =>
  (!course || squash(row.course) === squash(course)) && (!subject || row.subject === subject) && (!topic || row.topicKey === topic)
  && (!category || categoryKey(row) === category);

/** Right, close and missed counts, how many in all, and % right out of all of them. */
function countsOf(rows) {
  const count = (outcome) => rows.filter((row) => row.outcome === outcome).length;
  const right = count("right");
  return { answered: rows.length, right, close: count("close"), missed: count("missed"), percentRight: percentOf(right, rows.length) };
}

/** The questions whose most recent answer (at any time) was close or missed: what waits for review. */
function waitingForReview(rows) {
  const latest = new Map();
  for (const row of rows) if (!latest.has(row.question) || row.at > latest.get(row.question).at) latest.set(row.question, row);
  return new Set([...latest.values()].filter((row) => row.outcome !== "right").map((row) => row.question));
}

/** Rows grouped by `keyOf`, keeping the first row of each group for its labels. */
function groupBy(rows, keyOf) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.entries()];
}

/**
 * The numbers for `filters` ({ course, subject, topic, category, days }; "" or null for any, days 7, 30 or null for all time):
 *   totals  { answered, right, close, missed, percentRight, toReview, questions, days, firstAt }
 *   byKind  one row per question type answered, in the form's order
 *   byLevel one row per level answered, then "Level not recorded" for older answers
 *   categories one row per broader category within a topic, weakest first and "Not grouped yet" last, each with its ideas
 *   ideas   one row per idea (a concept within a topic), with its category and its latest answers newest first
 *   topics  one row per topic, most recently practised first
 * What waits for review ignores the time range: it is about the latest answer to each question.
 */
export function practiceStats(bank, filters, now = Date.now()) {
  const inScope = answerRows(bank).filter((row) => fits(row, filters));
  const from = filters.days ? startOfDay(now) - (filters.days - 1) * DAY : -Infinity;
  const rows = inScope.filter((row) => row.at >= from);
  const review = waitingForReview(inScope);
  const totals = {
    ...countsOf(rows),
    toReview: review.size,
    questions: new Set(rows.map((row) => row.question)).size,
    days: new Set(rows.map((row) => startOfDay(row.at))).size,
    firstAt: rows.length === 0 ? null : Math.min(...rows.map((row) => row.at)),
  };
  const byKind = PRACTICE_KINDS.map((kind) => ({ id: kind.id, label: kind.label, ...countsOf(rows.filter((row) => row.kind === kind.id)) }))
    .filter((row) => row.answered > 0);
  const byLevel = [...PRACTICE_DIFFICULTIES, { id: null, label: "Level not recorded" }]
    .map((level) => ({ id: level.id, label: level.label, ...countsOf(rows.filter((row) => row.level === level.id)) }))
    .filter((row) => row.answered > 0);
  const ideas = groupBy(rows, (row) => `${row.topicKey}\n${squash(row.concept)}`).map(([, group]) => {
    const newest = [...group].sort((a, b) => b.at - a.at);
    return {
      concept: group[0].concept, topic: group[0].topic, typed: group[0].typed, course: group[0].course, topicKey: group[0].topicKey, category: group[0].category || UNGROUPED,
      ...countsOf(group), last: newest.slice(0, LAST_SHOWN).map((row) => row.outcome), lastAt: newest[0].at,
    };
  });
  const topics = groupBy(rows, (row) => row.topicKey).map(([key, group]) => ({
    key, course: group[0].course, topic: group[0].topic, typed: group[0].typed, subject: group[0].subject, ...countsOf(group),
    ideas: new Set(group.map((row) => squash(row.concept))).size,
    toReview: [...review].filter((question) => question.startsWith(`${key}\n`)).length,
    ungrouped: new Set(group.filter((row) => !row.category).map((row) => squash(row.concept))).size,
    lastAt: Math.max(...group.map((row) => row.at)),
  })).sort((a, b) => b.lastAt - a.lastAt);
  const categories = groupBy(rows, categoryKey).map(([key, group]) => {
    const questions = new Set(group.map((row) => row.question));
    const ideasIn = ideas.filter((idea) => `${idea.topicKey}\n${squash(idea.category === UNGROUPED ? "" : idea.category)}` === key);
    return {
      key, name: group[0].category || UNGROUPED, grouped: Boolean(group[0].category), topicKey: group[0].topicKey, topic: group[0].topic, course: group[0].course,
      ...countsOf(group), toReview: [...review].filter((question) => questions.has(question)).length,
      ideas: sortIdeas(ideasIn, "lowest"), lastAt: Math.max(...group.map((row) => row.at)),
    };
  }).sort((a, b) => Number(b.grouped) - Number(a.grouped) || a.percentRight - b.percentRight || b.answered - a.answered || a.name.localeCompare(b.name));
  return { totals, byKind, byLevel, categories, ideas, topics };
}

// How the ideas table can be sorted: the menu's choices and how each orders two ideas.
export const IDEA_SORTS = [
  { id: "lowest", label: "Lowest % right", compare: (a, b) => a.percentRight - b.percentRight || b.answered - a.answered },
  { id: "highest", label: "Highest % right", compare: (a, b) => b.percentRight - a.percentRight || b.answered - a.answered },
  { id: "most", label: "Most answered", compare: (a, b) => b.answered - a.answered || b.lastAt - a.lastAt },
  { id: "recent", label: "Most recent", compare: (a, b) => b.lastAt - a.lastAt },
  { id: "az", label: "A to Z", compare: () => 0 },
];

/** The ideas in the order `by` names (an IDEA_SORTS id); ties go A to Z by idea, then topic. */
export function sortIdeas(ideas, by) {
  const sort = IDEA_SORTS.find((option) => option.id === by) ?? IDEA_SORTS[0];
  return [...ideas].sort((a, b) => sort.compare(a, b) || a.concept.localeCompare(b.concept) || a.topic.localeCompare(b.topic));
}

/** The ideas whose name, category, topic or class contains `text`, without caring about capitals; all of them if it is empty. */
export function searchIdeas(ideas, text) {
  const wanted = squash(text);
  return wanted ? ideas.filter((idea) => squash(`${idea.concept} ${idea.category} ${idea.topic} ${idea.typed} ${idea.course}`).includes(wanted)) : ideas;
}

/**
 * What the filter menus offer: only classes, subject areas, topics and categories with answers. Topics follow the
 * class and subject area chosen, and categories the topic too, so a menu never offers one that would show nothing.
 */
export function filterOptions(bank, filters) {
  const rows = answerRows(bank);
  const courses = new Map(rows.filter((row) => row.course).map((row) => [squash(row.course), row.course]));
  const subjects = SUBJECT_QUESTION.options.filter((option) => rows.some((row) => row.subject === option.id))
    .map((option) => ({ id: option.id, label: subjectName(option.id) }));
  const topics = new Map(rows.filter((row) => fits(row, { course: filters.course, subject: filters.subject }))
    .map((row) => [row.topicKey, { key: row.topicKey, label: row.topic, course: row.course }]));
  const categories = new Map(rows.filter((row) => fits(row, { course: filters.course, subject: filters.subject, topic: filters.topic }))
    .map((row) => [categoryKey(row), { key: categoryKey(row), label: row.category || UNGROUPED, grouped: Boolean(row.category), topic: row.topic }]));
  return {
    courses: [...courses.values()].sort((a, b) => a.localeCompare(b)),
    subjects,
    topics: [...topics.values()].sort((a, b) => a.label.localeCompare(b.label) || a.course.localeCompare(b.course)),
    categories: [...categories.values()].sort((a, b) => Number(b.grouped) - Number(a.grouped) || a.label.localeCompare(b.label) || a.topic.localeCompare(b.topic)),
  };
}
