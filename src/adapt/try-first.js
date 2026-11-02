// How Try First's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for "can't tell what I know" or remembering it exactly (the method is built for both), for explaining it or solving
// problems (it is for facts and reading), or for the longer deadlines. A rule that appends to a step comes after one that sets it.
import { append, capTimers, rule, set } from "../adapt-kit.js";

export const TRY_FIRST_ADAPT = [
  rule({ horizon: ["soon"] },
    "With 2 days or less, you choose the section most likely to be tested and test yourself on it tonight and tomorrow.",
    "The likeliest section, tested tonight and tomorrow.",
    append("skim", "With so little time, choose the section most likely to be tested."),
    set("gaps", {
      instruction: "Your questions only boost what they ask about. Skim the section for important ideas you wrote no question for, and add questions for them. Then test yourself on the whole section tonight without your notes, and again tomorrow before your deadline (that’s Active Recall, which beat testing before studying in one experiment). Done when every important idea has a question.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so no timer is longer than 5 minutes, and you take about 2 pages with 4 questions.",
    "Timers cut to 5 minutes, with 2 pages and 4 questions.",
    capTimers(5),
    append("skim", "Take about 2 pages, not 5–10, so the shorter timers are enough."),
    append("questions", "Write 4 questions today, not 6–10.")),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so you begin with a page or two and only 3 questions.",
    "A page or two, and only 3 questions to begin.",
    append("skim", "Choose a section of only a page or two, so beginning feels small."),
    append("questions", "Start with just 3 questions; you can add more once you have guessed them.")),
  rule({ struggle: ["confused"] },
    "You said it doesn’t make sense, so some of your questions ask why, and your guesses show where the sense is missing.",
    "Some questions ask why, to show where sense is missing.",
    append("questions", "Include some “why” questions, not only what and which: a guess at a why shows where it doesn’t make sense yet.")),
  rule({ struggle: ["forget"] },
    "You said it slips away, so a second test about a week later is added to tomorrow’s.",
    "A second test about a week later joins tomorrow’s.",
    append("gaps", "Put a reminder in your calendar to test yourself again about a week later, without notes, if your deadline is further off than that.")),
];
