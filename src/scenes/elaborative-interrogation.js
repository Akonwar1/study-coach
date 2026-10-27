// Elaborative Interrogation: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, bubble, card, cross, drawn, gauge, label, pill, place, shutBook, star, svg, tick } from "../scene-kit.js";

// Step 1: facts with roots (a reason) and facts without

function rootsScene() {
  const roots = "M80 50 V66 M80 66 L30 100 M80 66 L80 116 M80 66 L130 100";
  return [
    animated(card(20, 12, 120, 38, "A cause or rule", "soft"), "pop", 0),
    drawn({ class: "link-line", d: roots }, 0.4),
    ...[[30, 108], [130, 108], [80, 124]].map(([x, y], index) => animated(pill(x, y, 52, "because", "soft", 18), "pop", 0.9 + index * 0.2)),
    label("Has a reason: ask why", 80, 152, { tone: "accent" }),
    animated(card(186, 12, 120, 38, "A date or a word", "dashed"), "pop", 0.3),
    cross(246, 80, 10),
    label("No reason to find", 246, 112, { size: "small" }),
    label("Skip it, or use cards", 246, 144),
  ];
}

// Step 2: write the question before you look

function askScene() {
  return [
    card(8, 40, 92, 48, "A fact", "plain"),
    arrow(104, 64, 138, 64),
    animated(bubble(142, 14, 168, 100, [
      label("Why is", 226, 52, { size: "big", tone: "accent" }),
      label("this true?", 226, 84, { size: "big", tone: "accent" }),
    ], { tail: "left" }), "pop", 0.4),
    svg("g", { opacity: 0.45 }, [place(14, 112, 1.2, [shutBook(0, 0)])]),
    cross(60, 124, 9),
    label("Notes closed for now", 118, 130, { anchor: "start" }),
    label("Write the question down first.", 160, 160, { size: "small" }),
  ];
}

// Step 3: linking the new fact to what you already know

function knowScene() {
  const known = [[62, 30, "something similar"], [258, 30, "a rule I know"], [62, 134, "an example"], [258, 134, "a cause"]];
  return [
    drawn({ class: "link-line", d: known.map(([x, y]) => `M${x} ${y} L160 82`).join(" ") }, 0.3),
    ...known.map(([x, y, text], index) => animated(pill(x, y, 108, text, "soft", 24), "pop", 0.2 + index * 0.25)),
    animated(card(118, 64, 84, 36, "new fact", "solid"), "pop", 1.4),
    label("Answer with a “because”. A guess is fine.", 160, 164, { size: "small" }),
  ];
}

// Step 4: marking your answer against the source

function checkScene() {
  const wavy = "M28 66 q4 -4 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0";
  return [
    svg("rect", { class: "sheet", x: 10, y: 10, width: 206, height: 128, rx: 4 }),
    svg("rect", { class: "bar head", x: 28, y: 28, width: 140, height: 5, rx: 2.5 }),
    tick(194, 30, 7),
    svg("rect", { class: "bar ink", x: 28, y: 58, width: 150, height: 5, rx: 2.5 }),
    animated(svg("path", { class: "link-line second", d: wavy, transform: "translate(0 10)" }), "pop", 0.6),
    svg("rect", { class: "bar ink", x: 28, y: 88, width: 110, height: 5, rx: 2.5 }),
    animated(svg("g", {}, [svg("circle", { class: "dot solid", cx: 190, cy: 114, r: 9 }), svg("path", { class: "mark-plus", d: "M190 109 V119 M185 114 H195" }), svg("rect", { class: "bar pen2", x: 28, y: 112, width: 140, height: 5, rx: 2.5 })]), "pop", 1.1),
    tick(238, 34, 6), label("right", 262, 34, { anchor: "start" }),
    svg("path", { class: "link-line second", d: "M232 70 q4 -4 8 0 t8 0 t8 0", transform: "translate(0 -2)" }), label("too vague", 270, 68, { anchor: "start", size: "small" }),
    label("fix it", 270, 82, { anchor: "start", size: "small" }),
    svg("circle", { class: "dot solid", cx: 238, cy: 114, r: 7 }), label("add what", 252, 108, { anchor: "start", size: "small" }), label("you missed", 252, 121, { anchor: "start", size: "small" }),
    label("Mark it honestly, then fix it.", 113, 156, { size: "small" }),
  ];
}

// Step 5: about two minutes for each fact

function repeatScene() {
  const rings = [0, 1, 2, 3, 4].map((index) => {
    const cx = 34 + index * 63;
    const { parts } = gauge(cx, 76, 22, 1, "accent", { thin: true, fillIn: index * 1.6 });
    return svg("g", {}, [...parts, label(String(index + 1), cx, 76, { size: "big", tone: "ink" })]);
  });
  return [
    ...rings,
    ...[0, 1, 2, 3, 4].map((index) => label("2 min", 34 + index * 63, 116, { size: "small" })),
    label("Ask why, answer, check. Then move on.", 160, 142),
    label("Unsure? Move on anyway.", 160, 158, { size: "small", tone: "accent" }),
  ];
}

// Step 6: which fact was weakest

function weakScene() {
  const heights = [62, 78, 28, 84, 54];
  const base = 128;
  return [
    svg("line", { class: "axis", x1: 14, y1: base, x2: 196, y2: base }),
    ...heights.map((height, index) => animated(svg("rect", { class: index === 2 ? "scene-bar hot" : "scene-bar", x: 24 + index * 34, y: base - height, width: 24, height, rx: 3 }), "pop", index * 0.15)),
    ...heights.map((_, index) => label(`F${index + 1}`, 36 + index * 34, base + 12, { size: "small" })),
    star(94, base - heights[2] - 14, 8),
    label("Start here tomorrow", 105, 158, { tone: "accent" }),
    card(210, 22, 100, 100, "", "dashed"),
    label("Several weak?", 260, 50, { size: "small" }),
    label("The topic needs", 260, 72, { size: "small" }),
    label("a method for", 260, 86, { size: "small" }),
    label("understanding", 260, 100, { size: "small" }),
  ];
}

export const ELABORATIVE_INTERROGATION_SCENES = {
  "ei-roots": { draw: rootsScene, caption: "Question facts that have a reason behind them. Arbitrary facts have nothing to find." },
  "ei-ask": { draw: askScene, caption: "Write “Why is this true?” under the fact, with your notes closed." },
  "ei-know": { draw: knowScene, caption: "Answer by linking the fact to what you already know, with a “because” in it." },
  "ei-check": { draw: checkScene, caption: "Mark what you got right, fix what was vague or wrong, and add what you missed." },
  "ei-repeat": { draw: repeatScene, caption: "Give each fact about two minutes: ask why, answer, check. Then move on." },
  "ei-weak": { draw: weakScene, caption: "Circle the fact you explained worst. Tomorrow starts there." },
};
