// A short name for a topic, made in plain code from what the student typed: no AI request, instant, works offline.
// It heads a topic until the AI's name arrives free inside the next question request (practice.js "topicLabel"), and
// a name the student gives with Rename topic beats both (question-bank.js). Agreed 2026-11-20: the student wants topics
// sorted with no extra input from them, and Gemini kept for practice questions, never spent on names.
//
// The rules, in order: drop filler at the start ("the", "intro to", "chapter 7:"); cut where the topic stops naming
// the subject and starts describing it (commas, brackets, "and its …", "today", "for my midterm"); if still long, take
// the subject out of "X of Y" ("causes of the Great Depression on farmers" → "Great Depression"); then cut at "and"/"vs";
// then keep the first few words that carry meaning.

const MAX_WORDS = 4;
// Filler a student types before the subject itself. Repeated, so "exam 2 review" and "intro to the" both go.
const LEAD = /^(?:(?:the|a|an|my|some|basics? of|basic|intro(?:duction)? to|overview of|review(?:ing)?(?: of)?|notes? on|studying(?: for)?|study for|learning|understanding|practice(?: on| with)?|questions? (?:on|about)|how to|how|what (?:is|are)|why|(?:chapter|ch\.?|unit|section|lecture|week|module|exam|midterm|quiz|test)\s*\d+[a-z]?\s*[:\-–]?)\s+)+/i;
// Where a long topic usually turns from naming the subject to describing it; everything from here on is dropped.
const TAIL = new RegExp([
  String.raw`\s*[,;:()\[\]–—]`,
  String.raw`\s-\s`,
  String.raw` and (?:its|their|the way|how|why|what)\b`,
  String.raw` (?:including|such as|especially|e\.g\.|focusing on|with (?:a )?focus on|focused on|in particular)\b`,
  String.raw` (?:and|in|from|during|over|throughout) (?:the )?(?:past|present|today|modern)\b`,
  String.raw` (?:today|nowadays)\b`,
  String.raw` for (?:the |my )?(?:exam|midterm|final|quiz|test|class)\b`,
].map((part) => `(?:${part})`).join("|").concat(").*$").replace(/^/, "(?:"), "i");
// Small words: dropped from the middle of a name that is still too long, and never left at its end.
const SMALL = new Set(["a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "vs", "with"]);
const PREPOSITION = /^(?:on|in|for|during|from|to|among|with|by|and)$/i;
const isSmall = (word) => SMALL.has(word.toLowerCase());

/** A short name (at most 4 words) for the topic typed as `typed`, or "" when nothing was typed. */
export function shortTopicName(typed) {
  const original = String(typed ?? "").replace(/\s+/g, " ").trim().replace(/\bU\.S\b\.?/gi, "U.S.");
  if (!original) return "";
  let name = original.replace(LEAD, "");
  if (!name || name.split(" ").every(isSmall)) name = original; // "how to" alone stays as it is
  const cut = name.replace(TAIL, "").trim();
  if (cut.length >= 3) name = cut;

  let words = name.split(" ");
  // The subject after "of", up to the next preposition: "effects of the Great Depression on farmers" → "Great Depression".
  if (words.length > MAX_WORDS) {
    const of = words.findIndex((word, i) => i >= 1 && word.toLowerCase() === "of");
    if (of > 0) {
      let rest = words.slice(of + 1);
      const stop = rest.findIndex((word, i) => i >= 1 && PREPOSITION.test(word));
      if (stop > 0) rest = rest.slice(0, stop);
      while (rest.length > 1 && isSmall(rest[0])) rest.shift();
      if (rest.length > 0 && rest.length <= MAX_WORDS) words = rest;
    }
  }
  // "and" or "vs" after the first two words usually starts a second subject.
  if (words.length > MAX_WORDS) {
    const at = words.findIndex((word, i) => i >= 2 && /^(?:and|vs)$/i.test(word));
    if (at > 0) words = words.slice(0, at);
  }
  // Still long: drop small words after the first (keeping "of"), then keep the first few words.
  if (words.length > MAX_WORDS) {
    words = words.filter((word, i) => i === 0 || !isSmall(word) || word.toLowerCase() === "of").slice(0, MAX_WORDS);
  }
  while (words.length > 1 && isSmall(words.at(-1))) words.pop();
  name = words.join(" ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}
