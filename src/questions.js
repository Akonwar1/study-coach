// The questions the coach asks. Option ids match the `fit` values in methods.js.

export const QUESTIONS = [
  {
    id: "material",
    prompt: "What are you studying?",
    options: [
      { id: "facts", label: "Facts and terms", hint: "Vocabulary, definitions, dates, formulas" },
      { id: "concepts", label: "Ideas and concepts", hint: "How and why things work" },
      { id: "problems", label: "Problems to solve", hint: "Math, physics, coding exercises" },
      { id: "reading", label: "Dense reading", hint: "Textbook chapters, papers" },
      { id: "diagrams", label: "Processes and diagrams", hint: "Systems, cycles, anything visual" },
    ],
  },
  {
    id: "horizon",
    prompt: "How long until the exam or deadline?",
    options: [
      { id: "soon", label: "Today to 2 days" },
      { id: "week", label: "3 days to 2 weeks" },
      { id: "long", label: "More than 2 weeks" },
      { id: "none", label: "No deadline", hint: "I’m just learning it" },
    ],
  },
  {
    id: "struggle",
    prompt: "What’s getting in your way?",
    options: [
      { id: "forget", label: "I forget it", hint: "I study it, then it’s gone" },
      { id: "confused", label: "I don’t understand it", hint: "It doesn’t click" },
      { id: "unsure", label: "I can’t tell what I know", hint: "Everything feels familiar" },
      { id: "focus", label: "I can’t focus", hint: "Phone, distractions, drifting" },
      { id: "start", label: "I can’t get started", hint: "Procrastinating or overwhelmed" },
    ],
  },
];
