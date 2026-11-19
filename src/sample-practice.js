// Sample practice history, for trying Your stats with weeks of answers before there are real ones (the student asked
// for "already built up mock data that I can then add to by answering questions right or wrong", 2026-11-15).
// Loaded from sample-data.html, never by the app on its own; the snapshots use it too. Every sample answer's attempt
// starts with "sample:", so removeSampleData takes out exactly these and leaves real answers alone. The answers are
// made up (a fixed pseudo-random sequence, so every load is the same), and so are the outcomes; the questions are real
// questions on each topic, with no answers or explanations, so they are never shown as questions to answer.
import { questionKey, recordResult, setTopicLabel } from "./question-bank.js";

const DAY = 86_400_000;
const SAMPLE = "sample:";
// Days ago on which "you" practised: most weeks a few times, more often lately, never the same pattern every week.
const PRACTICE_DAYS = [0, 1, 2, 4, 5, 7, 9, 10, 13, 15, 17, 20, 22, 25, 28];
const LEVELS = ["intro", "standard", "challenging", "mixed"];

// Each topic: its class, typed wording, short label and subject area, then its ideas, each with its broader category, how often it tends to be
// right (0 to 1) and two questions as [kind, prompt]. The HIST 277 topic matches the student's own set, so their real answers join it.
const TOPICS = [
  {
    course: "CS 124", topic: "recursion", label: "Recursion", subject: "programming", ideas: [
      ["Base cases", "Writing and tracing recursion", 0.85, [["multiple-choice", "What stops a recursive function from calling itself forever?"], ["short-answer", "Why does every recursive function need a base case?"]]],
      ["The call stack", "Recursion and memory", 0.45, [["short-answer", "What does each stack frame hold during recursion?"], ["true-false", "Each recursive call gets its own copy of the function's local variables."]]],
      ["Tracing recursion", "Writing and tracing recursion", 0.6, [["problem", "What does sum(4) return if sum(n) = n + sum(n - 1) and sum(0) = 0?"], ["problem", "How many calls does fib(4) make, counting the first?"]]],
      ["Memory use", "Recursion and memory", 0.35, [["true-false", "Recursive solutions usually use less memory than loops."], ["multiple-choice", "What error does too-deep recursion cause in Java?"]]],
    ],
  },
  {
    course: "CS 124", topic: "sorting", label: "Sorting", subject: "programming", ideas: [
      ["Merging", "Merge sort", 0.8, [["short-answer", "How does merge sort combine two sorted halves?"], ["problem", "Merge [1, 4, 7] and [2, 3, 9] step by step."]]],
      ["Choosing a pivot", "Quicksort", 0.4, [["multiple-choice", "Which pivot choice gives quicksort its worst case on already sorted input?"], ["short-answer", "Why does a random pivot help quicksort?"]]],
      ["Stability", "Merge sort", 0.55, [["true-false", "Merge sort is a stable sort."], ["short-answer", "What does it mean for a sort to be stable?"]]],
    ],
  },
  {
    course: "BIOL 201", topic: "the Krebs cycle", label: "The Krebs cycle", subject: "science", ideas: [
      ["Where it happens", "Steps of the cycle", 0.9, [["multiple-choice", "Where in a eukaryotic cell does the Krebs cycle take place?"], ["true-false", "The Krebs cycle takes place in the cytoplasm."]]],
      ["What it makes", "Steps of the cycle", 0.5, [["short-answer", "What does one turn of the Krebs cycle produce?"], ["multiple-choice", "How many CO2 molecules are released per turn of the Krebs cycle?"]]],
      ["Electron carriers", "Energy carriers", 0.3, [["short-answer", "What do NADH and FADH2 carry to the electron transport chain?"], ["true-false", "FADH2 is made in the Krebs cycle."]]],
    ],
  },
  {
    course: "BIOL 201", topic: "photosynthesis", label: "Photosynthesis", subject: "science", ideas: [
      ["Light reactions", "Stages of photosynthesis", 0.7, [["short-answer", "What do the light reactions of photosynthesis produce for the Calvin cycle?"], ["multiple-choice", "Where in the chloroplast do the light reactions happen?"]]],
      ["The Calvin cycle", "Stages of photosynthesis", 0.5, [["short-answer", "What does the enzyme rubisco do?"], ["true-false", "The Calvin cycle needs light directly."]]],
    ],
  },
  {
    course: "HIST 277", topic: "indigenous federal policy in the past and its modern legacy", label: "Federal Indian policy", subject: "humanities", ideas: [
      ["Allotment Act", "Federal acts and laws", 0.65, [["multiple-choice", "What did the Dawes Act of 1887 divide reservation land into?"], ["short-answer", "How did allotment shrink the land held by tribes?"]]],
      ["Indian Boarding Schools", "Assimilation policies", 0.75, [["multiple-choice", "Which school, founded in 1879, was the first federal off-reservation boarding school?"], ["short-answer", "What were federal boarding schools meant to do to Native children's languages and cultures?"]]],
      ["Termination Policy", "Federal acts and laws", 0.4, [["multiple-choice", "Which 1953 congressional resolution announced the federal policy of termination?"], ["short-answer", "What did termination mean for a tribe's relationship with the federal government?"]]],
      ["Tribal Sovereignty", "Sovereignty and the courts", 0.5, [["multiple-choice", "Which 1832 Supreme Court case held that Georgia's laws had no force in Cherokee territory?"], ["short-answer", "What does tribal sovereignty mean in US law?"]]],
      ["Modern Legacy", "Sovereignty and the courts", 0.55, [["short-answer", "What did McGirt v. Oklahoma (2020) decide about the Muscogee (Creek) reservation?"], ["short-answer", "Name one way allotment still affects reservation land ownership today."]]],
    ],
  },
  {
    course: "MATH 241", topic: "partial derivatives", label: "Partial derivatives", subject: "quantitative", ideas: [
      ["The chain rule", "Partial derivative techniques", 0.45, [["problem", "Find dz/dt if z = x^2 y, x = t^2 and y = 3t."], ["short-answer", "When do you need the multivariable chain rule?"]]],
      ["Gradients", "Partial derivative techniques", 0.7, [["problem", "Find the gradient of f(x, y) = x^2 + 3xy at (1, 2)."], ["true-false", "The gradient points in the direction of fastest increase."]]],
    ],
  },
];

