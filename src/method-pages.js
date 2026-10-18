// In-depth pages for the study methods, shown from the library, the coach results and a guided session.
//
// Every number here was checked against the paper it is credited to (or, for a few counts, the publisher's
// record of that paper); if a figure cannot be sourced it is described in words instead. Add a method here
// and the app starts linking to its page; methods without an entry get no link.
//
// page = {
//   glance:   [{ value, label }]                  big numbers at the top, each tied to a study named in the label
//   history:  [{ when, text }]                    timeline, oldest first
//   how:      [{ heading, text }]                 how it works
//   evidence: [{ title, text, chart? }]           one entry per study; chart is for charts.js renderBarChart
//   limits:   [{ heading, text }]                 where it falls short
//   practice: { visual, caption }                 a diagram from visuals.js, labelled as an illustration
//   sources:  [string]                            full references
// }

import activeRecall from "./pages/active-recall.js";
import distributedPractice from "./pages/distributed-practice.js";
import dualCoding from "./pages/dual-coding.js";
import elaborativeInterrogation from "./pages/elaborative-interrogation.js";
import feynman from "./pages/feynman.js";
import interleaving from "./pages/interleaving.js";
import pomodoro from "./pages/pomodoro.js";
import selfExplanation from "./pages/self-explanation.js";
import spacedRepetition from "./pages/spaced-repetition.js";
import sq3r from "./pages/sq3r.js";

export const METHOD_PAGES = {
  "active-recall": activeRecall,
  "spaced-repetition": spacedRepetition,
  "dual-coding": dualCoding,
  feynman,
  "elaborative-interrogation": elaborativeInterrogation,
  "self-explanation": selfExplanation,
  sq3r,
  interleaving,
  pomodoro,
  "distributed-practice": distributedPractice,
};

export const hasMethodPage = (methodId) => Object.hasOwn(METHOD_PAGES, methodId);
