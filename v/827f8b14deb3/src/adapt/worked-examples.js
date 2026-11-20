// How Worked Examples' guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for "doesn't make sense" or solving new problems (the method is built for both), for "can't tell what I know" (the last
// problem already has no help), for "can't get started" (studying a solved example already asks little), or for the other deadlines.
// A rule that appends to a step comes after any rule that sets the same step.
import { append, capTimers, rule, set } from "../adapt-kit.js";

export const WORKED_EXAMPLES_ADAPT = [
  rule({ horizon: ["soon"] },
    "With 2 days or less, one more no-help problem tomorrow, before your deadline, comes before any move to mixed practice.",
    "One more no-help problem tomorrow, before your deadline.",
    set("next", {
      instruction: "Done when you can solve a new problem of this type with no example in view. Tomorrow, before your deadline, do one more problem of this type with no example in view. If you can’t yet, repeat from step 2 with a different example, tonight or tomorrow.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so no timer is longer than 5 minutes, and you use short problems of a few steps.",
    "Timers cut to 5 minutes, with short problems.",
    capTimers(5),
    append("collect", "Pick short problems of only a few steps each, so each one fits in the shorter timers.")),
  rule({ struggle: ["forget"] },
    "You said it slips away, so tomorrow starts with a problem of this type and no example in sight.",
    "Tomorrow starts with a no-example problem of this type.",
    append("next", "Tomorrow, before you look at any example, solve a problem of this type with no help; whatever you can’t do from memory is what to practise.")),
];
