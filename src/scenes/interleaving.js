// Interleaving: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, bell, card, label, pill, svg, traveller } from "../scene-kit.js";

// Step 1: topics you tend to confuse

function vennScene() {
  const miniCards = (x, delay) => [0, 1, 2, 3].map((index) => animated(svg("rect", { class: "card", x: x + index * 22, y: 124, width: 18, height: 24, rx: 3 }), "pop", delay + index * 0.12));
  return [
    animated(svg("circle", { class: "venn a", cx: 128, cy: 60, r: 55 }), "pop", 0),
    animated(svg("circle", { class: "venn b", cx: 192, cy: 60, r: 55 }), "pop", 0.3),
    label("Topic A", 98, 60), label("Topic B", 222, 60),
    label("confused", 160, 60, { size: "small", tone: "accent" }),
    ...miniCards(63, 0.8), ...miniCards(173, 1.2),
    label("3–4 practice items for each", 160, 162, { size: "small" }),
  ];
}

// Step 2: two piles zipped into one

function shuffleScene() {
  const pile = (x, kind, delay) => [0, 1, 2, 3].map((index) => animated(svg("rect", { class: `card ${kind}`, x: x + index * 2, y: 30 + index * 14, width: 54, height: 28, rx: 4 }), "pop", delay + index * 0.1));
  const zipped = [0, 1, 2, 3, 4, 5, 6, 7].map((index) => animated(svg("rect", { class: `card ${index % 2 === 0 ? "" : "plain"}`, x: 132 + (index % 2) * 4, y: 18 + index * 14, width: 56, height: 22, rx: 4 }), "pop", 1 + index * 0.15));
  return [
    ...pile(18, "", 0), ...pile(252, "plain", 0.3),
    arrow(80, 78, 126, 78), arrow(246, 78, 194, 78),
    ...zipped,
    label("Topic A", 46, 14, { size: "small" }), label("Topic B", 280, 14, { size: "small" }),
    label("Never more than two of a kind in a row.", 160, 160, { size: "small", tone: "accent" }),
  ];
}

// Step 3: decide the type, then solve

function signpostScene() {
  const board = (x, y, width, text, direction, delay) => {
    const tipX = direction > 0 ? x + width : x;
    const points = direction > 0
      ? `${x},${y} ${x + width - 12},${y} ${tipX},${y + 12} ${x + width - 12},${y + 24} ${x},${y + 24}`
      : `${x + 12},${y} ${x + width},${y} ${x + width},${y + 24} ${x + 12},${y + 24} ${tipX},${y + 12}`;
    return animated(svg("g", {}, [svg("polygon", { class: "board", points }), label(text, x + width / 2 + (direction > 0 ? -4 : 4), y + 12)]), "pop", delay);
  };
  const item = svg("rect", { class: "card", x: -16, y: -11, width: 32, height: 22, rx: 4 });
  return [
    svg("line", { class: "post", x1: 160, y1: 22, x2: 160, y2: 152 }),
    board(168, 30, 96, "Type A", 1, 0.2), board(56, 62, 96, "Type B", -1, 0.5), board(168, 94, 96, "Type C", 1, 0.8),
    ...traveller(item, "M40 140 L130 140", 3.5),
    card(14, 120, 52, 40, "next item", "soft", "small"),
    label("Name the type, say why, then solve.", 200, 160, { size: "small", tone: "accent" }),
  ];
}

// Step 4: two kinds of miss, two fixes

function diagnoseScene() {
  return [
    animated(pill(160, 16, 90, "A miss", "solid", 24), "pop", 0),
    svg("path", { class: "link-line", d: "M160 28 V40 M80 40 H240 M80 40 V52 M240 40 V52" }),
    animated(card(10, 54, 140, 40, "Picked the wrong type", "plain"), "pop", 0.4),
    animated(card(170, 54, 140, 40, "Right type, slipped", "plain"), "pop", 0.7),
    arrow(80, 98, 80, 112), arrow(240, 98, 240, 112),
    animated(card(10, 114, 140, 44, "Compare the topics", "soft"), "pop", 1.1),
    animated(card(170, 114, 140, 44, "Practise its steps", "soft"), "pop", 1.4),
  ];
}

// Step 5: the clue that tells a pair apart

function clueScene() {
  return [
    svg("g", { transform: "rotate(-3 160 104)" }, [
      svg("rect", { class: "plank", x: 30, y: 100, width: 260, height: 8, rx: 4 }),
      card(44, 56, 84, 40, "Topic A", "soft"), card(192, 56, 84, 40, "Topic B", "soft"),
    ]),
    animated(svg("polygon", { class: "fulcrum", points: "160,108 138,146 182,146" }), "pulse"),
    label("clue", 160, 134, { tone: "on-solid", size: "small" }),
    label("One line per pair:", 160, 14, { size: "small" }),
    label("how do you tell them apart?", 160, 30, { tone: "accent" }),
    svg("g", {}, [bell(268, 140)]), label("tomorrow’s warm-up", 224, 160, { size: "small" }),
  ];
}

export const INTERLEAVING_SCENES = {
  "il-venn": { draw: vennScene, caption: "Pick topics you tend to mix up, with 3 or 4 practice items for each." },
  "il-shuffle": { draw: shuffleScene, caption: "Shuffle every item into one pile and keep the order mixed. Don’t sort it back by type." },
  "il-signpost": { draw: signpostScene, caption: "For each item, decide which type it is and why, then solve it." },
  "il-diagnose": { draw: diagnoseScene, caption: "Sort each miss: wrong type or a slip while solving. They have different fixes." },
  "il-clue": { draw: clueScene, caption: "Write one line for each confused pair: the clue that tells them apart. Use it tomorrow as a warm-up." },
};
