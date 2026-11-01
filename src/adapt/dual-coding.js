// How Dual Coding's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for forgetting, "doesn't make sense" or explaining it (the method is built for all three), nor for the other deadlines
// (the sketch is already kept for review). A rule that appends to a step comes after any rule that sets the same step.
import { append, capTimers, rule, set } from "../adapt-kit.js";

export const DUAL_CODING_ADAPT = [
  rule({ horizon: ["soon"] },
    "With 2 days or less, the sketch becomes your review sheet, used again tonight and tomorrow, not a week from now.",
    "The sketch is reviewed tonight and tomorrow.",
    set("explain", {
      instruction: "Using only your sketch, explain the topic out loud from start to finish. Where the picture fails you, you have a gap to review next. Done when your sketch alone is enough to explain the whole topic. Then keep it for review: go through it again tonight, and once more tomorrow before your deadline.",
      mindset: "Explaining from the sketch alone tests whether the drawing holds the whole idea. When you lose your place, the picture is missing something, so add it. With your deadline close, the sketch is your review sheet: going through it tonight and tomorrow is the whole plan.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so no timer is longer than 4 minutes and you draw half a page of material.",
    "Timers cut to 4 minutes, with half a page of material.",
    capTimers(4),
    append("pick", "Choose half a page, not a whole one, so the shorter timers are enough.")),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so you pick the smallest topic, and three or four boxes count as a full drawing.",
    "The smallest topic, and a few boxes are enough.",
    append("pick", "Choose the smallest topic you have, one with only three or four parts."),
    append("redraw", "For now, three or four boxes with the arrows between them is a full drawing.")),
  rule({ task: ["apply"] },
    "You’ll have to solve new problems, so the last step traces a new case through your sketch.",
    "A new case is traced through the sketch.",
    append("explain", "Because you will have to solve new problems, also trace one new case through your sketch, step by step, and say what happens at each arrow.")),
];
