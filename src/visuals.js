// Diagrams shown inside guided-session steps, and the step progress strip.
//
// A step asks for a diagram with `visual: { name, ...options }` in methods.js. renderVisual returns
// { node, update? } or null for an unknown name. If `update(fraction)` exists, the session screen calls
// it as the step's timer runs (fraction goes from 0 to 1) so the diagram fills like a progress bar.
// Everything is built from DOM nodes, never parsed from strings, and coloured by CSS variables so it
// follows the light and dark themes.

const SVG_NS = "http://www.w3.org/2000/svg";

function html(tag, className, children = [], attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  for (const child of children) node.append(typeof child === "string" ? document.createTextNode(child) : child);
  return node;
}

function svg(tag, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value));
  for (const child of children) node.append(child);
  return node;
}

function svgText(text, attrs) {
  const node = svg("text", attrs);
  node.textContent = text;
  return node;
}

const percent = (fraction) => `${Math.round(Math.min(1, Math.max(0, fraction)) * 100)}%`;

// ---------- step progress strip ----------

const MIN_SEGMENT_WEIGHT = 2; // untimed steps still get a visible slice

/**
 * One slice per step, sized by its minutes. Finished steps are full and the current one fills as its timer runs.
 * Untimed steps are shown full once you reach them.
 */
export function renderStepStrip(steps, currentIndex) {
  let currentFill = null;
  const slices = steps.map((step, index) => {
    const fill = html("span", "strip-fill");
    fill.style.width = index < currentIndex || (index === currentIndex && step.minutes === 0) ? "100%" : "0%";
    if (index === currentIndex) currentFill = fill;
    const slice = html("span", `strip-seg${index === currentIndex ? " current" : ""}`, [fill]);
    slice.style.flexGrow = String(Math.max(step.minutes, MIN_SEGMENT_WEIGHT));
    return slice;
  });
  const node = html("div", "step-strip", slices, { role: "img", "aria-label": `Step ${currentIndex + 1} of ${steps.length}` });
  return { node, update: (fraction) => { currentFill.style.width = percent(fraction); } };
}

// ---------- Pomodoro cycle ----------

// One Pomodoro round is 25 minutes of focus and 5 of rest; after four, a long break.
const CYCLE = [
  { kind: "focus", minutes: 25 },
  { kind: "break", minutes: 5 },
  { kind: "focus", minutes: 25 },
  { kind: "break", minutes: 5 },
  { kind: "focus", minutes: 25 },
  { kind: "break", minutes: 5 },
  { kind: "focus", minutes: 25 },
  { kind: "longbreak", minutes: 15 },
];
const LEGEND = [
  { kind: "focus", text: "Focus: 25 min" },
  { kind: "break", text: "Short break: 5 min" },
  { kind: "longbreak", text: "Long break: 15–30 min" },
];
const CYCLE_WIDTH = 300;
const SEGMENT_GAP = 3;
const BAR_TOP = 4;
const BAR_HEIGHT = 44;
const MINUTES_IN_CYCLE = CYCLE.reduce((sum, part) => sum + part.minutes, 0);

/** The four-round cycle as a timeline. The first block of the highlighted kind is "you are here" and fills with the timer. */
function pomodoroCycle({ highlight }) {
  const usable = CYCLE_WIDTH - SEGMENT_GAP * (CYCLE.length - 1);
  const currentIndex = highlight ? CYCLE.findIndex((part) => part.kind === highlight) : -1;
  let currentFill = null;
  let currentWidth = 0;
  let x = 0;

  const segments = CYCLE.map(({ kind, minutes }, index) => {
    const width = (minutes / MINUTES_IN_CYCLE) * usable;
    const isCurrent = index === currentIndex;
    const dimmed = highlight && !isCurrent ? " dimmed" : "";
    const parts = [svg("rect", { class: "track", x, y: BAR_TOP, width, height: BAR_HEIGHT, rx: 4 })];
    if (isCurrent) {
      currentFill = svg("rect", { class: "fill", x, y: BAR_TOP, width: 0, height: BAR_HEIGHT, rx: 4 });
      currentWidth = width;
      parts.push(currentFill);
    }
    if (kind !== "break") {
      parts.push(svgText(String(minutes), { x: x + width / 2, y: BAR_TOP + BAR_HEIGHT / 2 + 5, class: "seg-text" }));
    }
    x += width + SEGMENT_GAP;
    return svg("g", { class: `seg ${kind}${dimmed}${isCurrent ? " current" : ""}` }, parts);
  });

  const bar = svg("svg", { viewBox: `0 0 ${CYCLE_WIDTH} ${BAR_HEIGHT + 2 * BAR_TOP}`, class: "visual-bar", "aria-hidden": "true" }, segments);
  const legend = html("ul", "visual-legend", LEGEND.map(({ kind, text }) =>
    html("li", `legend-item ${kind}${highlight && highlight !== kind ? " dimmed" : ""}`, [html("span", "swatch"), text]),
  ));
  const node = html("figure", "visual", [bar, legend], {
    role: "img",
    "aria-label": "Pomodoro cycle: four rounds of 25 minutes of focus, each followed by a 5 minute break, then a long break of 15 to 30 minutes after the fourth round.",
  });
  return { node, update: currentFill && ((fraction) => currentFill.setAttribute("width", String(currentWidth * Math.min(1, Math.max(0, fraction))))) };
}

