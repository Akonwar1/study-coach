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

export function svg(tag, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value));
  for (const child of children) node.append(child);
  return node;
}

export function svgText(text, attrs) {
  const node = svg("text", attrs);
  node.textContent = text;
  return node;
}

const percent = (fraction) => `${Math.round(Math.min(1, Math.max(0, fraction)) * 100)}%`;

// ---------- step progress strip ----------

const MIN_SEGMENT_WEIGHT = 2; // untimed steps still get a visible slice

/**
 * One tappable slice per step, sized by its minutes. Done steps are full, skipped steps are hatched, and the
 * others fill with their own timers (`fractions`, one per step). The current slice is outlined and fills live
 * through update(). Untimed steps are shown full once you reach them.
 * options: { statuses, fractions, onPick(index) }; without them, steps before the current one count as done.
 */
export function renderStepStrip(steps, currentIndex, { statuses, fractions, onPick } = {}) {
  let currentFill = null;
  const slices = steps.map((step, index) => {
    const status = statuses?.[index] ?? (index < currentIndex ? "done" : "todo");
    const isCurrent = index === currentIndex;
    const full = status === "done" || (isCurrent && step.minutes === 0);
    const fill = html("span", "strip-fill");
    fill.style.width = full ? "100%" : percent(fractions?.[index] ?? 0);
    if (isCurrent) currentFill = fill;
    const label = `Step ${index + 1}: ${step.title}${status === "done" ? " (done)" : status === "skipped" ? " (skipped)" : ""}`;
    const classes = `strip-seg${isCurrent ? " current" : ""}${status === "skipped" ? " skipped" : ""}`;
    const slice = html("button", classes, [html("span", "strip-bar", [fill])], {
      type: "button",
      title: label,
      "aria-label": label,
      ...(isCurrent ? { "aria-current": "step" } : {}),
    });
    slice.style.flexGrow = String(Math.max(step.minutes, MIN_SEGMENT_WEIGHT));
    slice.addEventListener("click", () => onPick?.(index));
    return slice;
  });
  const node = html("div", "step-strip", slices, { role: "group", "aria-label": `Step ${currentIndex + 1} of ${steps.length}. Tap a step to jump to it.` });
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

// ---------- Active Recall: one wide picture per step, each laid out differently ----------
//
// Scenes are 320 x 170 units, built from the shapes below and coloured by CSS variables (see ".scene" in
// styles.css). Entrance animations (pop, draw, settle, sweep) play once when a step opens; pulses and
// travellers loop. For viewers who prefer reduced motion nothing moves and the finished picture shows.

const prefersReducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const bar = (x, y, width, kind) => svg("rect", { class: `bar ${kind}`, x, y, width, height: kind === "head" ? 4.5 : 3.5, rx: 1.75 });

/**
 * A sheet of paper. Each row is [fraction of the width, kind]: "ink" (default), "head", "key" (a bold term),
 * "pen2" (written with the second pen) or "gap" (a dashed blank where you got stuck).
 */
function sheet(x, y, width, height, rows = [], { accent = false } = {}) {
  const parts = [svg("rect", { class: `sheet${accent ? " accent" : ""}`, x, y, width, height, rx: 2 })];
  rows.forEach(([fraction, kind = "ink"], index) => {
    const top = y + 6 + index * 7;
    parts.push(kind === "gap"
      ? svg("line", { class: "gap-line", x1: x + 5, y1: top + 2, x2: x + 5 + (width - 10) * fraction, y2: top + 2 })
      : bar(x + 5, top, (width - 10) * fraction, kind));
  });
  return svg("g", {}, parts);
}

const PAGE_ROWS = [[0.8, "head"], [1], [0.9], [0.35, "key"], [1], [0.85], [0.45, "key"], [0.7]];
const BOOK_ROWS = [[0.8, "head"], [1], [0.9], [1], [0.7]];

const pen = (x1, y1, x2, y2, second = false) => svg("line", { class: `pen${second ? " second" : ""}`, x1, y1, x2, y2 });

function shutBook(x, y) {
  return svg("g", {}, [
    svg("rect", { class: "cover", x, y, width: 28, height: 20, rx: 2 }),
    svg("line", { class: "spine", x1: x + 5, y1: y, x2: x + 5, y2: y + 20 }),
    svg("rect", { class: "bar ink", x: x + 10, y: y + 8, width: 12, height: 3.5, rx: 1.75 }),
  ]);
}

function phone(x, y) {
  return svg("g", {}, [
    svg("rect", { class: "device", x, y, width: 13, height: 24, rx: 3 }),
    svg("circle", { class: "pupil", cx: x + 6.5, cy: y + 19.5, r: 1.3 }),
  ]);
}

const tick = (cx, cy, size) => svg("path", { class: "tick", d: `M${cx - size} ${cy} L${cx - size * 0.3} ${cy + size * 0.7} L${cx + size} ${cy - size * 0.7}` });

function bell(cx, cy) {
  return svg("g", {}, [
    svg("path", { class: "bell", d: `M${cx - 9} ${cy + 7} Q${cx - 7} ${cy + 1} ${cx - 7} ${cy - 4} A7 7 0 0 1 ${cx + 7} ${cy - 4} Q${cx + 7} ${cy + 1} ${cx + 9} ${cy + 7} Z` }),
    svg("circle", { class: "bell", cx, cy: cy + 11, r: 2.4 }),
  ]);
}

const place = (x, y, scale, children) => svg("g", { transform: `translate(${x} ${y}) scale(${scale})` }, children);

function label(content, x, y, { anchor = "middle", size = "", tone = "" } = {}) {
  return svgText(content, { class: ["scene-label", anchor, size, tone].filter(Boolean).join(" "), x, y });
}

/** A rounded label centred at (cx, cy). kind: "soft" or "solid". */
function pill(cx, cy, width, content, kind = "soft", height = 26) {
  return svg("g", {}, [
    svg("rect", { class: `pill ${kind}`, x: cx - width / 2, y: cy - height / 2, width, height, rx: height / 2 }),
    label(content, cx, cy, { tone: kind === "solid" ? "on-solid" : "" }),
  ]);
}

function tip(x, y, angle) {
  return svg("path", { class: "arrow-tip", d: "M0 0 L-6 -3.5 L-6 3.5 Z", transform: `translate(${x} ${y}) rotate(${angle})` });
}

function arrow(x1, y1, x2, y2, dashed = false) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return svg("g", {}, [svg("line", { class: `arrow-line${dashed ? " dashed" : ""}`, x1, y1, x2, y2 }), tip(x2, y2, angle)]);
}

