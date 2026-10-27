// Problem First (productive failure): one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, card, cross, drawn, flag, label, pill, place, shutBook, svg, tick } from "../scene-kit.js";

const WALL = { x: 196, y: 14, width: 14, height: 142 };

function maze(extra = []) {
  return [
    svg("rect", { class: "wall", ...WALL, rx: 3 }),
    svg("circle", { class: "dot solid", cx: 22, cy: 85, r: 7 }),
    label("you", 22, 106, { size: "small" }),
    animated(flag(284, 100), "pop", 0.2),
    label("the answer", 284, 120, { size: "small" }),
    ...extra,
  ];
}

// Step 1: a problem you haven't been taught how to solve

function pickScene() {
  return [
    animated(card(44, 20, 126, 100, "?", "plain", "big"), "pop", 0),
    animated(arrow(6, 36, 40, 56), "pop", 0.4), animated(arrow(6, 104, 40, 84), "pop", 0.6),
    label("more than one way in", 100, 134, { size: "small" }),
    svg("g", { opacity: 0.45 }, [place(204, 40, 1.9, [shutBook(0, 0)])]),
    cross(234, 62, 14),
    label("The lesson: not yet", 234, 120, { size: "small" }),
    label("A problem on something you haven’t been taught.", 160, 158, { size: "small", tone: "accent" }),
  ];
}

// Step 2: three attempts, three dead ends

function attemptScene() {
  const attempts = [
    ["M29 85 H92 V48 H160", [160, 48]],
    ["M29 85 H118 V124 H168", [168, 124]],
    ["M29 85 H62 V28 H128 V70", [128, 70]],
  ];
  return [
    ...maze(),
    ...attempts.map(([d], index) => drawn({ class: `attempt a${index}`, d }, 0.4 + index * 1)),
    ...attempts.map(([, [x, y]], index) => animated(cross(x, y, 7), "pop", 1.3 + index * 1)),
    label("Try at least two approaches. Dead ends are expected.", 160, 160, { size: "small" }),
  ];
}

// Step 3: notes on what each attempt missed

function missedScene() {
  const notes = ["couldn’t handle…", "didn’t explain…", "wish I knew…"];
  return [
    ...notes.map((text, index) => animated(svg("g", {}, [
      pill(46, 28 + index * 46, 76, `Attempt ${index + 1}`, "soft", 24),
      arrow(88, 28 + index * 46, 128, 28 + index * 46),
      card(132, 14 + index * 46, 74, 30, text, "plain", "small"),
    ]), "pop", index * 0.5)),
    svg("path", { class: "jar", d: "M242 24 H306 V44 Q312 54 312 70 V116 Q312 132 296 132 H252 Q236 132 236 116 V70 Q236 54 242 44 Z" }),
    ...[0, 1, 2].map((index) => animated(svg("rect", { class: "card", x: 250 + index * 6, y: 100 - index * 18, width: 42, height: 20, rx: 3, transform: `rotate(${index * 6 - 6} ${271 + index * 6} ${110 - index * 18})` }), "pop", 1.6 + index * 0.4)),
    arrow(208, 78, 232, 78),
    label("Questions the", 274, 148, { size: "small", tone: "accent" }), label("lesson answers", 274, 162, { size: "small", tone: "accent" }),
  ];
}

// Step 4: the proper method finds the way through

function learnScene() {
  return [
    ...maze(),
    ...["M29 85 H92 V48 H160", "M29 85 H118 V124 H168", "M29 85 H62 V28 H128 V70"].map((d) => svg("path", { class: "attempt faint", d })),
    animated(svg("rect", { class: "door", x: WALL.x, y: 70, width: WALL.width, height: 30, rx: 3 }), "pulse", 0.6),
    drawn({ class: "route", d: "M29 85 H280" }, 0.5),
    label("What does the method do that my attempts didn’t?", 160, 150, { size: "small", tone: "accent" }),
  ];
}

// Step 5: each attempt against the proper method

function compareScene() {
  const relations = ["partly right", "missing a piece", "a different idea"];
  return [
    ...relations.map((text, index) => animated(svg("g", {}, [
      card(8, 12 + index * 50, 92, 36, `Attempt ${index + 1}`, "plain"),
      arrow(104, 30 + index * 50, 196, 80),
      pill(150, 28 + index * 50 + (index === 0 ? 4 : index === 2 ? -4 : 0), 100, text, "soft", 18),
    ]), "pop", index * 0.5)),
    animated(card(200, 52, 112, 56, "Proper method", "solid"), "pop", 0),
    label("Why did each fall short?", 160, 166, { size: "small", tone: "accent" }),
  ];
}

// Step 6: using the method, on purpose

function practiseScene() {
  const stones = [["Original", 52], ["Another", 130], ["One more", 208]];
  return [
    ...[0, 1, 2, 3].map((index) => svg("path", { class: "wave", d: `M${10 + index * 78} 140 q10 -8 20 0 t20 0 t20 0` })),
    ...stones.map(([text, x], index) => animated(svg("g", {}, [svg("circle", { class: "stone", cx: x, cy: 96, r: 30 }), label(text, x, 90, { size: "small" }), tick(x, 112, 7)]), "pop", index * 0.5)),
    ...[0, 1].map((index) => arrow(stones[index][1] + 32, 96, stones[index + 1][1] - 32, 96)),
    arrow(240, 96, 262, 96),
    animated(svg("g", {}, [flag(290, 100), label("Why it works", 290, 120, { size: "small", tone: "accent" })]), "pop", 1.8),
    label("Procedures need deliberate practice.", 160, 24, { size: "small" }),
  ];
}

export const PROBLEM_FIRST_SCENES = {
  "pf-pick": { draw: pickScene, caption: "Choose a problem on an idea you haven’t been taught yet, with room for more than one approach." },
  "pf-attempt": { draw: attemptScene, caption: "Try at least two different approaches and write each one down, even the ones you suspect are wrong." },
  "pf-missed": { draw: missedScene, caption: "For each attempt, note what it couldn’t handle and what you wish you knew. These are the lesson’s questions." },
  "pf-learn": { draw: learnScene, caption: "Read the lesson looking for where the proper method does what your attempts couldn’t." },
  "pf-compare": { draw: compareScene, caption: "Go back to each attempt and say why it fell short or how it differs from the method." },
  "pf-practise": { draw: practiseScene, caption: "Redo the original problem with the method, then two more. Aim to say what the method is for." },
};