// ---------- flow: a row of stages with the current one highlighted ----------

/** `labels`: stage names; `highlight`: index of the current stage; `loop`: optional text for "repeat" note. */
function flow({ labels, highlight, loop }) {
  const items = labels.map((text, index) => {
    const state = index < highlight ? " done" : index === highlight ? " current" : "";
    return html("li", `flow-step${state}`, [text], index === highlight ? { "aria-current": "step" } : {});
  });
  const children = [html("ol", "flow", items)];
  if (loop) children.push(html("p", "flow-loop", [`↺ ${loop}`]));
  return { node: html("figure", "visual", children) };
}

// ---------- flashcard (Spaced Repetition) ----------

const FLASHCARDS = {
  default: ["What caused X?", "One short line answering it."],
  quantitative: ["Derivative of sin x?", "cos x"],
  science: ["What does ATP synthase do?", "Makes ATP using the proton gradient."],
  humanities: ["What did the Treaty of Versailles require of Germany?", "Reparations, lost land, and military limits."],
  language: ["the library", "la biblioteca"],
  programming: ["Time complexity of binary search?", "O(log n)"],
};

function flashcard(_options, { subject }) {
  const [front, back] = FLASHCARDS[subject] ?? FLASHCARDS.default;
  const side = (name, text) => html("div", "flashcard", [html("span", "flashcard-side", [name]), html("p", "flashcard-text", [text])]);
  return { node: html("figure", "visual flashcards", [side("Front", front), side("Back", back)]) };
}

// ---------- Leitner boxes (Spaced Repetition) ----------

function leitner() {
  const boxes = [{ name: "Box 1", every: "every day" }, { name: "Box 2", every: "every 3 days" }, { name: "Box 3", every: "every week" }];
  const boxWidth = 84;
  const gap = 24;
  const parts = [
    svg("defs", {}, [svg("marker", { id: "leitner-arrow", viewBox: "0 0 8 8", refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: "auto" }, [
      svg("path", { d: "M0 0 L8 4 L0 8 z", class: "arrow-head" }),
    ])]),
  ];
  boxes.forEach(({ name, every }, index) => {
    const x = index * (boxWidth + gap);
    parts.push(svg("rect", { class: "box", x, y: 14, width: boxWidth, height: 58, rx: 6 }));
    parts.push(svgText(name, { x: x + boxWidth / 2, y: 38, class: "box-title" }));
    parts.push(svgText(every, { x: x + boxWidth / 2, y: 58, class: "box-note" }));
    if (index < boxes.length - 1) {
      parts.push(svg("line", { class: "arrow", x1: x + boxWidth + 3, y1: 43, x2: x + boxWidth + gap - 3, y2: 43, "marker-end": "url(#leitner-arrow)" }));
    }
  });
  const lastCenter = 2 * (boxWidth + gap) + boxWidth / 2;
  parts.push(svg("path", { class: "arrow miss", d: `M${lastCenter} 74 C${lastCenter} 108 ${boxWidth / 2} 108 ${boxWidth / 2} 76`, "marker-end": "url(#leitner-arrow)" }));
  const diagram = svg("svg", { viewBox: "0 0 300 112", class: "visual-bar", "aria-hidden": "true" }, parts);
  const notes = html("ul", "visual-legend stacked", [
    html("li", "", ["Got it right: the card moves one box to the right, so you see it less often."]),
    html("li", "", ["Missed it: the card goes back to Box 1, the curved arrow."]),
  ]);
  return { node: html("figure", "visual", [diagram, notes], {
    role: "img",
    "aria-label": "Three boxes. Box 1 is reviewed every day, Box 2 every 3 days, Box 3 every week. Cards you get right move one box on; missed cards go back to Box 1.",
  }) };
}

// ---------- diagram types (Dual Coding) ----------

