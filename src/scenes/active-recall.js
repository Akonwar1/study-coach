// Active Recall: one wide picture per step, each laid out differently. See scene-kit.js for the shapes.

import { BOOK_ROWS, PAGE_ROWS, animated, arrow, bell, drawn, label, pen, phone, pill, place, sheet, shutBook, svg, tick, tip, traveller } from "../scene-kit.js";

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

export const ACTIVE_RECALL_SCENES = {
  "recall-choose": { draw: chooseScene, caption: "Narrow your material down to one small chunk, then set out blank paper and two pens." },
  "recall-study": { draw: studyScene, caption: "Read once, carefully. The headings and bold terms become the outline you will rebuild." },
  "recall-close": { draw: closeScene, caption: "Clear the desk so only a blank page and a pen are left. Feeling stuck is the effort working." },
  "recall-write": { draw: writeScene, caption: "Write whatever comes. When you hit a blank, try another way in and keep going." },
  "recall-check": { draw: checkScene, caption: "Compare your recall with your notes, add what you missed in a second colour, then count." },
  "recall-retest": { draw: retestScene, caption: "Re-test only the gaps. Missed items get a hook and go round again until none are left." },
  "recall-schedule": { draw: scheduleScene, caption: "Redo steps 3 to 5 tomorrow and again in about a week, on the remaining gaps only. A sketch of the idea, not measured data." },
};
