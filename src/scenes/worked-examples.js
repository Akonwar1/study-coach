// Worked Examples: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, bubble, card, cross, drawn, label, pill, svg, tick, tip, traveller } from "../scene-kit.js";

// Step 1: solved examples to learn from, two problems held back

function collectScene() {
  const problems = Array.from({ length: 6 }, (_, index) => index);
  return [
    label("One type of problem", 160, 14),
    ...problems.map((index) => {
      const held = index >= 4;
      const x = 10 + index * 50 + (held ? 12 : 0);
      return animated(svg("g", { opacity: held ? 0.9 : 1 }, [
        card(x, 28, 44, 62, "", held ? "dashed" : "soft"),
        svg("rect", { class: "bar head", x: x + 7, y: 38, width: 30, height: 4.5, rx: 2.2 }),
        ...(held
          ? [svg("rect", { class: "cover-sheet", x: x + 5, y: 52, width: 34, height: 30, rx: 3 })]
          : [svg("rect", { class: "bar pen2", x: x + 7, y: 52, width: 30, height: 4, rx: 2 }), svg("rect", { class: "bar pen2", x: x + 7, y: 62, width: 22, height: 4, rx: 2 }), tick(x + 22, 80, 6)]),
      ]), "pop", index * 0.15);
    }),
    svg("path", { class: "bracket", d: "M10 100 V108 H198 V100" }),
    label("with full solutions: learn from these", 104, 124, { size: "small" }),
    svg("path", { class: "bracket", d: "M222 100 V108 H306 V100", opacity: 0.6 }),
    label("practice:", 264, 124, { size: "small", tone: "accent" }), label("solutions hidden", 264, 138, { size: "small" }),
  ];
}

// Step 2: following one solution, one step at a time

function studyScene() {
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const pointer = svg("circle", { class: "dot solid", r: 6 });
  return [
    ...steps.map((text, index) => animated(pill(100, 20 + index * 38, 110, text, "soft", 26), "pop", index * 0.3)),
    ...[0, 1, 2].map((index) => svg("g", {}, [arrow(100, 33 + index * 38, 100, 45 + index * 38), label("because", 130, 39 + index * 38, { anchor: "start", size: "tiny" })])),
    ...traveller(pointer, "M44 20 L44 134 L44 20", 8),
    animated(bubble(184, 38, 128, 70, [label("Why this step,", 248, 62, { size: "small" }), label("and why now?", 248, 80, { size: "small", tone: "accent" })], { tail: "left" }), "pop", 1),
    label("Follow it. No need to write out", 248, 134, { size: "small" }), label("an explanation for every step.", 248, 148, { size: "small" }),
  ];
}

// Step 3: the same method on a twin problem

function twinScene() {
  const rows = [0, 1, 2];
  const side = (x, title, accentChip, delay) => [
    label(title, x + 60, 14),
    ...rows.map((index) => animated(svg("g", {}, [
      card(x, 26 + index * 40, 120, 32, "", index === 1 ? "soft" : "plain"),
      svg("rect", { class: "bar ink", x: x + 10, y: 38 + index * 40, width: 70, height: 4, rx: 2 }),
      pill(x + 98, 42 + index * 40, 28, accentChip[index], "solid", 16),
    ]), "pop", delay + index * 0.3)),
  ];
  return [
    ...side(10, "Solved example", ["3", "5", "8"], 0),
    ...side(190, "Your problem", ["4", "7", "11"], 1),
    ...rows.map((index) => arrow(134, 42 + index * 40, 186, 42 + index * 40)),
    label("Look back at the example whenever you’re stuck.", 160, 156, { size: "small", tone: "accent" }),
  ];
}

// Step 4: the first wrong step

function fixScene() {
  const boxes = [["1", "good"], ["2", "good"], ["3", "soft"], ["4", "dashed"], ["5", "dashed"]];
  return [
    ...boxes.map(([text, kind], index) => animated(svg("g", {}, [card(10 + index * 62, 36, 50, 40, text, kind), ...(index < 2 ? [tick(35 + index * 62, 94, 7)] : [])]), "pop", index * 0.25)),
    ...[0, 1, 2, 3].map((index) => arrow(60 + index * 62, 56, 70 + index * 62, 56)),
    animated(svg("g", {}, [svg("circle", { class: "ring", cx: 165, cy: 56, r: 32 }), cross(165, 106, 8)]), "pulse", 1.2),
    label("first wrong step", 165, 128, { tone: "accent" }),
    label("Say what went wrong, then redo from here.", 160, 156, { size: "small" }),
  ];
}

// Step 5: a little less help each time

function fadeScene() {
  const columns = [["Example 1", 4], ["Example 2", 3], ["Example 3", 2], ["Example 4", 1], ["Practice", 0]];
  return [
    ...columns.map(([name, filled], column) => animated(svg("g", {}, [
      label(name, 36 + column * 62, 14, { size: "small" }),
      ...[0, 1, 2, 3].map((row) => svg("rect", { class: row < filled ? "scene-bar" : "bar-empty", x: 12 + column * 62, y: 26 + row * 24, width: 48, height: 20, rx: 4 })),
    ]), "pop", column * 0.3)),
    drawn({ class: "arrow-line second", d: "M12 128 H292" }, 1.2), tip(298, 128, 0),
    label("less help", 160, 142, { tone: "accent" }),
    label("Can’t finish? Go back one level.", 160, 160, { size: "small" }),
  ];
}

// Step 6: when to stop using examples

function nextScene() {
  return [
    animated(pill(160, 18, 270, "Solve a new problem, no example in view?", "solid", 28), "pop", 0),
    svg("path", { class: "link-line", d: "M160 32 V46 M80 46 H240 M80 46 V58 M240 46 V58" }),
    label("yes", 110, 52, { size: "small", tone: "accent" }), label("not yet", 212, 52, { size: "small" }),
    animated(card(8, 62, 148, 70, "", "good"), "pop", 0.5), tick(28, 98, 9),
    label("Stop using examples", 44, 88, { size: "small", anchor: "start" }), label("Mixed practice next", 44, 106, { size: "small", tone: "accent", anchor: "start" }),
    animated(card(170, 62, 140, 70, "", "dashed"), "pop", 0.9),
    svg("path", { class: "arrow-line", d: "M240 132 V152 H180 V132" }), tip(180, 134, -90),
    label("Repeat from step 2", 240, 92, { size: "small" }), label("with a new example", 240, 108, { size: "small" }),
  ];
}

export const WORKED_EXAMPLES_SCENES = {
  "we-collect": { draw: collectScene, caption: "Gather solved problems of one type, and set two aside as practice with the solutions hidden." },
  "we-study": { draw: studyScene, caption: "Read one solution through, then follow each step and see why it follows from the one before." },
  "we-twin": { draw: twinScene, caption: "Solve a problem of the same type with different numbers, looking back at the example whenever you need." },
  "we-fix": { draw: fixScene, caption: "Find the first step where you went wrong, say what happened, and redo from there." },
  "we-fade": { draw: fadeScene, caption: "Cover more of each new example until you finish a practice problem with no help." },
  "we-next": { draw: nextScene, caption: "Once you can solve a new problem with no example in view, move on to mixed practice." },
};