const DIAGRAM_ICONS = {
  flowchart: () => [
    svg("rect", { x: 2, y: 12, width: 12, height: 12, rx: 2 }), svg("rect", { x: 24, y: 12, width: 12, height: 12, rx: 2 }), svg("rect", { x: 46, y: 12, width: 12, height: 12, rx: 2 }),
    svg("path", { d: "M14 18 H24 M36 18 H46" }),
  ],
  timeline: () => [
    svg("path", { d: "M2 18 H58" }),
    ...[10, 24, 38, 52].map((cx) => svg("circle", { cx, cy: 18, r: 3, class: "dot" })),
  ],
  parts: () => [
    svg("circle", { cx: 30, cy: 18, r: 8 }),
    svg("path", { d: "M22 14 L8 6 M38 14 L52 6 M30 26 L30 34" }),
  ],
  table: () => [svg("rect", { x: 6, y: 5, width: 48, height: 26, rx: 2 }), svg("path", { d: "M6 18 H54 M30 5 V31" })],
  map: () => [
    svg("circle", { cx: 30, cy: 8, r: 5 }), svg("circle", { cx: 10, cy: 28, r: 5 }), svg("circle", { cx: 50, cy: 28, r: 5 }),
    svg("path", { d: "M27 13 L13 24 M33 13 L47 24 M15 28 H45" }),
  ],
};
const DIAGRAM_TYPES = [
  { shape: "Steps", draw: "Flowchart", icon: "flowchart" },
  { shape: "Sequence in time", draw: "Timeline", icon: "timeline" },
  { shape: "Parts of a whole", draw: "Labelled diagram", icon: "parts" },
  { shape: "Comparison", draw: "Table", icon: "table" },
  { shape: "Linked ideas", draw: "Concept map", icon: "map" },
];

function diagramTypes() {
  const tiles = DIAGRAM_TYPES.map(({ shape, draw, icon }) =>
    html("li", "type-tile", [
      svg("svg", { viewBox: "0 0 60 36", class: "type-icon", "aria-hidden": "true" }, DIAGRAM_ICONS[icon]()),
      html("span", "type-shape", [shape]),
      html("span", "type-draw", [`→ ${draw}`]),
    ]),
  );
  return { node: html("figure", "visual", [html("ul", "type-tiles", tiles)]) };
}

// ---------- blocked vs mixed practice (Interleaving) ----------

function blockedVersusMixed() {
  const row = (title, letters) =>
    html("div", "tile-row", [
      html("span", "tile-row-title", [title]),
      html("div", "tiles", letters.map((letter) => html("span", `tile tile-${letter.toLowerCase()}`, [letter]))),
    ]);
  return { node: html("figure", "visual", [
    row("Blocked: one topic at a time", [..."AAABBBCCC"]),
    row("Interleaved: mixed together", [..."ABCABCABC"]),
    html("p", "visual-caption", ["Each letter is a topic or problem type. Mixing them is harder, but it trains you to choose the right method."]),
  ]) };
}

// ---------- study calendar (Distributed Practice) ----------

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const CALENDAR = [
  [["session", "A"], null, ["session", "B"], null, ["session", "C"], null, null],
  [["review", "A"], null, ["session", "D"], null, ["review", "B"], null, null],
  [["review", "C"], null, ["review", "D"], null, ["exam", "Exam"], null, null],
];

/** `show`: "sessions", "reviews" or "all". Sessions are new topics (letters); reviews revisit them. */
function studyCalendar({ show = "all" }) {
  const dimmed = (kind) => (show === "sessions" && kind === "review") || (show === "reviews" && kind === "session");
  const cells = CALENDAR.flat().map((cell) => {
    if (!cell) return html("span", "day");
    const [kind, text] = cell;
    return html("span", `day ${kind}${dimmed(kind) ? " dimmed" : ""}`, [kind === "review" ? `↺${text}` : text]);
  });
  return { node: html("figure", "visual", [
    html("div", "calendar", [...WEEKDAYS.map((day) => html("span", "weekday", [day])), ...cells], { "aria-hidden": "true" }),
    html("ul", "visual-legend", [
      html("li", "legend-item focus", [html("span", "swatch"), "New topic (letter)"]),
      html("li", "legend-item break", [html("span", "swatch"), "↺ Review of that topic"]),
      html("li", "legend-item exam", [html("span", "swatch"), "Exam"]),
    ]),
  ], { role: "img", "aria-label": "Three week calendar. Each week has study sessions on Monday, Wednesday and Friday. Week one introduces topics A, B and C, week two adds topic D and reviews A and B, and week three reviews C and D before the exam on the Friday." }) };
}

// ---------- the three questions of self-explanation ----------

function explainQuestions() {
  const questions = ["What changed, or what does this part say?", "Why is that true or allowed?", "How does it connect to the part before it?"];
  return { node: html("figure", "visual", [html("ol", "question-cards", questions.map((text) => html("li", "", [text])))]) };
}

const VISUALS = {
  "pomodoro-cycle": pomodoroCycle,
  flow,
  flashcard,
  leitner,
  "diagram-types": diagramTypes,
  "blocked-versus-mixed": blockedVersusMixed,
  "study-calendar": studyCalendar,
  "explain-questions": explainQuestions,
};

/**
 * Builds the diagram for a step's `visual`, or returns null if its name is unknown.
 * Context: { subject } lets a diagram pick subject-specific examples.
 */
export function renderVisual(visual, { subject = "other" } = {}) {
  const draw = VISUALS[visual.name];
  return draw ? draw(visual, { subject }) : null;
}