/** Wraps `node` in a group that plays an entrance or ambient animation ("pop", "pulse" or "settle faded"). */
function animated(node, kind, delay = 0, vars = {}) {
  const style = [`--d:${delay}s`, ...Object.entries(vars).map(([name, value]) => `${name}:${value}`)].join(";");
  return svg("g", { class: kind, style }, [node]);
}

/** A path that draws itself in. */
function drawn(attrs, delay = 0) {
  return svg("path", { ...attrs, class: `${attrs.class} draw`, pathLength: 1, style: `--d:${delay}s` });
}

/** Something that travels along `path` forever. Not drawn at all for viewers who prefer reduced motion. */
function traveller(shape, path, seconds, begin = 0) {
  if (prefersReducedMotion()) return [];
  shape.append(svg("animateMotion", { path, dur: `${seconds}s`, begin: `${begin}s`, repeatCount: "indefinite" }));
  return [shape];
}

// Step 1: narrowing the material down to one chunk

function chooseScene() {
  const pages = Array.from({ length: 7 }, (_, index) =>
    animated(place(8 + index * 43, 4, 0.6, [sheet(0, 0, 44, 56, BOOK_ROWS)]), "pop", index * 0.1));
  return [
    svg("polygon", { class: "funnel", points: "8,46 312,46 122,100 58,100" }),
    ...pages,
    label("All your material", 135, 70),
    animated(place(70, 104, 0.72, [sheet(12, 0, 44, 56, [], { accent: true }), sheet(0, 6, 44, 56, BOOK_ROWS, { accent: true })]), "pop", 1),
    animated(svg("ellipse", { class: "ring", cx: 90, cy: 126, rx: 34, ry: 27 }), "pulse", 1.5),
    label("1–2 pages, or 3–5 key ideas", 90, 160),
    label("+", 152, 126, { size: "big" }),
    place(196, 104, 0.72, [sheet(0, 0, 44, 56)]),
    pen(240, 146, 250, 106), pen(256, 146, 264, 108, true),
    label("Paper and two pens", 236, 160),
  ];
}

// Step 2: reading once, and the outline that grows out of it

