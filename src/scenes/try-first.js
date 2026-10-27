// Try First (pretesting): one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, bell, card, cross, drawn, flag, label, sheet, svg, tick, traveller } from "../scene-kit.js";

// Step 1: skimming the landmarks, not reading

function skimScene() {
  const stone = svg("circle", { class: "dot solid", r: 5 });
  return [
    svg("rect", { class: "sheet", x: 10, y: 8, width: 150, height: 154, rx: 3 }),
    svg("rect", { class: "bar head", x: 22, y: 20, width: 80, height: 6, rx: 3 }),
    ...[34, 46, 58].map((y) => svg("rect", { class: "bar ink", x: 22, y, width: 120, height: 3.5, rx: 1.75, opacity: 0.3 })),
    svg("rect", { class: "figure-box", x: 22, y: 70, width: 60, height: 30, rx: 3 }),
    svg("rect", { class: "bar key", x: 92, y: 80, width: 40, height: 5, rx: 2.5 }),
    ...[110, 122, 134].map((y) => svg("rect", { class: "bar ink", x: 22, y, width: 120, height: 3.5, rx: 1.75, opacity: 0.3 })),
    svg("rect", { class: "bar head", x: 22, y: 144, width: 70, height: 6, rx: 3 }),
    drawn({ class: "arrow-line second", d: "M60 23 Q22 50 52 85 Q86 62 112 82 Q96 120 56 147" }, 0.3),
    ...[[60, 23], [52, 85], [112, 82], [56, 147]].map(([x, y], index) => animated(svg("circle", { class: "dot solid", cx: x, cy: y, r: 4.5 }), "pop", 0.4 + index * 0.4)),
    ...traveller(stone, "M60 23 Q22 50 52 85 Q86 62 112 82 Q96 120 56 147", 5),
    ...[["headings", 30], ["bold terms", 66], ["figures", 102]].map(([text, y], index) => animated(svg("g", {}, [tick(184, y, 7), label(text, 200, y, { anchor: "start" })]), "pop", 0.6 + index * 0.4)),
    animated(svg("g", {}, [cross(184, 138, 7), label("paragraphs:", 200, 134, { anchor: "start", size: "small" }), label("not yet", 200, 148, { anchor: "start", size: "small" })]), "pop", 1.8),
  ];
}

// Step 2: six to ten specific questions

function questionsScene() {
  const asks = ["What…?", "Which…?", "How many…?", "Why…?", "What…?", "How…?"];
  return [
    sheet(10, 24, 66, 112, [[0.8, "head"], [1], [0.9], [1], [0.8], [1], [0.7], [0.9]]),
    arrow(82, 80, 112, 80),
    ...asks.map((text, index) => animated(svg("g", {}, [
      card(116, 6 + index * 24, 196, 21, "", "plain"),
      svg("circle", { class: "dot solid", cx: 129, cy: 16.5 + index * 24, r: 7 }), label(String(index + 1), 129, 16.5 + index * 24, { size: "tiny", tone: "on-solid" }),
      label(text, 144, 16.5 + index * 24, { anchor: "start", size: "small" }),
      svg("line", { class: "gap-line", x1: 218, y1: 21 + index * 24, x2: 302, y2: 21 + index * 24 }),
    ]), "pop", 0.3 + index * 0.2)),
    label("Specific questions on everything you care about.", 160, 164, { size: "small" }),
  ];
}

// Step 3: a guess at every question, even a wild one

function guessScene() {
  const rings = [58, 44, 30, 16];
  const darts = [[66, 62, 0.2], [112, 96, 0.7], [84, 112, 1.2]];
  return [
    ...rings.map((r, index) => svg("circle", { class: `target t${index}`, cx: 90, cy: 86, r })),
    ...darts.map(([x, y, delay]) => animated(svg("g", {}, [svg("circle", { class: "dot solid", cx: x, cy: y, r: 4 }), svg("line", { class: "pen", x1: x, y1: y, x2: x - 14, y2: y - 12 })]), "pop", delay)),
    label("A wrong guess still helps", 90, 160, { size: "small" }),
    ...[0, 1, 2].map((index) => animated(svg("g", {}, [
      card(176, 14 + index * 40, 136, 32, "", "plain"),
      svg("rect", { class: "bar ink", x: 186, y: 22 + index * 40, width: 70, height: 4, rx: 2 }),
      svg("rect", { class: "bar pen2", x: 186, y: 34 + index * 40, width: 100 - index * 14, height: 4, rx: 2 }),
    ]), "pop", 0.4 + index * 0.4)),
    svg("g", { opacity: 0.45 }, [svg("rect", { class: "cover", x: 190, y: 138, width: 30, height: 20, rx: 2 })]), cross(205, 148, 9),
    label("no looking it up", 232, 148, { anchor: "start", size: "small" }),
  ];
}

