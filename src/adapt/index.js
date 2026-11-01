// Every method's tailoring rules, by method id. Each method already has an empty rules file here, an empty test file in
// tests/adapt/ and an import in tests.html, so adding a method's rules touches only its own two files.
//
// POLICY (Claude's draft, agreed to by the student by asking for the speed-ups; change it when they say so)
//   Deadline  A rule per deadline range when the method has a timeline (a schedule, review or spacing step). Skip it when the
//             deadline would change nothing, as for a method done in one sitting.
//   Problem   A rule when the steps can be reshaped to help with it. Skip it when the method is built for that problem and there is
//             nothing to add (Active Recall and "it slips away"); add one when there is something real to add (a prediction step for
//             "I can't tell what I know").
//   Task      A rule only when what a step asks for really changes (remember exactly, explain, apply). None for "not sure".
//   Claims    Add no research claim the method's own page does not already make. If a rule needs one (an interval, a figure), search
//             first, say what was checked, and flag the rule to the student.
//   Wording   Plain, written for this method. Two methods never share a reason or summary (a test fails if they do), and no rule may
//             leave the plan unchanged (also tested). Fewer, better rules beat covering every answer.
//
// WORKFLOW for each batch of three or four methods
//   0. Outline: one line per rule ("Pomodoro, can't get started: opens with a 2-minute block") for the student to cut or approve.
//      Write no wording until they have.
//      Standing permission (student, 2026-11-01): a rule that is meaningful, has a reason the student could be told, and fits the app's
//      goals needs no approval of its own, so it may be added to an approved outline and written. Say what was added. Still dropped or
//      flagged: a rule that changes nothing real, or that needs a new research claim. The student still reads every rule in step 4.
//   1. Cases first: the rule's case in tests/adapt/<method-id>.js (see tests/rule-cases.js). Run `npm test` and watch it fail.
//   2. Rules: src/adapt/<method-id>.js, using the pieces in src/adapt-kit.js. A step a rule points at needs an `id` (all have one).
//      A step a rule inserts needs a picture that exists (reuse an existing scene name, or add a scene).
//   3. `npm test` runs every test in a light and a dark colour scheme. The checks reject rules that point at a missing step, use a
//      picture that does not exist, change nothing, repeat another method's wording, or have no case.
//   4. The student reads the rules in plans.html (before and after text, Keep / Rewrite / Cut and a note, a summary to paste back).
//   5. After their review: update PLAN.md, commit, run scripts/deploy.sh.
//
// PARALLEL SESSIONS (one per method, only when the student has asked for them)
//   A session owns src/adapt/<method-id>.js and tests/adapt/<method-id>.js and nothing else, so nothing collides. It must not edit
//   PLAN.md, tests.html, src/methods.js or this file; the main session updates PLAN.md when the work is merged. In a worktree, run
//   `npm install` first (node_modules is not copied), then `npm test`. The student's review still happens once the branches are
//   together, and merging them into the main checkout is the student's call.
import { ACTIVE_RECALL_ADAPT } from "./active-recall.js";
import { SPACED_REPETITION_ADAPT } from "./spaced-repetition.js";
import { DUAL_CODING_ADAPT } from "./dual-coding.js";
import { FEYNMAN_ADAPT } from "./feynman.js";
import { ELABORATIVE_INTERROGATION_ADAPT } from "./elaborative-interrogation.js";
import { SELF_EXPLANATION_ADAPT } from "./self-explanation.js";
import { SQ3R_ADAPT } from "./sq3r.js";
import { INTERLEAVING_ADAPT } from "./interleaving.js";
import { POMODORO_ADAPT } from "./pomodoro.js";
import { DISTRIBUTED_PRACTICE_ADAPT } from "./distributed-practice.js";
import { TRY_FIRST_ADAPT } from "./try-first.js";
import { WORKED_EXAMPLES_ADAPT } from "./worked-examples.js";
import { PROBLEM_FIRST_ADAPT } from "./problem-first.js";

export const ADAPT = {
  "active-recall": ACTIVE_RECALL_ADAPT,
  "spaced-repetition": SPACED_REPETITION_ADAPT,
  "dual-coding": DUAL_CODING_ADAPT,
  "feynman": FEYNMAN_ADAPT,
  "elaborative-interrogation": ELABORATIVE_INTERROGATION_ADAPT,
  "self-explanation": SELF_EXPLANATION_ADAPT,
  "sq3r": SQ3R_ADAPT,
  "interleaving": INTERLEAVING_ADAPT,
  "pomodoro": POMODORO_ADAPT,
  "distributed-practice": DISTRIBUTED_PRACTICE_ADAPT,
  "try-first": TRY_FIRST_ADAPT,
  "worked-examples": WORKED_EXAMPLES_ADAPT,
  "problem-first": PROBLEM_FIRST_ADAPT,
};
