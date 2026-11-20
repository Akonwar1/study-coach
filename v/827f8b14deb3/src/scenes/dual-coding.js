// Dual Coding: one wide picture per step. See scene-kit.js for the shapes.

import { PAGE_ROWS, animated, arrow, bubble, card, cross, drawn, label, person, pill, place, sheet, svg, tip, traveller } from "../scene-kit.js";

// Step 1: the shape of the material decides what you draw

function shapeScene() {
  const shapes = [
    { name: "Steps", drawing: "flowchart", icon: (cx) => [
      ...[-26, -7, 12].map((dx) => svg("rect", { class: "node-box", x: cx + dx, y: 60, width: 14, height: 14, rx: 3 })),
      svg("path", { class: "link-line", d: `M${cx - 12} 67 H${cx - 7} M${cx + 7} 67 H${cx + 12}` }),
    ] },
    { name: "In time", drawing: "timeline", icon: (cx) => [
      svg("path", { class: "link-line", d: `M${cx - 24} 67 H${cx + 24}` }),
      ...[-20, -7, 7, 20].map((dx) => svg("circle", { class: "dot solid", cx: cx + dx, cy: 67, r: 3.5 })),
    ] },
    { name: "Parts", drawing: "diagram", icon: (cx) => [
      svg("circle", { class: "dot soft", cx, cy: 67, r: 8 }),
      svg("path", { class: "link-line", d: `M${cx - 7} 61 L${cx - 22} 52 M${cx + 7} 61 L${cx + 22} 52 M${cx} 75 L${cx} 86` }),
    ] },
    { name: "Compare", drawing: "table", icon: (cx) => [
      svg("rect", { class: "node-box", x: cx - 22, y: 54, width: 44, height: 26, rx: 3 }),
      svg("path", { class: "link-line", d: `M${cx - 22} 67 H${cx + 22} M${cx} 54 V80` }),
    ] },
    { name: "Links", drawing: "map", icon: (cx) => [
      svg("path", { class: "link-line", d: `M${cx} 56 L${cx - 16} 78 M${cx} 56 L${cx + 16} 78 M${cx - 16} 78 H${cx + 16}` }),
      ...[[cx, 56], [cx - 16, 78], [cx + 16, 78]].map(([x, y]) => svg("circle", { class: "dot soft", cx: x, cy: y, r: 5 })),
    ] },
  ];
  return [
    ...shapes.map(({ name, drawing, icon }, index) => {
      const x = 6 + index * 63;
      return animated(svg("g", {}, [
        card(x, 14, 58, 110, "", "plain"),
        label(name, x + 29, 30),
        ...icon(x + 29),
        label("draw a", x + 29, 100, { size: "tiny" }),
        label(drawing, x + 29, 112, { size: "small", tone: "accent" }),
      ]), "pop", index * 0.2);
    }),
    label("What shape does your material have?", 160, 146),
    label("Plain facts with no shape? Try Spaced Repetition.", 160, 161, { size: "small" }),
  ];
}

// Step 2: read in words only, collecting items and links

function readScene() {
  const underline = (row, fraction) => svg("rect", { class: "bar pen2", x: 22, y: 8 + 1.6 * (6 + 7 * row) + 7, width: 1.6 * 48 * fraction, height: 2.4, rx: 1.2 });
  const itemAt = (cx, cy, delay) => animated(pill(cx, cy, 56, "item", "soft", 24), "pop", delay);
  return [
    place(14, 8, 1.6, [sheet(0, 0, 58, 66, PAGE_ROWS)]),
    animated(underline(3, 0.35), "pop", 0.6), animated(underline(6, 0.45), "pop", 1),
    label("Words only", 62, 150),
    svg("line", { class: "pen", x1: 124, y1: 54, x2: 134, y2: 22 }), cross(130, 40, 11), label("no drawing yet", 140, 70, { size: "small", anchor: "start" }),
    drawn({ class: "link-line", d: "M196 44 L284 44 M196 44 L240 108 M284 44 L240 108" }, 1.2),
    itemAt(196, 44, 1.2), itemAt(284, 44, 1.5), itemAt(240, 108, 1.8),
    label("leads to", 240, 30, { size: "small", tone: "accent" }),
    label("Items and how they connect", 240, 144, { size: "small" }),
  ];
}

// Step 3: draw from memory, leaving gaps

