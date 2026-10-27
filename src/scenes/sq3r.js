// SQ3R: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, bubble, card, cross, label, person, pill, sheet, svg, tick, traveller } from "../scene-kit.js";

// Step 1: a chapter sized to what you can finish

function chooseScene() {
  const sections = 8;
  const width = 36;
  return [
    label("The whole chapter", 160, 14),
    ...Array.from({ length: sections }, (_, index) => animated(svg("rect", { class: index < 3 ? "card" : "card plain", x: 10 + index * (width + 1.5), y: 28, width, height: 52, rx: 4, opacity: index < 3 ? 1 : 0.45 }), "pop", index * 0.08)),
    svg("path", { class: "bracket", d: "M10 88 V96 H125 V88" }),
    label("now: 5–8 pages at most", 68, 112, { size: "small", tone: "accent" }),
    svg("path", { class: "bracket", d: "M132 88 V96 H306 V88", opacity: 0.5 }),
    label("tomorrow", 219, 112, { size: "small" }),
    sheet(10, 124, 70, 40, [[0.8, "gap"], [0.6, "gap"]]),
    label("blank sheet for your questions", 96, 144, { size: "small", anchor: "start" }),
  ];
}

// Step 2: pins on the map

function surveyScene() {
  const marks = [[24, 24, "head"], [24, 66, "ink"], [86, 86, "key"], [24, 122, "ink"], [86, 136, "head"]];
  const things = ["headings", "captions", "bold terms", "summary", "end questions"];
  return [
    svg("rect", { class: "sheet", x: 10, y: 8, width: 120, height: 152, rx: 3 }),
    ...Array.from({ length: 10 }, (_, row) => svg("rect", { class: "bar ink", x: 20, y: 36 + row * 11, width: 70 - (row % 3) * 10, height: 3.5, rx: 1.75, opacity: 0.5 })),
    ...marks.map(([x, y], index) => animated(svg("g", {}, [svg("circle", { class: "dot solid", cx: x + 4, cy: y, r: 9 }), label(String(index + 1), x + 4, y, { tone: "on-solid", size: "small" })]), "pop", 0.3 + index * 0.35)),
    ...things.map((text, index) => animated(svg("g", {}, [
      svg("circle", { class: "dot soft", cx: 170, cy: 24 + index * 24, r: 9 }), label(String(index + 1), 170, 24 + index * 24, { size: "small" }),
      label(text, 188, 24 + index * 24, { anchor: "start" }),
    ]), "pop", 0.5 + index * 0.35)),
    animated(pill(238, 150, 150, "a map, not details", "solid", 22), "pop", 2.4),
  ];
}

// Step 3: headings become questions

function questionScene() {
  const rows = [["Heading", "What is…?"], ["Heading", "Why does…?"], ["Heading", "How does…?"]];
  return rows.flatMap(([heading, question], index) => {
    const y = 10 + index * 48;
    return [animated(svg("g", {}, [
      card(10, y, 86, 32, heading, "plain"),
      arrow(100, y + 16, 130, y + 16),
      card(134, y - 4, 176, 42, "", "soft"),
      label(question, 222, y + 8),
      svg("line", { class: "gap-line", x1: 148, y1: y + 26, x2: 296, y2: y + 26 }),
    ]), "pop", index * 0.4)];
  }).concat([label("Leave space under each question for the answer.", 160, 165, { size: "small" })]);
}

// Step 4: reading with a question in mind

function readScene() {
  return [
    svg("rect", { class: "sheet", x: 10, y: 8, width: 170, height: 154, rx: 3 }),
    ...Array.from({ length: 10 }, (_, row) => svg("rect", { class: "bar ink", x: 22, y: 20 + row * 13, width: 146 - (row % 3) * 18, height: 3.5, rx: 1.75, opacity: 0.55 })),
    animated(svg("rect", { class: "highlight", x: 18, y: 58, width: 154, height: 30, rx: 4 }), "pulse"),
    svg("line", { class: "stop-line", x1: 10, y1: 98, x2: 180, y2: 98 }),
    pill(94, 98, 84, "stop here", "soft", 18),
    animated(card(202, 14, 108, 44, "What caused X?", "soft", "small"), "pop", 0.3),
    arrow(206, 60, 178, 74),
    label("look only for the answer", 256, 78, { size: "small" }),
    svg("line", { class: "pen", x1: 238, y1: 118, x2: 252, y2: 94 }), cross(246, 106, 11),
    label("no notes or highlighting yet", 256, 140, { size: "small" }),
  ];
}

// Step 5: say the answer, then jot it down

