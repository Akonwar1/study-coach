// How Spaced Repetition's guided session changes with the student's answers. The step ids are those in src/methods.js.
// No rule for more than 2 weeks or no deadline (the boxes are built for open time), for "it slips away" or "remember it exactly" (the
// method already does that), or for "can't tell what I know" (every pass already has you answer before you flip).
import { append, capTimers, insertAtStart, rule, set } from "../adapt-kit.js";

export const SPACED_REPETITION_ADAPT = [
  rule({ horizon: ["soon"] },
    "With 2 days or less, a box reviewed every 3 days or weekly would come after your deadline, so cards are reviewed tonight and tomorrow.",
    "Cards are reviewed tonight and tomorrow, not in boxes.",
    set("dates", {
      title: "Set tonight’s and tomorrow’s reviews",
      instruction: "Skip the three boxes: a review spaced out by days would come after your deadline. Keep two piles, cards you got right and cards you missed. Review the missed pile again tonight, a few hours from now or just before bed, and the whole pile tomorrow before your deadline. Write both times on the piles.",
      mindset: "With so little time, the aim is two comebacks after some forgetting, not a long schedule. The cards you miss tonight are the ones most worth seeing again tomorrow.",
      tip: "Done when both review times are written on the piles.",
    }),
    set("calendar", {
      instruction: "Add two reminders labelled “review cards”: one for tonight and one for tomorrow, early enough to leave room before your deadline. Don’t add new cards after today; use the time to go back over the ones you have.",
      mindset: "Two reminders set now are two reviews you will not have to remember to plan. Put tonight’s at a time you will really be awake.",
    })),
  rule({ horizon: ["week"] },
    "With 3 days to 2 weeks left, a weekly box could land after your deadline, so the boxes are fitted to end the day before it.",
    "The boxes end with a review the day before.",
    set("dates", {
      instruction: "Use three boxes, or the scheduling in your app, fitted to your deadline. Box 1 is reviewed daily and Box 2 every 2 days. Box 3 is one last review on the day before your deadline, not a weekly one that could land after it. Every new card starts in Box 1: cards you missed today stay there and come back tomorrow, and cards you got right move up to Box 2. From then on, a right answer moves a card up one box and a miss drops it back to Box 1. Write the next review date on each pile.",
    })),
  rule({ struggle: ["focus"] },
    "You said you drift off, so the pile is five cards at a time and every timer is cut to 3 minutes.",
    "Five cards at a time, with timers cut to 3 minutes.",
    capTimers(3),
    append("gather", "Pick five items, not 10–15, so the shorter timers are enough."),
    append("first-pass", "Go through the pile five cards at a time, and stop when the timer ends.")),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so the session opens with making a single card, and you begin with only five items.",
    "Opens with one card, and you start with five items.",
    insertAtStart({
      id: "first-card",
      title: "Make just one card",
      visual: { name: "sr-card" },
      instruction: "Set the 2-minute timer. Pick one thing from your notes that you would be annoyed to forget, and write it as a card: a question on the front, the answer on the back. When the timer ends you may stop. If you want to keep going, the next step is ready.",
      mindset: "The only aim here is to have one card in your hand. A single card is not a deck to build, so there is nothing to put off, and the next one is easier to write once the first exists.",
      minutes: 2,
    }),
    append("gather", "Begin with five items, and add more once you have gone through the first pile.")),
  rule({ task: ["explain"] },
    "You’ll have to explain it in your own words, so each card asks why or how, not just what.",
    "Cards ask why or how, not just what.",
    append("cards", "Because you will have to explain this, make most fronts a “why” or “how” question, such as “Why does this step come before that one?”, and keep the back to a one-line reason.")),
  rule({ task: ["apply"] },
    "You’ll have to solve new problems, so each card sets a small problem and its back gives the first move.",
    "Cards set a small problem; the back gives the first move.",
    append("cards", "Because you will have to use this on new problems, make some fronts a small problem, and write the first move on the back, not only the final answer.")),
];
