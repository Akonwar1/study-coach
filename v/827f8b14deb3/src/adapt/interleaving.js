// How Interleaving's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for "can't tell what I know" or solving new problems (the method is built for both), for forgetting, or for deadlines (the
// session already ends with a list for tomorrow's warm-up, and the method is not recommended for 2 days or less).
import { append, capTimers, rule } from "../adapt-kit.js";

export const INTERLEAVING_ADAPT = [
  rule({ struggle: ["focus"] },
    "You said you drift off, so the main block is cut to 8 minutes, with two topics and 3 items for each.",
    "The work block is cut to 8 minutes, with fewer items.",
    capTimers(8),
    append("choose", "Take two topics and 3 items for each, so the shorter block is enough.")),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so you begin with two topics and two items each from work you already have.",
    "Two topics, two items each, from work you already have.",
    append("choose", "Start with only two topics and two items for each, taken from work you already have, so there is nothing new to find."),
    append("work", "You may stop after the first four items.")),
  rule({ task: ["explain"] },
    "You’ll have to explain it in your own words, so each clue is written as a sentence that says why.",
    "Each clue is a sentence you could say aloud.",
    append("review", "Because you will have to explain this, write each clue as a sentence you could say aloud, including why it tells the two topics apart.")),
];
