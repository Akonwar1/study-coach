// How Problem First's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for "doesn't make sense" or solving new problems (the method is built for both), for "can't tell what I know", or for
// more than 2 weeks (the method is built for open time). A rule that appends to a step comes after any rule that sets it.
import { append, capTimers, rule, set } from "../adapt-kit.js";

export const PROBLEM_FIRST_ADAPT = [
  rule({ horizon: ["soon", "week"] },
    "With a deadline within 2 weeks, the method’s weak spot, running the procedure, gets longer practice: four more problems, not two.",
    "Practice grows to four more problems before the deadline.",
    set("practise", {
      minutes: 10,
      instruction: "Use the proper method to redo the original problem, then solve four more like it. Trying first did not improve procedural skill in the research, and your deadline is close, so this practice has to be on purpose. Done when you can say what the method is for, not only how to run it.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so no timer is longer than 6 minutes and you pick a small problem.",
    "Timers cut to 6 minutes, with a small problem.",
    capTimers(6),
    append("pick", "Pick a small problem, one you could attempt in about six minutes.")),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so you pick the shortest problem and begin with one line: the first thing you would try.",
    "Begin with one line: the first thing you would try.",
    append("pick", "Choose the shortest problem on the page."),
    append("attempt", "To begin, write down the first thing you would try, even in a single line; the rest follows from it.")),
  rule({ struggle: ["forget"] },
    "You said it slips away, so tomorrow you solve the original problem again before opening your notes.",
    "Tomorrow you re-solve the original problem from memory.",
    append("practise", "Tomorrow, solve the original problem again before you look at your notes.")),
];
