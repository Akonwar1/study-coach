// How SQ3R's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for "can't get started" or "doesn't make sense" (the method is built for both: the survey asks almost nothing, and the
// questions build the sense), for "can't tell what I know" (the review is already a quiz), for explaining it, or for the longer
// deadlines. A rule that appends to a step comes after any rule that sets the same step.
import { append, capTimers, rule, set } from "../adapt-kit.js";

export const SQ3R_ADAPT = [
  rule({ horizon: ["soon"] },
    "With 2 days or less, there is no time for the whole chapter, so you read the sections most likely to be tested and revisit misses tonight and tomorrow.",
    "Only likely sections; misses revisited tonight and tomorrow.",
    append("choose", "With so little time, read only the sections most likely to be tested, and leave the rest."),
    set("review", {
      instruction: "Cover your answers and look only at your questions. Answer all of them again from memory. Mark any you missed and revisit those tonight, and again tomorrow before your deadline. Done when you can answer every question without the text.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so no timer is longer than 6 minutes and you take only 2 or 3 pages.",
    "Timers cut to 6 minutes, with only 2 or 3 pages.",
    capTimers(6),
    append("choose", "Take only 2 or 3 pages today, so the shorter timers are enough.")),
  rule({ struggle: ["forget"] },
    "You said it slips away, so the same questions are answered again from memory tomorrow and a week later.",
    "The same questions are asked again tomorrow and in a week.",
    append("review", "Put a reminder in your calendar to answer the same questions again from memory tomorrow, and once more about a week later, before you reread anything.")),
  rule({ task: ["apply"] },
    "You’ll have to solve new problems, so worked examples become questions and you recite by solving a similar one.",
    "Worked examples become questions you answer by solving.",
    append("question", "Because you will have to solve new problems, also turn each worked example into a question, such as “how would I solve one like this?”."),
    append("recite", "For a worked example, close the book and solve a similar one instead of reciting.")),
  rule({ task: ["recall"] },
    "You’ll have to remember it exactly, so definitions, formulas and lists are recited in the book’s own words.",
    "Definitions and formulas are recited word for word.",
    append("recite", "Because you will have to remember this exactly, where the exact words matter, such as a definition, a formula or a list, say it in the book’s words, not your own.")),
];
