// Self-Explanation: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, bubble, card, drawn, label, person, pill, sheet, star, svg, tick, traveller } from "../scene-kit.js";

// Step 1: which kind of material you have

function materialScene() {
  const steps = (x) => [0, 1, 2].map((index) => svg("g", {}, [
    svg("circle", { class: "dot solid", cx: x + 14, cy: 92 + index * 15, r: 4.5 }),
    svg("rect", { class: "bar ink", x: x + 24, y: 90 + index * 15, width: 54, height: 4, rx: 2 }),
  ]));
  const paragraphs = (x) => [0, 1, 2].map((index) => svg("g", {}, [
    svg("rect", { class: "bar ink", x: x + 10, y: 88 + index * 18, width: 76, height: 3.5, rx: 1.75 }),
    svg("rect", { class: "bar ink", x: x + 10, y: 95 + index * 18, width: 60, height: 3.5, rx: 1.75 }),
  ]));
  return [
    animated(pill(160, 18, 160, "Which do you have?", "solid", 26), "pop", 0),
    drawn({ class: "link-line", d: "M160 31 V42 M56 42 H264 M56 42 V52 M160 42 V52 M264 42 V52" }, 0.3),
    ...[[8, "Worked solution", "explain each step"], [112, "Problem only", "solve it first"], [216, "Essay or text", "each paragraph"]].map(([x, title, note], index) =>
      animated(svg("g", {}, [card(x, 52, 96, 106, "", "plain"), label(title, x + 48, 68), label(note, x + 48, 82, { size: "small", tone: "accent" })]), "pop", 0.6 + index * 0.25)),
    animated(svg("g", {}, steps(8)), "pop", 1.2),
    animated(svg("g", {}, [label("?", 160, 118, { size: "big", tone: "accent" })]), "pop", 1.4),
    animated(svg("g", {}, paragraphs(216)), "pop", 1.6),
  ];
}

// Step 2: cutting into chunks and covering the rest

function chunksScene() {
  const bounds = [26, 50, 74, 98];
  return [
    svg("rect", { class: "sheet", x: 10, y: 8, width: 104, height: 144, rx: 3 }),
    ...Array.from({ length: 10 }, (_, row) => svg("rect", { class: "bar ink", x: 20, y: 18 + row * 13.5, width: 70 + (row % 3) * 8, height: 3.5, rx: 1.75 })),
    ...[44, 72, 100, 126].map((y, index) => drawn({ class: "cut-line", d: `M6 ${y} H118` }, 0.4 + index * 0.3)),
    arrow(122, 80, 150, 80),
    animated(card(158, 12, 150, 34, "Chunk 1", "soft"), "pop", 1.2),
    ...[0, 1, 2].map((index) => svg("rect", { class: "card plain", x: 164 + index * 6, y: 60 + index * 26, width: 144 - index * 6, height: 24, rx: 5, opacity: 0.5 })),
    svg("rect", { class: "cover-sheet", x: 158, y: 54, width: 150, height: 98, rx: 6 }),
    label("covered", 233, 88),
    label("until it is your turn", 233, 104, { size: "small" }),
    label("4 to 10 chunks", 64, 166, { size: "small", anchor: "middle" }),
  ];
}

// Step 3: three questions for every chunk

function explainScene() {
  const asks = [[160, 22, 150, "What does it say?"], [62, 136, 112, "Why is it true?"], [258, 136, 124, "How does it connect?"]];
  return [
    drawn({ class: "link-line", d: "M160 34 L160 64 M110 128 L140 98 M222 128 L182 98" }, 0.3),
    ...asks.map(([cx, cy, width, text], index) => animated(pill(cx, cy, width, text, "soft", 26), "pop", 0.2 + index * 0.35)),
    animated(card(118, 62, 84, 36, "a chunk", "solid"), "pop", 0),
    animated(star(214, 66, 9), "pulse", 1.4),
    label("Can’t answer", 270, 60, { size: "small" }), label("all three?", 270, 73, { size: "small" }), label("Star it.", 270, 86, { size: "small", tone: "accent" }),
  ];
}

// Step 4: working out a starred chunk

