// How Self-Explanation's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for "doesn't make sense" or "can't tell what I know" (the method is built for both), for explaining it (that is the method),
// or for "it slips away" (Feynman and Elaborative Interrogation cover it). A rule that appends to a step comes after one that sets it.
import { append, capTimers, rule, set } from "../adapt-kit.js";

const FEWER_CHUNKS_TIP = "If the material is a single long block, split it wherever the topic changes. Whatever is left over can wait for another session.";

export const SELF_EXPLANATION_ADAPT = [
  rule({ horizon: ["soon"] },
    "With 2 days or less, a new problem comes tonight and the starred chunks are redone tomorrow, before your deadline.",
    "A new problem tonight, a starred-chunk redo tomorrow.",
    set("twin", {
      instruction: "Find one new problem or passage like the first, with different numbers, details, or topic, and explain it the same way tonight. Tomorrow, before your deadline, redo the starred chunks without the source. If you can explain every chunk, you’ve got it. If not, note which kind of chunk tripped you and start there.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so no timer is longer than 5 minutes, and you do only the first 4 chunks.",
    "Timers cut to 5 minutes, and only the first 4 chunks.",
    capTimers(5),
    append("chunks", "Do only the first 4 chunks today, so each one gets a short, full-attention block."),
    set("chunks", { tip: FEWER_CHUNKS_TIP })),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so you begin with the shortest material and only the first 3 chunks.",
    "The shortest material and only the first 3 chunks.",
    append("gather", "Start with the shortest page or problem you have, so the first session is small."),
    append("chunks", "Do only the first 3 chunks today; that is enough for a first session."),
    set("chunks", { tip: FEWER_CHUNKS_TIP })),
  rule({ task: ["apply"] },
    "You’ll have to solve new problems, so the similar problem becomes the main test instead of an extra.",
    "The similar problem becomes the main test.",
    append("twin", "Because you will have to solve new problems, treat this as the main test: solve the new problem without the source, narrating each move and why, and do not stop until you can.")),
];
