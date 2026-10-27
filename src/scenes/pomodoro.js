// Pomodoro Technique: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, card, cross, gauge, label, person, phone, pill, sheet, svg, tick, traveller } from "../scene-kit.js";

// Step 1: one small task, and a clear desk

function taskScene() {
  const checks = [["Phone away", 44], ["Tabs closed", 82], ["Water filled", 120]];
  return [
    animated(svg("circle", { class: "blob", cx: 72, cy: 38, r: 30 }), "pop", 0),
    label("Study", 72, 38, { size: "small" }),
    arrow(72, 72, 72, 94),
    animated(card(14, 98, 116, 40, "Problems 1–5", "solid"), "pop", 0.5),
    label("small enough to start now", 72, 156, { size: "small" }),
    card(158, 12, 152, 146, "", "plain"),
    ...checks.map(([text, y], index) => animated(svg("g", {}, [tick(180, y, 8), label(text, 198, y, { anchor: "start" })]), "pop", 0.8 + index * 0.4)),
    label("Clear the area first.", 234, 146, { size: "small", tone: "accent" }),
  ];
}

// Step 2: 25 minutes on one task. The ring fills as the step's timer runs.

function focusScene() {
  const ring = gauge(100, 82, 56, 0, "accent");
  const thought = svg("g", {}, [pill(0, 0, 62, "email?", "dashed", 20)]);
  return {
    parts: [
      ...ring.parts,
      label("25", 100, 74, { size: "big", tone: "ink" }),
      label("minutes", 100, 98, { size: "small" }),
      label("fills as you work", 100, 156, { size: "small" }),
      sheet(200, 38, 108, 96, [[0.7, "head"], [1, "gap"], [0.8, "gap"]]),
      label("Park it here", 254, 26),
      ...traveller(thought, "M196 8 L254 70", 5),
      label("Then straight back", 254, 150, { size: "small", tone: "accent" }),
      label("to the task", 254, 164, { size: "small", tone: "accent" }),
    ],
    update: ring.update,
  };
}

// Step 3: five minutes to rest your attention

function breakScene() {
  const ring = gauge(52, 70, 34, 0, "good", { thin: true });
  const icon = (x, name, draw) => animated(svg("g", {}, [card(x, 24, 50, 80, "", "plain"), ...draw(x + 25), label(name, x + 25, 120, { size: "small" })]), "pop", 0.2 + x / 300);
  return {
    parts: [
      ...ring.parts,
      label("5", 52, 66, { size: "big", tone: "ink" }), label("min", 52, 86, { size: "small" }),
      icon(100, "Stand up", (cx) => [person(cx - 14, 40, 0.8)]),
      icon(156, "Drink", (cx) => [svg("path", { class: "glass", d: `M${cx - 9} 44 H${cx + 9} L${cx + 6} 84 H${cx - 6} Z` })]),
      icon(212, "Look far", (cx) => [svg("rect", { class: "window", x: cx - 14, y: 44, width: 28, height: 34, rx: 3 }), svg("path", { class: "link-line", d: `M${cx} 44 V78 M${cx - 14} 61 H${cx + 14}` })]),
      icon(268, "No phone", (cx) => [svg("g", {}, [svg("rect", { class: "device", x: cx - 7, y: 46, width: 14, height: 28, rx: 3 }), cross(cx, 60, 12)])]),
      label("Scrolling feels like rest but doesn’t rest your attention.", 160, 154, { size: "small", tone: "accent" }),
    ],
    update: ring.update,
  };
}

// Step 4: what got done, and the next round

function checkInScene() {
  const rounds = [0, 1, 2, 3];
  return [
    sheet(10, 12, 140, 64, [[0.6, "head"], [0.9, "pen2"], [0.7, "pen2"]]),
    label("Got done", 80, 90, { size: "small" }),
    sheet(170, 12, 140, 64, [[0.6, "head"], [0.8, "gap"], [0.5, "gap"]]),
    label("Next round", 240, 90, { size: "small" }),
    ...rounds.map((index) => animated(svg("g", {}, [svg("circle", { class: index < 3 ? "dot solid" : "dot soft", cx: 36 + index * 50, cy: 130, r: 16 }), index < 3 ? tick(36 + index * 50, 130, 7) : label("4", 36 + index * 50, 130, { tone: "accent" })]), "pop", 0.4 + index * 0.4)),
    arrow(206, 130, 226, 130),
    animated(card(230, 108, 80, 44, "long break", "soft", "small"), "pop", 2),
    label("15–30 min after four rounds", 312, 164, { size: "small", anchor: "end" }),
  ];
}

export const POMODORO_SCENES = {
  "pm-task": { draw: taskScene, caption: "Choose one task small enough to start right now, and clear the area before the timer starts." },
  "pm-focus": { draw: focusScene, caption: "Work on the one task. Park any stray thought on a scrap of paper and go straight back." },
  "pm-break": { draw: breakScene, caption: "Step away from the screen and rest your attention: stand, drink, look out a window." },
  "pm-checkin": { draw: checkInScene, caption: "Note what you got done and decide the next round. After four rounds, take a longer break." },
};