// Step 4: reading with your questions in hand

function studyScene() {
  const flags = [[170, 56, 1], [250, 80, 2], [196, 112, 3], [278, 136, 4]];
  const marker = svg("rect", { class: "scan", x: 128, y: 0, width: 184, height: 10, rx: 3 });
  return [
    ...[1, 2, 3, 4].map((number, index) => animated(svg("g", {}, [
      svg("circle", { class: "dot solid", cx: 22, cy: 28 + index * 38, r: 10 }), label(String(number), 22, 28 + index * 38, { tone: "on-solid", size: "small" }),
      label("?", 44, 28 + index * 38, { size: "big", tone: "accent" }),
    ]), "pop", index * 0.2)),
    svg("rect", { class: "sheet", x: 128, y: 8, width: 184, height: 154, rx: 3 }),
    ...Array.from({ length: 11 }, (_, row) => svg("rect", { class: "bar ink", x: 140, y: 20 + row * 13, width: 150 - (row % 3) * 22, height: 3.5, rx: 1.75, opacity: 0.45 })),
    ...traveller(marker, "M0 4 L0 144 L0 4", 7),
    ...flags.map(([x, y, number], index) => animated(flag(x, y + 14), "pop", 0.8 + index * 0.6)),
    ...flags.map(([x, y, number], index) => animated(tick(66, 28 + index * 38 + 0, 8), "pop", 0.9 + index * 0.6)),
    label("Flag where each answer is.", 66, 164, { size: "small" }),
  ];
}

// Step 5: marking the guesses

function checkScene() {
  const results = [true, false, true, false, false];
  return [
    card(10, 8, 300, 110, "", "plain"),
    ...results.map((right, index) => {
      const y = 26 + index * 19;
      return animated(svg("g", {}, [
        svg("circle", { class: "dot soft", cx: 30, cy: y, r: 8 }), label(String(index + 1), 30, y, { size: "tiny" }),
        svg("rect", { class: "bar ink", x: 48, y: y - 2, width: 110, height: 4, rx: 2 }),
        right ? tick(184, y, 7) : cross(184, y, 6),
        ...(right ? [] : [svg("rect", { class: "bar pen2", x: 206, y: y - 2, width: 60, height: 4, rx: 2 }), label("say it", 300, y, { anchor: "end", size: "tiny" })]),
      ]), "pop", index * 0.25);
    }),
    animated(svg("g", {}, [svg("circle", { class: "ring", cx: 24, cy: 134, r: 9 }), label("?", 24, 134, { size: "small" }), label("never answered: find another source", 42, 134, { anchor: "start", size: "small", tone: "accent" })]), "pop", 1.6),
    label("Say each right answer out loud.", 160, 160, { size: "small" }),
  ];
}

// Step 6: which ideas still have no question

function coverScene() {
  const tiles = Array.from({ length: 15 }, (_, index) => ({ x: 10 + (index % 5) * 42, y: 14 + Math.floor(index / 5) * 40, lit: ![3, 8, 12].includes(index) }));
  return [
    ...tiles.map(({ x, y, lit }, index) => animated(svg("g", {}, [
      svg("rect", { class: lit ? "card" : "card dashed", x, y, width: 38, height: 32, rx: 5 }),
      ...(lit ? [] : [svg("circle", { class: "dot solid", cx: x + 19, cy: y + 16, r: 8 }), svg("path", { class: "mark-plus", d: `M${x + 19} ${y + 11} V${y + 21} M${x + 14} ${y + 16} H${x + 24}` })]),
    ]), "pop", index * 0.05)),
    label("lit: has a question", 105, 140, { size: "small" }), label("+: add one", 105, 155, { size: "small", tone: "accent" }),
    arrow(226, 74, 242, 74),
    animated(svg("g", {}, [card(244, 20, 68, 108, "", "soft"), label("Tomorrow", 278, 44, { size: "small" }), label("no notes", 278, 112, { size: "small", tone: "accent" })]), "pop", 1.2),
    bell(278, 76),
  ];
}

export const TRY_FIRST_SCENES = {
  "tf-skim": { draw: skimScene, caption: "Skim the headings, bold terms and figures. Don’t read the paragraphs yet." },
  "tf-questions": { draw: questionsScene, caption: "Write 6 to 10 specific questions about what you skimmed, covering everything you care about." },
  "tf-guess": { draw: guessScene, caption: "Write a guess next to every question, even if you have no idea, and don’t look anything up." },
  "tf-study": { draw: studyScene, caption: "Read the section hunting for your answers. Tick each question as you find its answer." },
  "tf-check": { draw: checkScene, caption: "Mark each guess right or wrong, say the right answer out loud, and note unanswered questions." },
  "tf-cover": { draw: coverScene, caption: "Add a question for every important idea that has none, then test yourself on it tomorrow without notes." },
};
