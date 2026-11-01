// The questions the coach asks. Option ids match the `fit` values in methods.js.
// A `neutral` option means "none of the above": it matches no method's fit, so it adds no bonus to any method,
// and the library leaves it out of its filters.

export const QUESTIONS = [
  {
    id: "material",
    prompt: "What are you studying?",
    options: [
      { id: "facts", label: "Facts and terms", hint: "Things to memorise: vocabulary, definitions, dates, names or formulas" },
      { id: "concepts", label: "Ideas and concepts", hint: "Understanding how or why something works, like a theory, a cause or an argument" },
      { id: "problems", label: "Problems to solve", hint: "Math, physics, chemistry or coding exercises where you work toward an answer" },
      { id: "reading", label: "Dense reading", hint: "Textbook chapters, articles or papers you have to get through and take in" },
      { id: "diagrams", label: "Processes and diagrams", hint: "Systems, cycles, anatomy or anything you need to picture to follow" },
      { id: "mixed", label: "A mix, or something else", hint: "Several kinds of material at once, or none of these quite fits", neutral: true },
    ],
  },
  {
    id: "horizon",
    prompt: "How long until the exam or deadline?",
    options: [
      { id: "soon", label: "Today to 2 days", hint: "Crunch time: an exam, quiz or deadline is right around the corner" },
      { id: "week", label: "3 days to 2 weeks", hint: "It’s coming up, but you have a few days to spread your studying over" },
      { id: "long", label: "More than 2 weeks", hint: "Plenty of runway, enough to space your studying out over weeks" },
      { id: "none", label: "No deadline", hint: "No test or due date: you’re learning it for its own sake, or for later" },
    ],
  },
  {
    id: "struggle",
    prompt: "What’s getting in your way?",
    options: [
      { id: "forget", label: "I learn it, then it slips away", hint: "It makes sense while I study it, but a day or a week later most of it is gone" },
      { id: "confused", label: "It doesn’t make sense to me", hint: "I can read it and follow along, but I can’t explain why it works or how the pieces connect" },
      { id: "unsure", label: "I can’t tell what I actually know", hint: "It all looks familiar when I read it, so I feel ready, but I’m not sure I could do it with my notes closed" },
      { id: "focus", label: "I can’t stay focused", hint: "I sit down to study and drift to my phone, other tabs or daydreaming" },
      { id: "start", label: "I can’t get started", hint: "The pile feels too big or too dull, so I keep putting it off" },
      { id: "none", label: "Nothing in particular", hint: "Nothing is going wrong, I just want to study well and get the most out of my time", neutral: true },
    ],
  },
  {
    id: "task",
    prompt: "What will you have to do with it?",
    optional: true, // "Not sure" and a skipped answer both leave the recommendation unchanged
    options: [
      { id: "recall", label: "Remember it exactly", hint: "Define terms, fill in blanks, recite steps" },
      { id: "explain", label: "Explain it in my own words", hint: "Short answers, essays, teaching it to someone" },
      { id: "apply", label: "Solve new problems with it", hint: "Questions I haven’t seen before, so I have to work out the answer" },
      { id: "mixed", label: "Not sure, or a bit of everything", hint: "A mix of these, or I don’t know yet how I’ll be tested" },
    ],
  },
];

// Asked after the questions above. It tailors the wording and examples inside a guided session (see tailor.js).
// It only changes which method is recommended for a method that lists `fit.subject` in methods.js.
export const SUBJECT_QUESTION = {
  id: "subject",
  prompt: "What kind of subject is it?",
  options: [
    { id: "quantitative", label: "Math, physics or engineering", hint: "Equations, derivations and problem sets where you show your work" },
    { id: "science", label: "Biology, chemistry or medicine", hint: "Processes, mechanisms and a lot of terms to keep straight" },
    { id: "humanities", label: "History, literature or social science", hint: "Arguments, events, sources and essays you have to write" },
    { id: "language", label: "A foreign language", hint: "Vocabulary, grammar and phrases you need to use, not just recognise" },
    { id: "programming", label: "Programming or computer science", hint: "Code, algorithms and how systems fit together" },
    { id: "other", label: "Something else", hint: "Anything else, and the examples will stay general" },
  ],
};

/** Every question the app asks, in order. */
export const ALL_QUESTIONS = [...QUESTIONS, SUBJECT_QUESTION];