function starredScene() {
  const stage = (x, y, width, text, kind, delay) => animated(card(x, y, width, 34, text, kind), "pop", delay);
  return [
    animated(svg("g", {}, [card(8, 10, 108, 38, "", "soft"), star(26, 29, 8), label("starred chunk", 74, 29, { size: "small" })]), "pop", 0),
    arrow(62, 50, 62, 68),
    stage(8, 70, 130, "find the rule", "plain", 0.4), arrow(76, 106, 76, 122),
    stage(8, 124, 150, "explain it again", "plain", 0.8),
    arrow(162, 141, 214, 141),
    animated(svg("g", {}, [card(218, 120, 92, 40, "", "good"), tick(240, 140, 8), label("all 3 parts", 282, 140, { size: "small" })]), "pop", 1.3),
    animated(card(160, 24, 150, 74, "", "dashed"), "pop", 1),
    label("Still stuck", 235, 44, { size: "small" }),
    label("after a few minutes?", 235, 60, { size: "small" }),
    label("Write your question", 235, 78, { size: "small", tone: "accent" }),
    label("for someone else", 235, 90, { size: "small", tone: "accent" }),
  ];
}

// Step 5: the source is hidden, the reasoning is yours

function redoScene() {
  return [
    svg("rect", { class: "cover-sheet", x: 10, y: 10, width: 104, height: 128, rx: 4 }),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((index) => svg("line", { class: "hatch", x1: 10, y1: 22 + index * 16, x2: 114, y2: 6 + index * 16 })),
    label("hidden", 62, 74),
    animated(svg("g", {}, [svg("rect", { class: "sheet accent", x: 22, y: 112, width: 80, height: 16, rx: 3 }), svg("rect", { class: "bar ink", x: 30, y: 118, width: 50, height: 4, rx: 2 })]), "pop", 1.2),
    label("peek: stuck chunk only", 62, 150, { size: "small" }),
    person(136, 76, 1.2),
    animated(bubble(176, 14, 134, 100, [
      label("Step 1…", 243, 34, { size: "small", anchor: "middle" }),
      label("because…", 243, 54, { size: "small" }),
      label("so step 2…", 243, 74, { size: "small" }),
      label("because…", 243, 94, { size: "small" }),
    ], { tail: "left" }), "pop", 0.4),
    label("Narrate every move and why.", 243, 140, { size: "small", tone: "accent" }),
  ];
}

// Step 6: the same reasoning on a different problem

function twinScene() {
  const dot = svg("circle", { class: "dot solid", r: 6 });
  return [
    animated(card(8, 78, 92, 62, "Problem 1", "soft"), "pop", 0),
    animated(card(220, 78, 92, 62, "Problem 2", "soft"), "pop", 0.4),
    svg("path", { class: "bridge", d: "M100 96 Q160 6 220 96" }),
    svg("line", { class: "link-line", x1: 100, y1: 102, x2: 220, y2: 102 }),
    ...traveller(dot, "M100 96 Q160 6 220 96 Q160 6 100 96", 5),
    label("same reasoning", 160, 38, { tone: "accent" }),
    label("new numbers or details", 266, 150, { size: "small" }),
    label("Whichever chunk trips you is where tomorrow starts.", 160, 164, { size: "small", tone: "accent" }),
  ];
}

export const SELF_EXPLANATION_SCENES = {
  "se-material": { draw: materialScene, caption: "Pick the kind of material you have: a worked solution, a problem with no solution, or an essay." },
  "se-chunks": { draw: chunksScene, caption: "Break the material into 4 to 10 chunks and cover everything except the first." },
  "se-explain": { draw: explainScene, caption: "For each chunk: what does it say, why is it true, and how does it connect to the one before? Star the ones you can’t answer." },
  "se-starred": { draw: starredScene, caption: "Find the rule behind each starred chunk and explain it again until you can give all three parts." },
  "se-redo": { draw: redoScene, caption: "Hide the source and narrate the whole thing from the start. Peek at only the chunk you are stuck on." },
  "se-twin": { draw: twinScene, caption: "Explain a new problem or passage the same way. The reasoning carries over, and only the details change." },
};