/** A fixed sequence of numbers between 0 and 1 (mulberry32), so the sample is the same every time. */
function sequence(seed) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const sampleQuestion = (concept, category, [kind, prompt]) => ({ kind, concept, category, prompt, answer: "", explanation: "", keyPoints: [] });
const SAMPLE_KEYS = new Set(TOPICS.flatMap(({ ideas }) => ideas.flatMap(([, , , questions]) => questions.map(([, prompt]) => questionKey(prompt)))));

/**
 * Adds the sample history to `bank` (and returns it): three to six answers per idea spread over the last four weeks,
 * a little better lately, a little worse at harder levels. Adding it again replaces the same answers, never doubles them.
 */
export function addSampleData(bank, now = Date.now()) {
  const random = sequence(124);
  TOPICS.forEach(({ ideas, label, ...about }) => setTopicLabel(bank, about, label));
  TOPICS.forEach(({ ideas, label, ...about }) => ideas.forEach(([concept, category, skill, questions], ideaIndex) => {
    const answers = 3 + Math.floor(random() * 4);
    for (let n = 0; n < answers; n += 1) {
      const question = sampleQuestion(concept, category, questions[n % questions.length]);
      const daysAgo = PRACTICE_DAYS[Math.floor(random() * PRACTICE_DAYS.length)];
      const level = LEVELS[Math.floor(random() * LEVELS.length)];
      const chance = skill + (daysAgo < 7 ? 0.1 : 0) - (level === "challenging" ? 0.15 : 0);
      const roll = random();
      const written = question.kind === "short-answer" || question.kind === "problem";
      const outcome = roll < chance ? "right" : written && roll < chance + 0.15 ? "close" : "missed";
      const at = now - daysAgo * DAY - Math.floor(random() * 6 * 3_600_000); // some time earlier that day or the day before
      recordResult(bank, about, question, outcome, { at, attempt: `${SAMPLE}${about.topic}:${ideaIndex}:${n}`, level });
    }
  }));
  return bank;
}

/** Takes the sample answers out of `bank` (and returns it), with sample questions and topics left empty by that. */
export function removeSampleData(bank) {
  for (const [key, entry] of Object.entries(bank.topics)) {
    entry.questions.forEach((kept) => { kept.results = kept.results.filter((result) => !result.attempt?.startsWith(SAMPLE)); });
    entry.questions = entry.questions.filter((kept) => kept.results.length > 0 || !SAMPLE_KEYS.has(kept.key));
    if (entry.questions.length === 0) delete bank.topics[key];
  }
  return bank;
}
