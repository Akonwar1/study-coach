// How Elaborative Interrogation's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for "doesn't make sense" or explaining it (the method is built for both), for "can't tell what I know" (you already answer
// before you look), or for deadlines beyond 2 days. A rule that appends to a step comes after any rule that sets the same step.
import { append, capTimers, rule, set } from "../adapt-kit.js";

const PICK_FIRST = "This method works on facts that have a “why”, such as causes, rules, and mechanisms. If a fact is arbitrary (a vocabulary word, a date), skip it and use Spaced Repetition.";
const REPEAT_LAST = "ask why, answer from memory, then check";

export const ELABORATIVE_INTERROGATION_ADAPT = [
  rule({ horizon: ["soon"] },
    "With 2 days or less, you can’t cover everything, so you pick the facts most likely to come up and re-ask the weak one tonight and tomorrow.",
    "Pick likely facts; re-ask the weak one tonight and tomorrow.",
    append("pick", "With so little time, choose the facts most likely to come up on your exam or deadline, not the most interesting ones."),
    set("weak-spot", {
      instruction: "Circle the fact you explained worst. Tonight, ask its why again from memory, and once more tomorrow before your deadline. If several were weak, the whole topic needs a method for understanding, such as Feynman or Self-Explanation.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so you work on 3 facts instead of 5, and no timer is longer than 4 minutes.",
    "Three facts, not five, with timers cut to 4 minutes.",
    capTimers(4),
    set("pick", { instruction: `${PICK_FIRST} Choose 3 facts or claims from your notes that have a reason behind them. Write each on its own line, leaving space below.` }),
    set("repeat", { instruction: `Do the same for the other two facts: ${REPEAT_LAST}. Give each about 2 minutes, and move on after that even if you’re unsure.` })),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so you work on 3 facts, easiest first, and you may stop after the first.",
    "Three facts, easiest first; you may stop after one.",
    set("pick", { instruction: `${PICK_FIRST} Choose 3 facts or claims from your notes that have a reason behind them, and put the one that looks easiest to explain first. Write each on its own line, leaving space below.` }),
    set("repeat", {
      minutes: 5,
      instruction: `The first fact is the main job, and you may stop after the first if you want. If you carry on, do the same for the other two: ${REPEAT_LAST}, about 2 minutes each.`,
    })),
  rule({ struggle: ["forget"] },
    "You said it slips away, so tomorrow you explain each why again from memory before looking.",
    "Tomorrow you re-explain each why from memory.",
    append("weak-spot", "Tomorrow, cover your answers and ask each why again from memory before you look at anything; the ones you can no longer explain are the ones that slipped.")),
  rule({ task: ["apply"] },
    "You’ll have to solve new problems, so each why also asks what would change if the fact were different.",
    "Each why also asks what would change in a new case.",
    append("answer", "Because you will have to use this on new problems, also ask what would change if the fact were different, and say what your explanation predicts for a new case.")),
];
