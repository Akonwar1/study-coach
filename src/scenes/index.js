// Every guided-step scene, by name. A step asks for one with `visual: { name }` in methods.js.

import { ACTIVE_RECALL_SCENES } from "./active-recall.js";
import { DISTRIBUTED_PRACTICE_SCENES } from "./distributed-practice.js";
import { DUAL_CODING_SCENES } from "./dual-coding.js";
import { ELABORATIVE_INTERROGATION_SCENES } from "./elaborative-interrogation.js";
import { FEYNMAN_SCENES } from "./feynman.js";
import { INTERLEAVING_SCENES } from "./interleaving.js";
import { POMODORO_SCENES } from "./pomodoro.js";
import { PROBLEM_FIRST_SCENES } from "./problem-first.js";
import { SELF_EXPLANATION_SCENES } from "./self-explanation.js";
import { SPACED_REPETITION_SCENES } from "./spaced-repetition.js";
import { SQ3R_SCENES } from "./sq3r.js";
import { TRY_FIRST_SCENES } from "./try-first.js";
import { WORKED_EXAMPLES_SCENES } from "./worked-examples.js";

export const SCENES = {
  ...ACTIVE_RECALL_SCENES,
  ...SPACED_REPETITION_SCENES,
  ...DUAL_CODING_SCENES,
  ...FEYNMAN_SCENES,
  ...ELABORATIVE_INTERROGATION_SCENES,
  ...SELF_EXPLANATION_SCENES,
  ...SQ3R_SCENES,
  ...INTERLEAVING_SCENES,
  ...POMODORO_SCENES,
  ...DISTRIBUTED_PRACTICE_SCENES,
  ...TRY_FIRST_SCENES,
  ...WORKED_EXAMPLES_SCENES,
  ...PROBLEM_FIRST_SCENES,
};
