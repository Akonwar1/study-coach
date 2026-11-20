// The question bank: every practice question the student has been shown, kept in this browser and grouped by what is
// being studied (class + topic), with every result (right, close = a written answer marked Partly, missed). From it,
// plain code works out the standing: per idea (a question's `concept`), per topic, and per class or subject area.
// No AI request is involved (PLAN.md, AI practice step 2c-1). Your stats (src/practice-stats.js) and 2c-2 ("Practise my
// weak spots") build on these.
//
// The bank is a plain object so it can be saved as JSON (src/storage.js):
//   { version: 2, topics: { [topicKey]: { course, topic, label, subject, categories: { [idea]: category }, questions: [
//       { key, question, addedAt, results: [{ outcome, at, attempt, level }] } ] } } }
// `attempt` names one answer slot in one set, so changing a mark replaces that result instead of adding another.
// `level` is the level the set was asked at (a PRACTICE_DIFFICULTIES id), missing for answers from before it was kept.
// An idea's broader category comes from `categories` (set when older ideas are grouped; keyed by the idea's name in
// lower case) or else from its questions' own `category`, written by the AI with them; "" means not grouped yet.
// `label` is a short name for the topic written by the AI with the first set that had one ("Federal Indian policy"),
// shown as the topic's header instead of the wording typed in the form; "" until then.
// Every function that changes a bank changes it in place and returns it.
import { SUBJECT_QUESTION } from "./questions.js";

// How much each outcome is worth when working out a strength.
const SCORE = { right: 1, close: 0.5, missed: 0 };
// Strength looks at an idea's most recent answers; each one older counts FADE times as much as the one after it.
const RECENT = 8;
const FADE = 0.7;
// Limits so the bank stays small in storage: results kept per question, questions kept per topic.
const KEEP_RESULTS = 20;
const KEEP_QUESTIONS = 200;
const LEVELS = [
  { id: "needs-work", label: "Needs work", below: 0.5 },
  { id: "getting-there", label: "Getting there", below: 0.8 },
  { id: "solid", label: "Solid", below: Infinity },
];
const DAY = 86_400_000;

const squash = (text) => String(text ?? "").toLowerCase().replace(/\s+/g, " ").trim();
const tidy = (text) => String(text ?? "").replace(/\s+/g, " ").trim();
const mean = (values) => (values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length);
const latest = (results) => results.reduce((last, result) => (!last || result.at > last.at ? result : last), null);

/** The same question asked again matches whatever its capitals, spacing or end punctuation. */
export const questionKey = (prompt) => squash(prompt).replace(/[\s.?!:;,]+$/, "");

/** Which group a question belongs to: its class and topic, matched without caring about capitals or spacing. */
export const topicKey = ({ course, topic }) => `${squash(course)}|${squash(topic)}`;

// Version 2 (2026-11-15): answers from before levels were kept were cleared once, at the student's request (see cleanBank).
const BANK_VERSION = 2;
export const emptyBank = () => ({ version: BANK_VERSION, topics: {} });

/** The bank's entry for what `about` describes ({ course, topic, subject }), made if `create` and missing. */
function topicEntry(bank, about, create) {
  const key = topicKey(about);
  if (!bank.topics[key] && create) bank.topics[key] = { course: tidy(about.course), topic: tidy(about.topic), subject: about.subject ?? "", questions: [] };
  const entry = bank.topics[key] ?? null;
  if (entry && about.subject && !entry.subject) entry.subject = about.subject;
  return entry;
}

/** The kept copy of `question` in `entry`, added if it is new. Past the limit, the oldest unanswered question goes first. */
function keep(entry, question, now) {
  const key = questionKey(question.prompt);
  let kept = entry.questions.find((candidate) => candidate.key === key);
  if (!kept) {
    kept = { key, question: { ...question }, addedAt: now, results: [] };
    entry.questions.push(kept);
    if (entry.questions.length > KEEP_QUESTIONS) {
      const unanswered = entry.questions.filter((candidate) => candidate.results.length === 0 && candidate !== kept);
      const drop = (unanswered.length > 0 ? unanswered : entry.questions).reduce((oldest, candidate) => (candidate.addedAt < oldest.addedAt ? candidate : oldest));
      entry.questions.splice(entry.questions.indexOf(drop), 1);
    }
  }
  return kept;
}

