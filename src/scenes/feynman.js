// Feynman Technique: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, bubble, card, cross, label, person, pill, place, sheet, svg, tick, traveller } from "../scene-kit.js";

// Step 1: zooming in on one idea, for one listener

function nameScene() {
  const chips = [[24, 38], [86, 38], [24, 66], [86, 66], [24, 94], [86, 94]].map(([x, y], index) =>
    svg("rect", { class: index === 3 ? "bar pen2" : "bar ink", x, y, width: 52, height: 12, rx: 6 }));
  return [
    card(10, 12, 150, 118, "", "plain"),
    label("Chapter 4", 85, 26),
    ...chips,
    animated(svg("ellipse", { class: "ring", cx: 112, cy: 72, rx: 34, ry: 15 }), "pulse"),
    svg("path", { class: "link-line dashed", d: "M138 60 L192 20 M138 84 L192 84" }),
    animated(svg("g", {}, [sheet(192, 12, 118, 76, []), svg("rect", { class: "bar head", x: 204, y: 24, width: 70, height: 6, rx: 3 }), label("one idea", 251, 50, { size: "small" })]), "pop", 0.8),
    person(188, 100, 0.75), person(248, 100, 0.75),
    label("friend", 206, 148, { size: "small" }), label("smart 12-year-old", 275, 148, { size: "small" }),
    label("Small enough to explain in a few minutes", 100, 150, { size: "small" }),
  ];
}

// Step 2: explaining in plain words

function explainScene() {
  return [
    person(10, 66, 1.1),
    animated(bubble(60, 10, 168, 78, [
      svg("rect", { class: "bar ink", x: 74, y: 24, width: 130, height: 5, rx: 2.5 }),
      svg("rect", { class: "bar ink", x: 74, y: 38, width: 110, height: 5, rx: 2.5 }),
      svg("rect", { class: "bar ink", x: 74, y: 52, width: 120, height: 5, rx: 2.5 }),
      pill(112, 74, 80, "an example", "soft", 16),
    ], { tail: "left" }), "pop", 0.3),
    person(262, 66, 1),
    arrow(232, 50, 256, 70),
    animated(pill(268, 28, 78, "jargon", "dashed", 22), "pop", 0.8),
    svg("line", { class: "cross-mark", x1: 232, y1: 28, x2: 304, y2: 28 }),
    label("plain words", 144, 106, { size: "small" }),
    label("Explain every technical word, or skip it.", 160, 126, { size: "small" }),
    label("Stalling or going vague? That marks a gap.", 160, 144, { size: "small", tone: "accent" }),
  ];
}

// Step 3: circling where you stalled

function gapsScene() {
  const rows = [[0.5, "head"], [1], [0.95], [0.8], [1], [0.9], [0.7], [1]];
  const rowY = (index) => 20 + index * 11;
  const ringAround = (index, fraction, delay) => {
    const width = 282 * fraction;
    return animated(svg("ellipse", { class: "ring", cx: 19 + width / 2, cy: rowY(index) + 2, rx: width / 2 + 7, ry: 7.5 }), "pop", delay);
  };
  const lens = svg("circle", { class: "ring", r: 9 });
  return [
    svg("rect", { class: "sheet", x: 14, y: 8, width: 292, height: 104, rx: 3 }),
    ...rows.map(([fraction, kind], index) => svg("rect", { class: `bar ${kind}`, x: 19, y: rowY(index), width: 282 * fraction, height: kind === "head" ? 4.5 : 3.5, rx: 1.75 })),
    ringAround(2, 0.3, 0.6), ringAround(4, 0.45, 1.1), ringAround(6, 0.25, 1.6),
    ...traveller(lens, "M30 24 L280 24 L30 57 L280 57 L30 90 L280 90", 9),
    animated(pill(60, 126, 78, "stalled", "soft", 22), "pop", 0.8), animated(pill(160, 126, 78, "guessed", "soft", 22), "pop", 1.2), animated(pill(260, 126, 78, "jargon", "soft", 22), "pop", 1.6),
    label("Circle every place you stalled, guessed or hand-waved.", 160, 150),
    label("Each circle is something you can now fix.", 160, 164, { size: "small", tone: "accent" }),
  ];
}

// Step 4: looking up only the circled spots

function sourceScene() {
  const faded = (x, y, width) => svg("rect", { class: "bar ink", x, y, width, height: 4, rx: 2, opacity: 0.25 });
  const marks = [[142, 24, 78], [226, 46, 76], [150, 80, 80]];
  return [
    ...[1, 2, 3].map((number, index) => animated(svg("g", {}, [
      svg("circle", { class: "ring", cx: 28, cy: 30 + index * 42, r: 13 }), label(String(number), 28, 30 + index * 42),
    ]), "pop", index * 0.3)),
    svg("rect", { class: "sheet", x: 130, y: 8, width: 182, height: 106, rx: 4 }),
    svg("line", { class: "spine", x1: 221, y1: 8, x2: 221, y2: 114 }),
    ...Array.from({ length: 8 }, (_, row) => [faded(140, 18 + row * 12, 70), faded(230, 18 + row * 12, 72)]).flat(),
    ...marks.map(([x, y, width], index) => animated(svg("rect", { class: "highlight", x, y, width, height: 12, rx: 3 }), "pop", 0.5 + index * 0.4)),
    arrow(44, 30, 138, 30), arrow(44, 72, 224, 52), arrow(44, 114, 146, 86),
    sheet(150, 124, 160, 38, [[0.8, "pen2"], [0.55, "pen2"]]),
    label("your words", 90, 143, { size: "small" }),
    label("Look up only the circles.", 90, 158, { size: "small", tone: "accent" }),
  ];
}

// Step 5: each draft shorter and simpler

function simplifyScene() {
  const pageRows = (count) => Array.from({ length: count }, (_, index) => [index === 0 ? 0.7 : 1 - (index % 3) * 0.1, index === 0 ? "head" : "ink"]);
  return [
    animated(place(12, 10, 1, [sheet(0, 0, 96, 134, pageRows(12))]), "pop", 0),
    arrow(114, 76, 134, 76),
    animated(place(140, 28, 1, [sheet(0, 0, 76, 98, pageRows(8))]), "pop", 0.5),
    arrow(222, 76, 238, 76),
    animated(place(244, 44, 1, [sheet(0, 0, 60, 64, pageRows(5))]), "pop", 1),
    animated(pill(274, 40, 66, "like a…", "solid", 20), "pop", 1.5),
    label("First try", 60, 156, { size: "small" }), label("Shorter", 178, 156, { size: "small" }), label("Simplest", 274, 156, { size: "small" }),
    tick(274, 126, 9),
    label("no circles left", 274, 142, { size: "small", tone: "accent" }),
  ];
}

export const FEYNMAN_SCENES = {
  "fy-name": { draw: nameScene, caption: "Pick one small idea from the chapter and decide who you are explaining it to." },
  "fy-explain": { draw: explainScene, caption: "Explain it in plain words, with an example. Every technical word needs its own explanation." },
  "fy-gaps": { draw: gapsScene, caption: "Read your explanation back and circle every place you stalled, guessed or used a word you didn’t explain." },
  "fy-source": { draw: sourceScene, caption: "Look up only the circled spots, then write each answer in your own words." },
  "fy-simplify": { draw: simplifyScene, caption: "Write it again, shorter and simpler, with an analogy. Repeat for any new circles." },
};
