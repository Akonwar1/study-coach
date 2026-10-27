// Spaced Repetition: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, bell, card, cross, drawn, label, pill, svg, tick, tip, traveller } from "../scene-kit.js";

// Step 1: what belongs on a card

function gatherScene() {
  const words = ["terms", "dates", "formulas", "vocab"];
  return [
    ...words.map((text, index) => animated(pill(36 + index * 56, 24, 52, text, "soft", 22), "pop", index * 0.15)),
    animated(pill(279, 24, 66, "reasons", "dashed", 22), "pop", 0.7),
    ...words.map((_, index) => arrow(36 + index * 56, 38, 36 + index * 56, 80)),
    arrow(279, 38, 279, 80, true),
    card(8, 84, 224, 62, "", "soft"),
    label("Remember outright", 120, 102),
    label("10–15 items you’d hate to blank on", 120, 124, { size: "small" }),
    card(244, 84, 70, 62, "", "dashed"),
    label("Save for", 279, 106, { size: "small" }),
    label("Feynman", 279, 122, { size: "small" }),
    label("Cards are for things you must recall word for word.", 160, 160, { size: "small" }),
  ];
}

// Step 2: one fact per card, a question you have to answer

function questionAnswerCard(x, y, width, height, answerLines, { faded = false } = {}) {
  const split = y + 24;
  return svg("g", faded ? { opacity: 0.9 } : {}, [
    svg("rect", { class: "card plain", x, y, width, height, rx: 6 }),
    svg("rect", { class: "pill solid", x: x + 8, y: y + 8, width: 14, height: 14, rx: 7 }),
    label("Q", x + 15, y + 15, { size: "tiny", tone: "on-solid" }),
    svg("rect", { class: "bar head", x: x + 28, y: y + 10, width: width * 0.5, height: 4.5, rx: 2.2 }),
    svg("line", { class: "link-line", x1: x + 8, y1: split, x2: x + width - 8, y2: split }),
    ...answerLines.map((fraction, index) => svg("rect", { class: "bar pen2", x: x + 10, y: split + 8 + index * 11, width: (width - 20) * fraction, height: 4.5, rx: 2.2 })),
  ]);
}

function cardScene() {
  return [
    questionAnswerCard(10, 14, 124, 124, [1, 0.9, 0.95, 0.7]),
    label("Too much on one card", 72, 154, { size: "small" }),
    arrow(142, 76, 182, 76),
    label("split it", 162, 64, { size: "small" }),
    animated(questionAnswerCard(192, 14, 118, 60, [0.8]), "pop", 0.8),
    animated(questionAnswerCard(192, 82, 118, 60, [0.6]), "pop", 1.1),
    label("One fact each", 251, 154, { size: "small" }),
  ];
}

// Step 3: say it, then flip, then sort honestly

function sortScene() {
  const card_ = animated(card(108, 8, 104, 50, "What is…?", "plain"), "pulse");
  return [
    card_,
    svg("path", { class: "bubble", d: "M12 18 H88 a8 8 0 0 1 8 8 V42 a8 8 0 0 1 -8 8 H12 a8 8 0 0 1 -8 -8 V26 a8 8 0 0 1 8 -8 Z" }),
    label("Say the answer", 50, 30, { size: "small" }),
    label("out loud first", 50, 43, { size: "small" }),
    arrow(138, 62, 88, 98), arrow(182, 62, 232, 98),
    card(30, 100, 116, 42, "", "good"), tick(60, 121, 8), label("Got it", 100, 121),
    card(172, 100, 116, 42, "", "dashed"), cross(200, 121, 6), label("Missed", 246, 121),
    label("“Sort of” counts as missed", 230, 158, { size: "small", tone: "accent" }),
  ];
}

// Step 4: the three boxes, from daily to weekly

function boxesScene() {
  const boxes = [
    { x: 14, height: 40, name: "Box 1", every: "every day" },
    { x: 116, height: 70, name: "Box 2", every: "every 3 days" },
    { x: 218, height: 100, name: "Box 3", every: "every week" },
  ];
  const base = 148;
  const stairs = boxes.flatMap(({ x, height, name, every }, index) => animated(svg("g", {}, [
    card(x, base - height, 88, height, "", "soft"),
    label(name, x + 44, base - height + 14),
    label(every, x + 44, base - height + 29, { size: "small" }),
  ]), "pop", index * 0.4));
  const hop = (x1, y1, x2, y2) => svg("path", { class: "arrow-line", d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 30} ${x2} ${y2}` });
  const hopper = svg("rect", { class: "card", x: -7, y: -5, width: 14, height: 10, rx: 2 });
  return [
    ...stairs,
    hop(58, base - 42, 160, base - 72), tip(160, base - 72, 80),
    hop(160, base - 72, 262, base - 102), tip(262, base - 102, 80),
    svg("path", { class: "arrow-line dashed", d: `M262 ${base + 4} L262 162 L58 162 L58 ${base + 4}` }), tip(58, base + 4, -90),
    label("Missed: back to Box 1", 160, 156, { size: "small" }),
    ...traveller(hopper, `M58 ${base - 46} Q110 ${base - 110} 160 ${base - 76} Q212 ${base - 140} 262 ${base - 106}`, 5),
  ];
}

// Step 5: a few minutes every day

function dailyScene() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return [
    label("About 5–10 minutes each day", 160, 14),
    ...days.map((day, index) => {
      const x = 12 + index * 43;
      const today = index === 2;
      return animated(svg("g", {}, [
        card(x, 30, 38, 66, "", today ? "soft" : "plain"),
        label(day, x + 19, 44),
        bell(x + 19, 66),
        ...(today ? [label("today", x + 19, 90, { size: "tiny", tone: "accent" })] : []),
      ]), "pop", index * 0.12);
    }),
    drawn({ class: "arrow-line", d: "M31 112 L31 118 Q31 124 38 124 H282 Q289 124 289 118 L289 112" }, 1.2),
    label("Review what is due. Add about 10 new cards a day.", 160, 142, { size: "small" }),
    label("Behind? Do the due cards first and pause new ones.", 160, 158, { size: "small", tone: "accent" }),
  ];
}

export const SPACED_REPETITION_SCENES = {
  "sr-gather": { draw: gatherScene, caption: "Keep cards for things you must recall exactly. Things that need understanding belong to another method." },
  "sr-card": { draw: cardScene, caption: "One question on the front, one short answer on the back. If an answer is long, split the card." },
  "sr-sort": { draw: sortScene, caption: "Say the answer before you flip. Anything short of a clean answer goes in the missed pile." },
  "sr-boxes": { draw: boxesScene, caption: "A right answer moves a card up a box, so you see it less often. A miss sends it back to Box 1." },
  "sr-daily": { draw: dailyScene, caption: "A short review every day beats a long one now and then." },
};