/** Keeps every question in `questions` under what `about` describes, skipping any already kept. */
export function addQuestions(bank, about, questions, now = Date.now()) {
  const entry = topicEntry(bank, about, true);
  questions.forEach((question) => keep(entry, question, now));
  return bank;
}

/**
 * Records how the student did on `question` ("right", "close" or "missed"; anything else is ignored), keeping the
 * question too if it is new. A result with the same `attempt` as an earlier one replaces it (the mark was changed).
 */
export function recordResult(bank, about, question, outcome, { at = Date.now(), attempt = null, level = null } = {}) {
  if (!(outcome in SCORE)) return bank;
  const kept = keep(topicEntry(bank, about, true), question, at);
  const result = { outcome, at, attempt, level: typeof level === "string" ? level : null };
  const same = attempt === null ? -1 : kept.results.findIndex((earlier) => earlier.attempt === attempt);
  if (same >= 0) kept.results[same] = result;
  else kept.results.push(result);
  kept.results.sort((a, b) => a.at - b.at);
  kept.results.splice(0, Math.max(0, kept.results.length - KEEP_RESULTS));
  return bank;
}

/** From 0 (all missed) to 1 (all right), recent answers counting more; null with nothing answered. */
export function strengthOf(results) {
  if (results.length === 0) return null;
  const recent = [...results].sort((a, b) => b.at - a.at).slice(0, RECENT);
  const weights = recent.map((_, i) => FADE ** i);
  return recent.reduce((sum, result, i) => sum + weights[i] * SCORE[result.outcome], 0) / weights.reduce((sum, weight) => sum + weight, 0);
}

/** The plain word for a strength: Needs work, Getting there or Solid. */
export const levelOf = (strength) => LEVELS.find((level) => strength < level.below);

/**
 * How the student stands on the topic `about` describes, or null if nothing on it was ever shown: each idea answered
 * (weakest first, with its strength, level and counts), how many questions are kept and answered, how many wait for
 * review (the last answer was missed or close), ideas shown but never answered, and when it was last answered.
 */
export function topicStanding(bank, about) {
  const entry = bank.topics[topicKey(about)];
  return entry ? standingOf(entry) : null;
}

function standingOf(entry) {
  const answered = entry.questions.filter((kept) => kept.results.length > 0);
  const ideas = new Map();
  for (const kept of answered) {
    const id = squash(kept.question.concept);
    const idea = ideas.get(id) ?? { concept: tidy(kept.question.concept) || "Other questions", results: [], questions: 0, lastAt: 0 };
    const last = latest(kept.results);
    idea.lastAt = Math.max(idea.lastAt, last.at); // the idea keeps the wording it was first seen with, so it does not jump about
    idea.results.push(...kept.results);
    idea.questions += 1;
    ideas.set(id, idea);
  }
  const ideaList = [...ideas.values()].map(({ results, ...idea }) => {
    const strength = strengthOf(results);
    const count = (outcome) => results.filter((result) => result.outcome === outcome).length;
    return { ...idea, strength, level: levelOf(strength), right: count("right"), close: count("close"), missed: count("missed") };
  }).sort((a, b) => a.strength - b.strength || b.lastAt - a.lastAt || a.concept.localeCompare(b.concept));
  const untried = new Set(entry.questions.filter((kept) => kept.results.length === 0).map((kept) => squash(kept.question.concept)).filter((id) => id && !ideas.has(id)));
  const strength = mean(ideaList.map((idea) => idea.strength));
  return {
    course: entry.course,
    topic: entry.topic,
    subject: entry.subject,
    ideas: ideaList,
    strength,
    level: strength === null ? null : levelOf(strength),
    questions: entry.questions.length,
    answered: answered.length,
    toReview: answered.filter((kept) => latest(kept.results).outcome !== "right").length,
    notTried: untried.size,
    lastPracticed: Math.max(0, ...ideaList.map((idea) => idea.lastAt)),
  };
}

