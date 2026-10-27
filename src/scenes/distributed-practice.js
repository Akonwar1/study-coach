// Distributed Practice Scheduling: one wide picture per step. See scene-kit.js for the shapes.

import { animated, arrow, card, drawn, label, star, svg, tick, tip } from "../scene-kit.js";

// Step 1: the days between now and the deadline

function deadlineScene() {
  const weeks = [0, 1, 2];
  return [
    svg("line", { class: "rail", x1: 20, y1: 100, x2: 276, y2: 100 }),
    ...[0, 1, 2, 3].map((index) => svg("line", { class: "pen", x1: 20 + index * 85, y1: 92, x2: 20 + index * 85, y2: 108 })),
    ...weeks.flatMap((week) => [0, 1, 2].map((slot) => animated(svg("circle", { class: "dot solid", cx: 34 + week * 85 + slot * 24, cy: 100, r: 5 }), "pop", 0.3 + week * 0.5 + slot * 0.15))),
    svg("path", { class: "bracket", d: "M20 70 V62 H275 V70" }),
    label("example: 3 weeks", 148, 48, { tone: "accent" }),
    animated(svg("g", {}, [svg("line", { class: "pen", x1: 290, y1: 108, x2: 290, y2: 70 }), svg("path", { class: "flag", d: "M290 70 L312 78 L290 86 Z" })]), "pop", 1.8),
    label("Today", 20, 124, { size: "small", anchor: "start" }), label("Deadline", 290, 124, { size: "small" }),
    label("Dots: the sessions you will really keep.", 160, 150, { size: "small" }),
    label("Few days? Spread them out anyway.", 160, 165, { size: "small", tone: "accent" }),
  ];
}

// Step 2: from "chapter 3" to a list of specific items

function listScene() {
  const items = [[0, false], [1, true], [2, false], [3, true], [4, false]];
  return [
    animated(card(8, 56, 88, 50, "Study chapter 3", "dashed", "small"), "pop", 0),
    drawn({ class: "link-line", d: "M96 81 L130 24 M96 81 L130 52 M96 81 L130 81 M96 81 L130 110 M96 81 L130 138" }, 0.4),
    ...items.map(([index, hard]) => animated(svg("g", {}, [
      card(130, 12 + index * 28, 180, 24, "", hard ? "soft" : "plain"),
      svg("rect", { class: "bar ink", x: 142, y: 22 + index * 28, width: 100 - index * 8, height: 4, rx: 2 }),
      ...(hard ? [star(292, 24 + index * 28, 7)] : []),
    ]), "pop", 0.8 + index * 0.2)),
    label("Specific items,", 52, 124, { size: "small" }), label("starred if hard", 52, 138, { size: "small", tone: "accent" }),
  ];
}

// Step 3: topics across every week, hard ones first

function assignScene() {
  const topics = [
    ["A", "hard", [[0, 0], [1, 0], [1, 1]]],
    ["B", "", [[0, 1], [2, 0]]],
    ["C", "", [[1, 2], [2, 1]]],
    ["D", "hard", [[0, 2], [2, 2], [2, 1]]],
  ];
  const left = 40;
  const colWidth = 90;
  return [
    ...["Week 1", "Week 2", "Week 3"].map((text, index) => label(text, left + colWidth / 2 + index * colWidth, 14, { size: "small" })),
    ...[0, 1, 2, 3].map((index) => svg("line", { class: "link-line", x1: left, y1: 26 + index * 32, x2: left + 3 * colWidth, y2: 26 + index * 32, opacity: 0.4 })),
    ...topics.map(([name], row) => label(name, 20, 44 + row * 32)),
    ...topics.flatMap(([, kind, slots], row) => slots.map(([week, slot], index) => animated(
      svg("rect", { class: kind ? "scene-bar hot" : "scene-bar", x: left + 6 + week * colWidth + slot * 26, y: 34 + row * 32, width: 22, height: 20, rx: 4 }), "pop", 0.2 + row * 0.3 + index * 0.1))),
    label("Hard topics (filled) go first and get more sessions.", 160, 164, { size: "small", tone: "accent" }),
  ];
}

// Step 4: reviews a few days and a week after each topic

function reviewScene() {
  const dots = [[30, "session"], [100, "a few days later"], [200, "a week later"]];
  return [
    svg("line", { class: "rail", x1: 14, y1: 96, x2: 306, y2: 96 }),
    drawn({ class: "arrow-line", d: "M30 90 Q65 56 100 90" }, 0.4), tip(100, 90, 60),
    drawn({ class: "arrow-line", d: "M100 90 Q150 30 200 90" }, 1), tip(200, 90, 60),
    ...dots.map(([x, text], index) => animated(svg("g", {}, [svg("circle", { class: index === 0 ? "dot solid" : "dot soft", cx: x, cy: 96, r: 9 }), ...(index === 0 ? [] : [svg("path", { class: "arrow-line", d: `M${x - 4} 93 a4 4 0 1 1 2 5` })]), label(text, x, 124, { size: "small" })]), "pop", index * 0.5)),
    animated(svg("g", {}, [star(290, 96, 13), label("practice test", 290, 124, { size: "small", tone: "accent" })]), "pop", 1.6),
    drawn({ class: "arrow-line dashed", d: "M200 90 Q245 50 280 88" }, 1.6),
    label("Each review comes after some forgetting.", 160, 156, { size: "small" }),
  ];
}

// Step 5: sessions in your calendar, getting shorter

function calendarScene() {
  const events = [["Topic A", "45 min", 150], ["Topic B", "40 min", 134], ["Topic C", "35 min", 118], ["Review", "30 min", 102]];
  return [
    svg("rect", { class: "sheet accent", x: 40, y: 6, width: 240, height: 158, rx: 10 }),
    svg("rect", { class: "cal-head", x: 40, y: 6, width: 240, height: 24, rx: 10 }),
    label("Calendar", 160, 18, { tone: "on-solid" }),
    ...events.map(([name, length, width], index) => animated(svg("g", {}, [
      svg("rect", { class: "event", x: 54, y: 38 + index * 26, width, height: 20, rx: 6 }),
      label(name, 64, 48 + index * 26, { anchor: "start", size: "small" }),
      label(length, 266, 48 + index * 26, { anchor: "end", size: "small" }),
    ]), "pop", 0.3 + index * 0.35)),
    tick(250, 148, 8),
    label("Every session entered", 150, 148, { size: "small" }),
  ];
}

export const DISTRIBUTED_PRACTICE_SCENES = {
  "dp-deadline": { draw: deadlineScene, caption: "Count the days to the deadline and the sessions you will realistically keep." },
  "dp-list": { draw: listScene, caption: "Break “study chapter 3” into specific items you could be asked, and star the hard ones." },
  "dp-assign": { draw: assignScene, caption: "Spread topics over every week, with the hard ones first and given more sessions." },
  "dp-review": { draw: reviewScene, caption: "Schedule a short revisit a few days after each topic, and another about a week later." },
  "dp-calendar": { draw: calendarScene, caption: "Put every session in your calendar as an event, and keep each one short enough to show up for." },
};
