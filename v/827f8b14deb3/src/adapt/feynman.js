// How the Feynman Technique's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for "doesn't make sense" or "can't tell what I know" (the method is built for both), for explaining it (that is the method),
// or for the deadline (it is done in one sitting, so a deadline changes nothing real).
import { append, capTimers, insertAfter, rule, set } from "../adapt-kit.js";

export const FEYNMAN_ADAPT = [
  rule({ struggle: ["focus"] },
    "You said you drift off, so every timer is cut to 4 minutes and the concept is smaller, to fit.",
    "Timers are cut to 4 minutes, with a smaller concept.",
    capTimers(4),
    append("name", "Pick an even smaller concept than usual, one you could explain in about four minutes.")),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so you begin with the concept you know best, and the first version can be rough.",
    "Start with what you know best; a rough first version is fine.",
    set("name", { tip: "Can’t choose? Take the concept you know best from this topic. You can do the harder ones next time." }),
    append("explain", "Your first version is allowed to be rough. Write three sentences to begin; when you have, you may stop, and if you want to keep going the next step is ready.")),
  rule({ struggle: ["forget"] },
    "You said it slips away, so a re-explanation from a blank page is added for tomorrow.",
    "A blank-page re-explanation is added for tomorrow.",
    insertAfter("simplify", {
      id: "tomorrow",
      title: "Explain it again tomorrow",
      visual: { name: "fy-explain" },
      instruction: "Put a reminder in your calendar for tomorrow: “explain this concept from a blank page”. When it goes off, don’t open anything first. Write or say the explanation from memory, then check only the places where you stalled.",
      mindset: "An explanation that comes easily today may not come tomorrow, and the difference is what you are working on. Coming back after a night means you have to rebuild the idea, not just read it back, and the places you stall are the ones that slipped.",
      minutes: 0,
    })),
  rule({ task: ["apply"] },
    "You’ll have to solve new problems, so the explanation ends by being used on one you haven’t seen.",
    "The explanation ends by solving a new problem.",
    append("simplify", "Because you will have to use this on new problems, finish by using your explanation on one problem you haven’t seen: say which part of the explanation you used and why.")),
];