/** A subject area's name as the Practice form lists it, or "No subject area given". */
export const subjectName = (id) => SUBJECT_QUESTION.options.find((option) => option.id === id && id !== "other")?.label ?? "No subject area given";

/**
 * Each idea's broader category in `entry`, keyed by the idea's name in lower case: its grouping if it was grouped,
 * else the first category any of its questions came with. So every question on an idea shares one category, even
 * one asked before categories existed.
 */
export function ideaCategories(entry) {
  const found = new Map(Object.entries(entry.categories ?? {}).map(([idea, category]) => [idea, tidy(category)]));
  for (const kept of entry.questions) {
    const idea = squash(kept.question.concept);
    if (!found.get(idea) && tidy(kept.question.category)) found.set(idea, tidy(kept.question.category));
  }
  return found;
}

/** The broader category of `question` in `entry` (see ideaCategories); "" if not grouped yet. Pass `known` to reuse one map. */
export function categoryFor(entry, question, known = ideaCategories(entry)) {
  return known.get(squash(question.concept)) || tidy(question.category);
}

/** The categories used in `entry`, keyed by name in lower case, each in the wording first seen, oldest first. */
function categoryNames(entry, known = ideaCategories(entry)) {
  const found = new Map();
  for (const kept of entry.questions) {
    const name = categoryFor(entry, kept.question, known);
    if (name && !found.has(squash(name))) found.set(squash(name), name);
  }
  return found;
}

/** Every category used on the topic `about` describes, in the wording first seen, oldest first. */
export function topicCategories(bank, about) {
  const entry = bank.topics[topicKey(about)];
  return entry ? [...categoryNames(entry).values()] : [];
}

// The student's own category names (step B, 2026-11-15: "AI names, you can change"). Their names are kept as an idea's
// grouping, which wins over the category the AI wrote on any question, so later AI questions on the idea follow them.
export const CATEGORY_NAME_LIMIT = 60;
const UNGROUPED_NAME = "Not grouped yet"; // the row for ideas with no category (practice-stats.js UNGROUPED)

/** A category name the student typed, tidied, as { name }, or { error } saying what to change. */
export function cleanCategoryName(name) {
  const cleaned = tidy(name);
  if (!cleaned) return { error: "Give the category a name." };
  if (cleaned.length > CATEGORY_NAME_LIMIT) return { error: `Keep the name to ${CATEGORY_NAME_LIMIT} characters or fewer.` };
  if (squash(cleaned) === squash(UNGROUPED_NAME)) return { error: `“${UNGROUPED_NAME}” is kept for ideas with no category. Choose another name.` };
  return { name: cleaned };
}

/**
 * Renames the category `from` on the topic `about` describes to `to`, for every idea in it, answered or not. If the
 * topic already has a category called `to` (whatever its capitals), the two merge under that one's wording. Returns
 * { from, name, merged }, or { error } with nothing changed.
 */
export function renameCategory(bank, about, from, to) {
  const cleaned = cleanCategoryName(to);
  const entry = bank.topics[topicKey(about)];
  if (cleaned.error || !entry) return { error: cleaned.error ?? "That topic is not in your question bank." };
  const known = ideaCategories(entry);
  const names = categoryNames(entry, known);
  const old = squash(from);
  const existing = names.get(squash(cleaned.name));
  const merged = Boolean(existing) && squash(cleaned.name) !== old;
  const name = merged ? existing : cleaned.name;
  const ideas = new Map(entry.questions.filter((kept) => squash(categoryFor(entry, kept.question, known)) === old)
    .map((kept) => [squash(kept.question.concept), kept.question.concept]));
  setIdeaCategories(bank, about, [...ideas.values()].map((idea) => ({ idea, category: name })));
  return { from: names.get(old) ?? tidy(from), name, merged };
}

/**
 * Files the idea `idea` on the topic `about` describes, and every question on it, under the category `to`: an existing
 * one (whatever its capitals; its wording is kept) or a new one. Returns { name, created }, or { error } with nothing changed.
 */