function redrawScene() {
  const node = (x, y, text, kind = "soft", delay = 0) => animated(card(x, y, 60, 28, text, kind), "pop", delay);
  return [
    svg("rect", { class: "sheet accent", x: 66, y: 6, width: 248, height: 154, rx: 4 }),
    node(84, 28, "A", "soft", 0), node(160, 28, "B", "soft", 0.4), node(236, 28, "C", "soft", 0.8), node(160, 90, "D", "soft", 1.2), node(236, 90, "?", "dashed", 1.6),
    arrow(144, 42, 158, 42), arrow(220, 42, 234, 42), arrow(190, 58, 190, 88), arrow(222, 104, 234, 104, true),
    label("Blank? Leave a gap.", 80, 140, { size: "small", tone: "accent", anchor: "start" }),
    label("It shows what to study.", 80, 153, { size: "small", anchor: "start" }),
    place(10, 74, 1.3, [svg("rect", { class: "cover", x: 0, y: 0, width: 28, height: 20, rx: 2 }), svg("line", { class: "spine", x1: 5, y1: 0, x2: 5, y2: 20 })]),
    cross(28, 100, 7), label("source", 28, 126, { size: "small" }), label("closed", 28, 139, { size: "small" }),
  ];
}

// Step 4: labelling every part, and every arrow, in your own words

function labelScene() {
  const part = (cx, cy) => card(cx - 26, cy - 13, 52, 26, "part", "soft");
  const tag = (cx, cy, text, width, kind = "soft") => animated(pill(cx, cy, width, text, kind, 20), "pop", 0.4 + cx / 400);
  return [
    part(160, 26), part(258, 76), part(160, 126), part(62, 76),
    arrow(186, 34, 232, 62), arrow(244, 90, 190, 118), arrow(134, 118, 78, 90), arrow(72, 62, 130, 34),
    tag(250, 36, "causes", 58), tag(250, 116, "leads to", 66), tag(72, 116, "is made of", 78), tag(70, 36, "?", 28, "dashed"),
    label("Name every arrow too. Put a “?” where you can’t label something.", 160, 158, { size: "small" }),
  ];
}

// Step 5: spotting where your picture differs

function compareScene() {
  const row = (y, name, reversed = false) => {
    const boxes = [12, 92, 172, 252].map((x, index) => card(x, y, 56, 28, "ABCD"[index], "soft"));
    return [
      label(name, 12, y - 10, { anchor: "start", size: "small" }),
      ...boxes,
      arrow(68, y + 14, 90, y + 14),
      reversed ? arrow(170, y + 14, 150, y + 14) : arrow(148, y + 14, 170, y + 14),
      arrow(228, y + 14, 250, y + 14),
    ];
  };
  return [
    ...row(26, "Your picture", true),
    ...row(106, "The source"),
    animated(svg("ellipse", { class: "ring", cx: 160, cy: 40, rx: 20, ry: 14 }), "pulse"),
    svg("path", { class: "arrow-line second", d: "M146 62 Q160 74 174 62" }), tip(174, 62, -60),
    label("The arrow points the other way.", 160, 84, { size: "small", tone: "accent" }),
    label("Structure mistakes matter most.", 160, 156, { size: "small" }),
  ];
}

// Step 6: explaining out loud from the sketch alone

function explainScene() {
  const dot = svg("circle", { class: "dot solid", r: 6 });
  return [
    svg("rect", { class: "sheet accent", x: 8, y: 20, width: 176, height: 110, rx: 4 }),
    card(18, 62, 44, 26, "A", "soft"), card(76, 62, 44, 26, "B", "soft"), card(134, 62, 44, 26, "C", "soft"),
    arrow(62, 75, 74, 75), arrow(120, 75, 132, 75),
    ...traveller(dot, "M40 52 L98 52 L156 52 L98 52 L40 52", 7),
    label("Only the sketch", 96, 146, { size: "small" }),
    bubble(196, 8, 118, 56, [label("first…", 255, 24, { size: "small" }), label("then…", 255, 38, { size: "small" }), label("so…", 255, 52, { size: "small" })], { tail: "left" }),
    person(246, 76, 1.1),
    label("Out loud, start to finish", 262, 146, { size: "small" }),
    label("Stuck? That is a gap.", 262, 160, { size: "small", tone: "accent" }),
  ];
}

export const DUAL_CODING_SCENES = {
  "dc-shape": { draw: shapeScene, caption: "Steps, a sequence, parts, a comparison or linked ideas each call for a different picture." },
  "dc-read": { draw: readScene, caption: "Read in words only. Pick out the items and how they connect, and keep the pen down." },
  "dc-redraw": { draw: redrawScene, caption: "Close the source and draw the structure from memory. Leave blanks empty." },
  "dc-label": { draw: labelScene, caption: "Label every part and arrow in your own words. Mark the ones you can’t label with a question mark." },
  "dc-compare": { draw: compareScene, caption: "Check your picture against the source, in a second colour, starting with the structure." },
  "dc-explain": { draw: explainScene, caption: "Use only the sketch to explain the whole topic out loud. Where it fails you, review." },
};
