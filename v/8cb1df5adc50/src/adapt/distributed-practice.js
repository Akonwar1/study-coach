// How Distributed Practice's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for more than 2 weeks (the standard plan is built for it), for "it slips away" (the method is built for it) or for what you
// will do with the material (the plan only schedules, so the task answer would change nothing real).
// Rule order matters where two rules change one step: a rule that appends must come after a rule that sets the same step.
import { append, rule, set } from "../adapt-kit.js";

export const DISTRIBUTED_PRACTICE_ADAPT = [
  rule({ horizon: ["soon"] },
    "With 2 days or less there is no room to spread sessions over weeks, so they go across the evenings you have left, with gaps of hours.",
    "Sessions go across the evenings you have left.",
    append("deadline", "With this little time, count evenings and hours, not weeks: how many separate sittings can you fit before the deadline, and when?"),
    set("assign", {
      title: "Assign topics to sittings",
      instruction: "Spread the topics across the sittings you have, not into one long one. Put the hardest topics in the first sitting, so you have time to meet them again. If you can, leave a gap of several hours, or a night, between sittings. Write the topic next to each time.",
    }),
    set("reviews", {
      instruction: "At the start of each sitting, spend the first few minutes on the topics from the sitting before, then move on. Keep the last sitting for a quick pass over the hardest topics, and a practice test if there is time.",
    })),
  rule({ horizon: ["week"] },
    "With 3 days to 2 weeks left, a session every day or two fits, and the last revisit lands the day before your deadline.",
    "Sessions every day or two, ending the day before.",
    set("assign", {
      instruction: "Plan a session every day or two across the days you have, instead of one long one. Put the hardest topics earliest, so you have time to revisit them. Write the topic next to each date.",
    }),
    set("reviews", {
      instruction: "Each time you finish a topic, schedule a short revisit a day or two later. Mix older topics into later sessions instead of leaving them behind. Make your last revisit the day before the deadline, and add a practice test a few days before it, if possible.",
    })),
  rule({ horizon: ["none"] },
    "You have no deadline, and the plan works backwards from a date, so you choose your own date to be ready by.",
    "You choose your own date to work back from.",
    set("deadline", {
      title: "Choose your own date",
      instruction: "You have no deadline, so choose a date to be ready by, such as a day you will quiz yourself on all of it. Write it down and count the days or weeks between now and then. Also note how many study sessions you realistically have per week, and on which days.",
      mindset: "Without a date, nothing makes you come back, so the plan needs one. A date you choose gives the sessions a start and an end. Make it close enough to feel real and far enough to space things out. Be honest about the sessions you will really keep: a smaller plan that you follow is better than a large one you drop.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so each session is 20 minutes or less, not the usual 30–45.",
    "Every session is 20 minutes or less.",
    set("calendar", {
      instruction: "Enter each session as an event with its topic and length. Keep sessions to 20 minutes or less, and shorter as the date nears; don’t compress by merging sessions. Done when every session is in your calendar. Then pick a method from this app for the first one.",
    })),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so the first session is only 10 minutes and is booked within the next 24 hours.",
    "The first session is 10 minutes, within a day.",
    append("calendar", "Make the first session only 10 minutes, and put it in the next 24 hours.")),
  rule({ struggle: ["unsure"] },
    "You said everything looks familiar, so a practice test comes early, to show what you can’t yet do with your notes closed.",
    "A practice test comes early to show real gaps.",
    append("reviews", "Take a practice test early, in your first session or two and not only at the end, to find out what you can’t yet do with your notes closed.")),
];