export function moveIdea(bank, about, idea, to) {
  const cleaned = cleanCategoryName(to);
  const entry = bank.topics[topicKey(about)];
  if (cleaned.error || !entry) return { error: cleaned.error ?? "That topic is not in your question bank." };
  const existing = categoryNames(entry).get(squash(cleaned.name));
  setIdeaCategories(bank, about, [{ idea, category: existing ?? cleaned.name }]);
  return { name: existing ?? cleaned.name, created: !existing };
}

/** The ideas on the topic `about` describes that have no category yet, in the order first seen. */
export function ungroupedIdeas(bank, about) {
  const entry = bank.topics[topicKey(about)];
  if (!entry) return [];
  const found = new Map();
  const known = ideaCategories(entry);
  for (const kept of entry.questions) {
    const idea = tidy(kept.question.concept);
    if (idea && !categoryFor(entry, kept.question, known) && !found.has(squash(idea))) found.set(squash(idea), idea);
  }
  return [...found.values()];
}

/** Files ideas under categories on the topic `about` describes, from [{ idea, category }]; later questions on them join too. */
export function setIdeaCategories(bank, about, groups) {
  const entry = topicEntry(bank, about, true);
  entry.categories = { ...entry.categories };
  for (const { idea, category } of groups) if (tidy(idea) && tidy(category)) entry.categories[squash(idea)] = tidy(category);
  return bank;
}

/** Gives the topic `about` describes its short label, unless it already has one, so its header stays the same. */
export function setTopicLabel(bank, about, label) {
  const entry = topicEntry(bank, about, true);
  if (!entry.label && tidy(label)) entry.label = tidy(label);
  return bank;
}

/** A topic's header: its short label, else the wording typed in the form, else "No topic given". */
export const topicLabelOf = (entry) => tidy(entry.label) || entry.topic || "No topic given";

/** "today", "yesterday" or "4 days ago", by calendar day on this computer. */
export function whenLabel(at, now = Date.now()) {
  const startOf = (time) => { const day = new Date(time); day.setHours(0, 0, 0, 0); return day.getTime(); };
  const days = Math.max(0, Math.round((startOf(now) - startOf(at)) / DAY));
  return days === 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
}

/**
 * A bank read back from storage, with anything that does not fit the shape above dropped. A bank from before version 2
 * also loses the answers saved without a level, and any topic left with no answers: the student asked for those to be
 * removed (2026-11-15), because their level and category could not be known and they made Your stats look wrong.
 */
export function cleanBank(raw) {
  const bank = emptyBank();
  if (!raw || typeof raw !== "object" || !raw.topics || typeof raw.topics !== "object") return bank;
  const clearOld = !(raw.version >= BANK_VERSION);
  for (const entry of Object.values(raw.topics)) {
    if (!entry || typeof entry !== "object" || !Array.isArray(entry.questions)) continue;
    const about = { course: typeof entry.course === "string" ? entry.course : "", topic: typeof entry.topic === "string" ? entry.topic : "", subject: typeof entry.subject === "string" ? entry.subject : "" };
    const clean = topicEntry(bank, about, true);
    if (typeof entry.label === "string") setTopicLabel(bank, about, entry.label);
    if (entry.categories && typeof entry.categories === "object") {
      setIdeaCategories(bank, about, Object.entries(entry.categories).filter(([, category]) => typeof category === "string").map(([idea, category]) => ({ idea, category })));
    }
    for (const kept of entry.questions) {
      if (!kept || typeof kept.question?.prompt !== "string" || !kept.question.prompt.trim()) continue;
      const results = (Array.isArray(kept.results) ? kept.results : [])
        .filter((result) => result && result.outcome in SCORE && Number.isFinite(result.at) && !(clearOld && typeof result.level !== "string"))
        .map(({ outcome, at, attempt, level }) => ({ outcome, at, attempt: typeof attempt === "string" ? attempt : null, level: typeof level === "string" ? level : null }))
        .slice(-KEEP_RESULTS);
      const into = keep(clean, kept.question, Number.isFinite(kept.addedAt) ? kept.addedAt : 0);
      into.results.push(...results);
    }
  }
  if (clearOld) {
    for (const [key, entry] of Object.entries(bank.topics)) if (!entry.questions.some((kept) => kept.results.length > 0)) delete bank.topics[key];
  }
  return bank;
}
