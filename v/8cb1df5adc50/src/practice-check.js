// Checks a written practice answer in the app itself, with no AI request: which of the question's key points the
// answer mentions (by the words the AI listed for each point when it wrote the question), and, for a worked problem
// whose answer is one number, whether the last number the student wrote matches it. From that it suggests a mark.
//
// Matching words is rough: a correct answer worded differently can be missed. So the screen says a point was "not
// found", never that it is wrong, the mark stays the student's, and the optional AI feedback can read the answer
// properly. Plain functions only: no page, no network.

/** A crude stem, so "cases"/"case" and "waiting"/"wait" compare equal. Good enough for spotting words, not grammar. */
function stem(word) {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && /(ss|sh|ch|x|z)es$/.test(word)) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  return word;
}

const words = (text) => (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).map(stem);

/** Two stems match if equal, or if the shorter (4+ letters) starts the longer: "recurs" matches "recursion". */
function sameWord(a, b) {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 4 && long.startsWith(short);
}

/**
 * True if `text` mentions `term`: every word of the term appears somewhere in the text. A term with no letters or
 * digits (a symbol such as "*" or "=") is looked for as it is.
 */
export function mentions(text, term) {
  const termWords = words(term);
  if (termWords.length === 0) return term.trim() !== "" && text.includes(term.trim());
  const textWords = words(text);
  return termWords.every((wanted) => textWords.some((word) => sameWord(word, wanted)));
}

/** Every number in `text`, in order: signs, decimals and thousands commas understood ("1,024" is 1024). */
export function findNumbers(text) {
  const found = text.match(/(?:(?<![\w.])-)?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?/g) ?? [];
  return found.map((number) => Number(number.replaceAll(",", "")));
}

const close = (a, b) => Math.abs(a - b) <= 1e-9 + 0.005 * Math.abs(b);

/**
 * For a worked problem whose answer holds exactly one number: { expected, given, match }, comparing it with the last
 * number the student wrote. null when there is nothing to compare.
 */
function checkNumber(question, typed) {
  if (question.kind !== "problem") return null;
  const expected = findNumbers(question.answer);
  const given = findNumbers(typed);
  if (expected.length !== 1 || given.length === 0) return null;
  const last = given.at(-1);
  return { expected: expected[0], given: last, match: close(last, expected[0]) };
}

/**
 * Checks `typed` against `question`. Returns { points: [{ point, found }], number, suggested }, where `suggested` is
 * "got", "partly", "missed", or null when there was nothing to check (a blank answer, or a question saved before
 * key points existed).
 */
export function checkWrittenAnswer(question, typed) {
  if (!typed.trim()) return { points: [], number: null, suggested: null };
  const points = (question.keyPoints ?? []).map(({ point, terms }) => ({ point, found: terms.some((term) => mentions(typed, term)) }));
  const number = checkNumber(question, typed);
  const foundCount = points.filter((point) => point.found).length;
  let suggested = null;
  if (number) suggested = number.match ? "got" : foundCount > 0 ? "partly" : "missed";
  else if (points.length > 0) suggested = foundCount === points.length ? "got" : foundCount > 0 ? "partly" : "missed";
  return { points, number, suggested };
}