function studyScene() {
  const scale = 2;
  const originX = 14;
  const originY = 8;
  const ringAround = (rowIndex, fraction, kind, delay) => {
    const width = scale * 48 * fraction;
    const top = originY + scale * (6 + 7 * rowIndex);
    const height = scale * (kind === "head" ? 4.5 : 3.5);
    return animated(svg("ellipse", { class: "ring", cx: originX + scale * 5 + width / 2, cy: top + height / 2, rx: width / 2 + 9, ry: 9 }), "pop", delay);
  };
  const child = (cx, delay) => [
    animated(svg("circle", { class: "dot soft", cx, cy: 84, r: 8 }), "pop", delay),
    animated(svg("rect", { class: "bar ink", x: cx - 18, y: 104, width: 36, height: 3.5, rx: 1.75 }), "pop", delay + 0.2),
    animated(svg("rect", { class: "bar ink", x: cx - 12, y: 113, width: 24, height: 3.5, rx: 1.75 }), "pop", delay + 0.3),
  ];
  const scan = svg("rect", { class: "scan", x: originX, y: originY + 4, width: 116, height: 10, rx: 3 });
  return [
    place(originX, originY, scale, [sheet(0, 0, 58, 66, PAGE_ROWS)]),
    ...traveller(scan, "M0 0 L0 110 L0 0", 5),
    ringAround(0, 0.8, "head", 0.6), ringAround(3, 0.35, "key", 1), ringAround(6, 0.45, "key", 1.4),
    label("The material", 72, 156),
    arrow(140, 72, 178, 72),
    drawn({ class: "link-line", d: "M252 32 L206 77 M252 32 L252 77 M252 32 L298 77" }, 1.8),
    animated(svg("circle", { class: "dot solid", cx: 252, cy: 24, r: 9 }), "pop", 1.7),
    ...child(206, 2.2), ...child(252, 2.4), ...child(298, 2.6),
    label("Your outline", 252, 140),
  ];
}

// Step 3: clearing the desk

function closeScene() {
  const away = (shape, x, y, scale, fromX) => animated(place(x, y, scale, [shape]), "settle faded", 0.9, { "--fx": `${fromX}px` });
  return [
    svg("rect", { class: "zone", x: 4, y: 6, width: 52, height: 100, rx: 8 }),
    svg("rect", { class: "zone", x: 264, y: 6, width: 52, height: 100, rx: 8 }),
    label("Out of", 30, 20, { size: "small" }), label("sight", 30, 32, { size: "small" }),
    label("Out of", 290, 20, { size: "small" }), label("sight", 290, 32, { size: "small" }),
    svg("rect", { class: "desk", x: 64, y: 6, width: 192, height: 100, rx: 8 }),
    sheet(112, 14, 96, 84, [], { accent: true }),
    label("Blank page", 160, 56), pen(222, 94, 238, 42),
    away(shutBook(0, 0), 8, 50, 1.4, 62),
    away(phone(0, 0), 281, 46, 1.3, -60),
    svg("circle", { class: "figure", cx: 30, cy: 128, r: 9 }),
    svg("path", { class: "figure", d: "M12 168 Q12 144 30 144 Q48 144 48 168 Z" }),
    svg("circle", { class: "bubble", cx: 50, cy: 138, r: 2.5 }), svg("circle", { class: "bubble", cx: 56, cy: 132, r: 3.5 }),
    svg("rect", { class: "bubble", x: 62, y: 112, width: 76, height: 44, rx: 12 }),
    animated(label("?", 100, 135, { size: "big", tone: "accent" }), "pulse"),
    label("Stuck for a moment?", 150, 124, { anchor: "start" }),
    label("That effort is the work.", 150, 140, { anchor: "start" }),
    label("Don’t peek.", 150, 156, { anchor: "start", tone: "accent" }),
  ];
}

// Step 4: write, hit a blank, try another way in, keep writing

