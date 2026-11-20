// How the Pomodoro Technique's guided session changes with the student's answers. The step ids are those in src/methods.js.
// Only the two problems this method is recommended for get a rule. It manages attention, so the deadline and what you will do with the
// material would change nothing real. Each rule rewrites the lines that name the block length, so no text still says 25 minutes.
import { append, rule, set } from "../adapt-kit.js";

export const POMODORO_ADAPT = [
  rule({ struggle: ["focus"] },
    "You said you drift off, so each work block is 15 minutes with a 3-minute break: a shorter stretch is easier to stay in.",
    "Work blocks of 15 minutes, with 3-minute breaks.",
    set("set-up", {
      instruction: "Choose the single thing you’ll work on for 15 minutes. Make it specific and finishable in one round, such as “do problems 1–5” rather than “study”. If the task is big, write the first small piece. Then clear the area: phone in another room or silent and face down, close extra tabs, and fill your water.",
      mindset: "A task you can start without thinking is worth more than an ambitious one. The goal is for the timer to start with no further decisions. If you are dreading it, shrink it until the dread goes: “open the file and write the first line” is a fair task. Setting up the room now means you don’t have to rely on willpower during the 15 minutes.",
    }),
    set("focus", {
      minutes: 15,
      mindset: "Treat the 15 minutes as a promise to one task. The urge to check something is normal and passes. Writing the thought on a scrap of paper lets your mind drop it, because it is recorded and can wait. A block this short is easier to stay in than an open evening, because you can see the end from the start.",
      tip: "Want to quit at minute 7? That’s normal. Stay until the timer ends.",
    }),
    set("break", { minutes: 3 })),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so the block is only 10 minutes, and you are told you may stop when it ends.",
    "The block is 10 minutes, and you may stop after.",
    set("set-up", {
      instruction: "Choose the single thing you’ll work on for 10 minutes, and make it small enough that you could begin it in under a minute, such as “open the file and write the first line”. Then clear the area: phone in another room or silent and face down, close extra tabs, and fill your water.",
      mindset: "A task you can start without thinking is worth more than an ambitious one. The goal is for the timer to start with no further decisions. If you are dreading it, shrink it until the dread goes: “open the file and write the first line” is a fair task. Setting up the room now means you don’t have to rely on willpower during the 10 minutes.",
    }),
    set("focus", {
      minutes: 10,
      mindset: "Treat the 10 minutes as a promise small enough to keep. The urge to check something is normal and passes; write the thought on a scrap of paper and go back to the task. Beginning is the hard part, and once the timer is running you may find you want to keep going.",
      tip: "Want to quit at minute 5? That’s normal. Stay until the timer ends, then decide.",
    }),
    append("focus", "When the timer ends you are allowed to stop. If you want to keep going, start another round.")),
];
