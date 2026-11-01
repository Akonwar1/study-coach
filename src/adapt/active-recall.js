// How Active Recall's guided session changes with the student's answers. The step ids are those in src/methods.js.
import { append, byDeadline, capTimers, insertAfter, insertAtStart, rule } from "../adapt-kit.js";

export const ACTIVE_RECALL_ADAPT = [
  ...byDeadline("schedule", {
    soon: {
      because: "With 2 days or less, a review a long way out would come after your deadline, so the re-tests move to tonight and tomorrow.",
      summary: "Re-tests move to tonight and tomorrow.",
      fields: {
        title: "Plan tonight’s and tomorrow’s re-tests",
        instruction: "Skip the long-gap reminders, because your deadline comes first. Set two reminders: one for tonight, a few hours from now or just before bed, and one for tomorrow before your deadline. Each time, close your notes and start with the gaps from today, written or said from memory, then check them against the source. Spend any time left on the next chunk.",
        mindset: "Short gaps still help. Coming back after a few hours or a night means the material has faded a little and you have to dig it up again, which is the useful part. Don’t swap the re-tests for rereading the night before: it feels easier because it lets you off the digging. Write two or three questions about this chunk now, so tonight’s re-test can start with questions and not with your notes.",
      },
    },
    week: {
      because: "With 3 days to 2 weeks left, a review a week from now could land after your deadline, so the last review is set before it.",
      summary: "The last review is set before your deadline.",
      fields: {
        instruction: "Put a reminder in your calendar to redo steps 3–5 for this chunk tomorrow, using only the gaps from today. Add a second reminder two or three days after that, but no later than the day before your deadline. Without these, most of what you just learned will fade.",
      },
    },
    long: {
      because: "With more than 2 weeks left, there is room to keep widening the gaps between reviews.",
      summary: "The gaps between reviews keep widening.",
      fields: {
        instruction: "Put a reminder in your calendar to redo steps 3–5 for this chunk tomorrow, using only the gaps from today. Add a second reminder for about a week later and a third about two weeks after that, then keep widening the gaps until your deadline. Without these, most of what you just learned will fade.",
      },
    },
    none: {
      because: "With no deadline, you can keep widening the gaps for as long as you want to remember the material.",
      summary: "The gaps between reviews keep widening.",
      fields: {
        instruction: "Put a reminder in your calendar to redo steps 3–5 for this chunk tomorrow, using only the gaps from today. Add a second reminder for about a week later and a third about a month after that, then keep widening the gaps for as long as you want to remember it. Without these, most of what you just learned will fade.",
      },
    },
  }),
  rule({ struggle: ["focus"] },
    "You said you drift off, so every timer is cut to 3 minutes: a short block with a clear end is easier to stay in.",
    "Every timer is cut to 3 minutes.",
    capTimers(3),
    append("choose", "Make the chunk smaller than usual so it fits the shorter timers: about half a page, or two or three key ideas."),
    append("close", "Put your phone in another room or out of reach, not just face down.")),
  rule({ struggle: ["start"] },
    "You said you can’t get started, so the session opens with a 2-minute step that asks almost nothing, and the chunk is smaller.",
    "Opens with a 2-minute first step and a smaller chunk.",
    insertAtStart({
      id: "just-open",
      title: "Open it and write one line",
      visual: { name: "recall-choose" },
      instruction: "Set the 2-minute timer. All you have to do is open the material and write its title, and one thing you already know about it, at the top of the blank page. When the timer ends you may stop. If you want to keep going, the next step is ready.",
      mindset: "The only aim here is to begin. Don’t judge what you write. Starting is the hard part, and a tiny first step takes away the decision of whether to do the whole session.",
      minutes: 2,
    }),
    append("choose", "Make the chunk smaller than you think you need: half a page, or three ideas, is enough to start.")),
  rule({ struggle: ["unsure"] },
    "You said everything looks familiar, so a prediction step comes before you recall, to show how much you actually know.",
    "A prediction step shows how much you really know.",
    insertAfter("close", {
      id: "predict",
      title: "Predict your score",
      visual: { name: "recall-close" },
      instruction: "Before you write anything, put a number on it: how many of the key items in this chunk do you expect to get right? Write that number at the top of the blank page. You will compare it with your real count in the check step.",
      mindset: "Feeling ready and being able to do it are different things, and a number written down in advance makes the difference visible. If the real count comes in lower, that is not a failure; it is the information this session is for.",
      minutes: 0,
    }),
    append("check", "Compare your count with the prediction you wrote down. A big gap means the material felt more familiar than it was.")),
  rule({ task: ["explain"] },
    "You’ll have to explain it in your own words, so recall means saying it as an explanation, not reciting it.",
    "Recall becomes an explanation, not a recital.",
    append("recall", "Because you will have to explain this, say or write it as if you were teaching a friend, in your own words, including why each part is true. A list of terms is not enough."),
    append("check", "As you check, mark the places where you had the words but not the reason.")),
  rule({ task: ["apply"] },
    "You’ll have to solve new problems, so recall includes using the material, not only remembering it.",
    "Recall includes solving a problem you haven’t seen.",
    append("recall", "Because you will have to use this on new problems, don’t stop at writing it down: make up or find one problem you haven’t seen and solve it from memory."),
    append("check", "Check your solution as well as your notes: a right fact used the wrong way is a gap too.")),
];