function reciteScene() {
  return [
    svg("g", { opacity: 0.45 }, [svg("rect", { class: "cover", x: 12, y: 112, width: 42, height: 30, rx: 3 }), svg("line", { class: "spine", x1: 20, y1: 112, x2: 20, y2: 142 })]),
    label("book closed", 33, 154, { size: "small" }),
    person(20, 40, 1.3),
    animated(bubble(76, 14, 112, 66, [label("my own words…", 132, 38, { size: "small" }), label("out loud first", 132, 56, { size: "small", tone: "accent" })], { tail: "left" }), "pop", 0.3),
    arrow(192, 56, 214, 56),
    svg("rect", { class: "sheet accent", x: 218, y: 14, width: 94, height: 112, rx: 4 }),
    svg("rect", { class: "bar head", x: 228, y: 26, width: 60, height: 5, rx: 2.5 }),
    ...[0, 1, 2].map((index) => animated(svg("rect", { class: "bar pen2", x: 228, y: 46 + index * 14, width: 70 - index * 12, height: 4.5, rx: 2.2 }), "pop", 1 + index * 0.5)),
    label("then jot a short answer", 265, 142, { size: "small" }),
    label("Can’t say it? Reread only that section.", 160, 166, { size: "small", tone: "accent" }),
  ];
}

// Step 6: read, recite, next section

function repeatScene() {
  const dot = svg("circle", { class: "dot solid", r: 6 });
  const xs = [36, 98, 160, 222, 284];
  return [
    label("One section at a time", 160, 14),
    svg("line", { class: "rail", x1: 14, y1: 40, x2: 306, y2: 40 }),
    ...traveller(dot, "M36 40 L284 40 L36 40", 8),
    ...xs.map((x, index) => animated(svg("g", {}, [
      card(x - 28, 56, 56, 58, "", index === 3 ? "soft" : "plain"),
      label(String(index + 1), x, 68, { tone: "accent" }),
      label("read", x, 85, { size: "tiny" }), label("recite", x, 100, { size: "tiny" }),
    ]), "pop", index * 0.2)),
    ...xs.slice(0, 4).map((x) => arrow(x + 28, 86, x + 34, 86)),
    animated(svg("g", {}, [svg("path", { class: "flag", d: "M222 118 V150 L232 142 L242 150 V118 Z" })]), "pop", 1.4),
    label("Out of time? Bookmark where you stopped.", 160, 164, { size: "small" }),
  ];
}

// Step 7: questions only, answers covered

function reviewScene() {
  const results = ["good", "good", "miss", "good", "hidden"];
  return [
    label("Questions", 74, 12, { size: "small" }), label("Answers", 218, 12, { size: "small" }),
    ...results.map((result, index) => {
      const y = 22 + index * 28;
      return animated(svg("g", {}, [
        svg("rect", { class: "bar head", x: 14, y: y + 8, width: 110 - (index % 2) * 20, height: 5, rx: 2.5 }),
        result === "hidden"
          ? svg("rect", { class: "cover-sheet", x: 160, y, width: 100, height: 22, rx: 4 })
          : svg("rect", { class: "bar pen2", x: 164, y: y + 8, width: 90 - index * 6, height: 5, rx: 2.5 }),
        ...(result === "good" ? [tick(284, y + 11, 7)] : []),
        ...(result === "miss" ? [cross(284, y + 11, 6), svg("path", { class: "flag", d: `M296 ${y + 2} L310 ${y + 8} L296 ${y + 14} Z` })] : []),
      ]), "pop", index * 0.3);
    }),
    label("Cover the answers. Flag the misses for tomorrow.", 160, 166, { size: "small" }),
  ];
}

export const SQ3R_SCENES = {
  "sq-choose": { draw: chooseScene, caption: "Pick a chapter you can finish with attention. For a long one, do the first part now." },
  "sq-survey": { draw: surveyScene, caption: "Skim the headings, captions, bold terms, summary and end questions to build a map before you read." },
  "sq-question": { draw: questionScene, caption: "Turn each heading into a question you would like answered, leaving space for the answer." },
  "sq-read": { draw: readScene, caption: "Read one section looking only for the answer to its question, and stop at its end." },
  "sq-recite": { draw: reciteScene, caption: "Close the book, answer the question in your own words out loud, then jot a short answer." },
  "sq-repeat": { draw: repeatScene, caption: "Read and recite one section at a time. When time is up, note where you stopped." },
  "sq-review": { draw: reviewScene, caption: "Cover your answers and answer every question from memory. Revisit the misses tomorrow." },
};