function writeScene() {
  const cx = 160;
  const cy = 76;
  const rx = 90;
  const ry = 58;
  const onLoop = (degrees) => {
    const t = (degrees * Math.PI) / 180;
    return { x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t), heading: (Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)) * 180) / Math.PI };
  };
  const tips = [-30, 90, 210].map((degrees) => { const { x, y, heading } = onLoop(degrees); return tip(x, y, heading); });
  const right = onLoop(30);
  const left = onLoop(150);
  const chips = [["heading", 20], ["next bit", 65], ["example", 110]];
  const dot = svg("circle", { class: "dot solid", r: 6 });
  return [
    svg("ellipse", { class: "loop-track", cx, cy, rx, ry }),
    ...tips,
    ...traveller(dot, `M${cx} ${cy - ry} A${rx} ${ry} 0 0 1 ${cx} ${cy + ry} A${rx} ${ry} 0 0 1 ${cx} ${cy - ry}`, 8),
    place(138, 52, 0.7, [sheet(0, 0, 62, 58, [[0.5, "head"], [0.9], [0.65], [0.8, "gap"]])]),
    animated(pill(cx, cy - ry, 130, "Write what comes", "solid"), "pop", 0),
    animated(pill(right.x + 2, right.y, 96, "Hit a blank"), "pop", 0.5),
    animated(pill(left.x - 2, left.y, 122, "Try another way in"), "pop", 1),
    ...chips.map(([text, x], index) => animated(svg("g", {}, [
      svg("rect", { class: "chip", x, y: 143, width: 42, height: 17, rx: 8.5 }),
      label(text, x + 21, 151.5, { size: "tiny" }),
    ]), "pop", 1.3 + index * 0.15)),
  ];
}

// Step 5: comparing with the source, then counting

function checkScene() {
  const scale = 1.5;
  const rowCentre = (index) => 26 + scale * (6 + 7 * index + 1.75);
  const recall = [[0.8, "head"], [1], [1, "gap"], [0.9], [0.7], [1, "gap"]];
  const notes = [[0.8, "head"], [1], [0.85], [0.9], [0.7], [0.95]];
  const missed = [2, 5];
  const links = [0, 1, 2, 3, 4, 5].map((index) => missed.includes(index)
    ? arrow(111, rowCentre(index), 98, rowCentre(index))
    : svg("line", { class: "link-line", x1: 96, y1: rowCentre(index), x2: 111, y2: rowCentre(index) }));
  const added = missed.map((index, order) => animated(
    svg("rect", { class: "bar pen2", x: 8 + scale * 5, y: 26 + scale * (6 + 7 * index), width: scale * 48, height: scale * 3.5, rx: 2.6 }), "pop", 1.2 + order * 0.4));
  return [
    place(8, 26, scale, [sheet(0, 0, 58, 52, recall)]),
    place(112, 26, scale, [sheet(0, 0, 58, 52, notes)]),
    ...added, ...links,
    label("Your recall", 51, 16), label("Your notes", 155, 16),
    label("Add what you missed", 103, 124), label("in a second colour", 103, 139, { tone: "accent" }),
    svg("circle", { class: "donut-track", cx: 262, cy: 70, r: 32 }),
    svg("circle", { class: "donut-arc sweep", cx: 262, cy: 70, r: 32, pathLength: 1, "stroke-dasharray": "0.6667 1", transform: "rotate(-90 262 70)" }),
    label("4 of 6", 262, 70, { size: "big", tone: "ink" }),
    label("Count what", 262, 122), label("you got right", 262, 137), label("(example)", 262, 153, { size: "small" }),
  ];
}

// Step 6: re-testing the gaps, round and round

function retestScene() {
  const card = () => svg("rect", { class: "card", x: -7, y: -5, width: 14, height: 10, rx: 2 });
  const pile = [0, 1, 2, 3].map((index) => svg("rect", { class: "card pile", x: 10 + index * 3, y: 50 + index * 8, width: 40, height: 16, rx: 3 }));
  return [
    ...pile,
    label("Gap pile", 32, 38),
    arrow(64, 72, 102, 72),
    svg("rect", { class: "gate", x: 104, y: 44, width: 44, height: 56, rx: 8 }),
    animated(label("?", 126, 72, { size: "big", tone: "accent" }), "pulse"),
    label("Recall it", 126, 114),
    svg("path", { class: "arrow-line", d: "M148 72 L176 72 L176 40 L222 40" }), tip(226, 40, 0),
    svg("rect", { class: "done-box", x: 228, y: 20, width: 86, height: 40, rx: 8 }),
    tick(246, 40, 8), label("Got it", 262, 40, { anchor: "start" }),
    arrow(271, 62, 271, 96, true),
    svg("rect", { class: "again-box", x: 228, y: 100, width: 86, height: 40, rx: 8 }),
    bell(244, 114), label("Tomorrow", 258, 124, { anchor: "start", size: "small" }),
    svg("path", { class: "arrow-line dashed", d: "M126 102 L126 140 L32 140 L32 102" }), tip(32, 98, -90),
    label("Missed: hook it, go again", 80, 158),
    ...traveller(card(), "M32 70 L126 72 L176 72 L176 40 L226 40", 6),
    ...traveller(card(), "M32 70 L126 72 L126 140 L32 140 L32 100", 6, 3),
  ];
}

// Step 7: reviews after some forgetting, so the memory lasts longer

function scheduleScene() {
  const left = 30;
  const width = 270;
  const top = 24;
  const base = 100;
  const segment = width / 3;
  const decays = [2.4, 1.5, 0.9];
  const at = (x, remembered) => `${(left + x).toFixed(1)} ${(base - remembered * (base - top)).toFixed(1)}`;
  let withReviews = "";
  decays.forEach((rate, index) => {
    for (let step = 0; step <= 20; step += 1) {
      const t = step / 20;
      withReviews += `${withReviews ? "L" : "M"}${at(index * segment + t * segment, Math.exp(-rate * t))} `;
    }
  });
  let withoutReviews = "";
  for (let step = 0; step <= 30; step += 1) {
    const t = step / 30;
    withoutReviews += `${step === 0 ? "M" : "L"}${at(t * width, Math.exp(-decays[0] * t * 3))} `;
  }
  const stops = [
    { x: left, name: "Today", note: "gaps found", icon: () => tick(left, 120, 8) },
    { x: left + segment, name: "Tomorrow", note: "redo steps 3–5", icon: () => bell(left + segment, 112) },
    { x: left + 2 * segment, name: "Next week", note: "once more", icon: () => bell(left + 2 * segment, 112) },
  ];
  return [
    svg("line", { class: "axis", x1: left, y1: base, x2: left + width, y2: base }),
    svg("line", { class: "axis", x1: left, y1: top - 8, x2: left, y2: base }),
    label("Remembered", left + 6, 10, { anchor: "start", size: "small" }),
    svg("path", { class: "curve without", d: withoutReviews.trim() }),
    drawn({ class: "curve with", d: withReviews.trim() }, 0.3),
    ...stops.flatMap(({ x, name, note, icon }, index) => [
      animated(svg("circle", { class: "review-dot", cx: x, cy: top, r: 5 }), "pop", 0.3 + index * 0.8),
      animated(icon(), "pop", 0.5 + index * 0.8),
      label(name, x, 146), label(note, x, 161, { size: "small" }),
    ]),
  ];
}

const SCENES = {
  "recall-choose": { draw: chooseScene, caption: "Narrow your material down to one small chunk, then set out blank paper and two pens." },
  "recall-study": { draw: studyScene, caption: "Read once, carefully. The headings and bold terms become the outline you will rebuild." },
  "recall-close": { draw: closeScene, caption: "Clear the desk so only a blank page and a pen are left. Feeling stuck is the effort working." },
  "recall-write": { draw: writeScene, caption: "Write whatever comes. When you hit a blank, try another way in and keep going." },
  "recall-check": { draw: checkScene, caption: "Compare your recall with your notes, add what you missed in a second colour, then count." },
  "recall-retest": { draw: retestScene, caption: "Re-test only the gaps. Missed items get a hook and go round again until none are left." },
  "recall-schedule": { draw: scheduleScene, caption: "Redo steps 3 to 5 tomorrow and again in about a week, on the remaining gaps only. A sketch of the idea, not measured data." },
};

function sceneFigure(name) {
  const { draw, caption } = SCENES[name];
  return { node: html("figure", "visual", [
    svg("svg", { viewBox: "0 0 320 170", class: "scene wide-scene", role: "img", "aria-label": caption }, draw()),
    html("p", "visual-caption", [caption]),
  ]) };
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
  "recall-choose": () => sceneFigure("recall-choose"),
  "recall-study": () => sceneFigure("recall-study"),
  "recall-close": () => sceneFigure("recall-close"),
  "recall-write": () => sceneFigure("recall-write"),
  "recall-check": () => sceneFigure("recall-check"),
  "recall-retest": () => sceneFigure("recall-retest"),
  "recall-schedule": () => sceneFigure("recall-schedule"),
};

/**
 * Builds the diagram for a step's `visual`, or returns null if its name is unknown.
 * Context: { subject } lets a diagram pick subject-specific examples.
 */
export function renderVisual(visual, { subject = "other" } = {}) {
  const draw = VISUALS[visual.name];
  return draw ? draw(visual, { subject }) : null;
}
