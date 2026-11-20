// Shared drawing tools for the guided-step pictures: DOM helpers and the shapes the scenes are built from.
//
// Everything is built from DOM nodes, never parsed from strings, and coloured by CSS variables (see ".scene"
// in styles.css) so it follows the light and dark themes.

const SVG_NS = "http://www.w3.org/2000/svg";

export function html(tag, className, children = [], attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  for (const child of children) node.append(typeof child === "string" ? document.createTextNode(child) : child);
  return node;
}

export function svg(tag, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value));
  for (const child of children) node.append(child);
  return node;
}

export function svgText(text, attrs) {
  const node = svg("text", attrs);
  node.textContent = text;
  return node;
}

// Motion is switched off for viewers who prefer reduced motion.
const prefersReducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const bar = (x, y, width, kind) => svg("rect", { class: `bar ${kind}`, x, y, width, height: kind === "head" ? 4.5 : 3.5, rx: 1.75 });

/**
 * A sheet of paper. Each row is [fraction of the width, kind]: "ink" (default), "head", "key" (a bold term),
 * "pen2" (written with the second pen) or "gap" (a dashed blank where you got stuck).
 */
export function sheet(x, y, width, height, rows = [], { accent = false } = {}) {
  const parts = [svg("rect", { class: `sheet${accent ? " accent" : ""}`, x, y, width, height, rx: 2 })];
  rows.forEach(([fraction, kind = "ink"], index) => {
    const top = y + 6 + index * 7;
    parts.push(kind === "gap"
      ? svg("line", { class: "gap-line", x1: x + 5, y1: top + 2, x2: x + 5 + (width - 10) * fraction, y2: top + 2 })
      : bar(x + 5, top, (width - 10) * fraction, kind));
  });
  return svg("g", {}, parts);
}

export const PAGE_ROWS = [[0.8, "head"], [1], [0.9], [0.35, "key"], [1], [0.85], [0.45, "key"], [0.7]];
export const BOOK_ROWS = [[0.8, "head"], [1], [0.9], [1], [0.7]];

export const pen = (x1, y1, x2, y2, second = false) => svg("line", { class: `pen${second ? " second" : ""}`, x1, y1, x2, y2 });

export function shutBook(x, y) {
  return svg("g", {}, [
    svg("rect", { class: "cover", x, y, width: 28, height: 20, rx: 2 }),
    svg("line", { class: "spine", x1: x + 5, y1: y, x2: x + 5, y2: y + 20 }),
    svg("rect", { class: "bar ink", x: x + 10, y: y + 8, width: 12, height: 3.5, rx: 1.75 }),
  ]);
}

export function phone(x, y) {
  return svg("g", {}, [
    svg("rect", { class: "device", x, y, width: 13, height: 24, rx: 3 }),
    svg("circle", { class: "pupil", cx: x + 6.5, cy: y + 19.5, r: 1.3 }),
  ]);
}

export const tick = (cx, cy, size) => svg("path", { class: "tick", d: `M${cx - size} ${cy} L${cx - size * 0.3} ${cy + size * 0.7} L${cx + size} ${cy - size * 0.7}` });

export function bell(cx, cy) {
  return svg("g", {}, [
    svg("path", { class: "bell", d: `M${cx - 9} ${cy + 7} Q${cx - 7} ${cy + 1} ${cx - 7} ${cy - 4} A7 7 0 0 1 ${cx + 7} ${cy - 4} Q${cx + 7} ${cy + 1} ${cx + 9} ${cy + 7} Z` }),
    svg("circle", { class: "bell", cx, cy: cy + 11, r: 2.4 }),
  ]);
}

export const place = (x, y, scale, children) => svg("g", { transform: `translate(${x} ${y}) scale(${scale})` }, children);

export function label(content, x, y, { anchor = "middle", size = "", tone = "" } = {}) {
  return svgText(content, { class: ["scene-label", anchor, size, tone].filter(Boolean).join(" "), x, y });
}

/** A rounded label centred at (cx, cy). kind: "soft" or "solid". */
export function pill(cx, cy, width, content, kind = "soft", height = 26) {
  return svg("g", {}, [
    svg("rect", { class: `pill ${kind}`, x: cx - width / 2, y: cy - height / 2, width, height, rx: height / 2 }),
    label(content, cx, cy, { tone: kind === "solid" ? "on-solid" : "" }),
  ]);
}

export function tip(x, y, angle) {
  return svg("path", { class: "arrow-tip", d: "M0 0 L-6 -3.5 L-6 3.5 Z", transform: `translate(${x} ${y}) rotate(${angle})` });
}

export function arrow(x1, y1, x2, y2, dashed = false) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return svg("g", {}, [svg("line", { class: `arrow-line${dashed ? " dashed" : ""}`, x1, y1, x2, y2 }), tip(x2, y2, angle)]);
}

/** Wraps `node` in a group that plays an entrance or ambient animation ("pop", "pulse" or "settle faded"). */
export function animated(node, kind, delay = 0, vars = {}) {
  const style = [`--d:${delay}s`, ...Object.entries(vars).map(([name, value]) => `${name}:${value}`)].join(";");
  return svg("g", { class: kind, style }, [node]);
}

/** A path that draws itself in. */
export function drawn(attrs, delay = 0) {
  return svg("path", { ...attrs, class: `${attrs.class} draw`, pathLength: 1, style: `--d:${delay}s` });
}

/** Something that travels along `path` forever. Not drawn at all for viewers who prefer reduced motion. */
export function traveller(shape, path, seconds, begin = 0) {
  if (prefersReducedMotion()) return [];
  shape.append(svg("animateMotion", { path, dur: `${seconds}s`, begin: `${begin}s`, repeatCount: "indefinite" }));
  return [shape];
}

/** A person (head and shoulders), 36 wide and 44 tall with its top-left corner at (x, y). */
export function person(x, y, scale = 1) {
  return place(x, y, scale, [
    svg("circle", { class: "figure", cx: 18, cy: 10, r: 9 }),
    svg("path", { class: "figure", d: "M0 44 Q0 23 18 23 Q36 23 36 44 Z" }),
  ]);
}

/** A speech or thought bubble. `tail` is "left", "right" or "none"; `thought` swaps the tail for small circles. */
export function bubble(x, y, width, height, children = [], { tail = "left", thought = false } = {}) {
  const parts = [svg("rect", { class: "bubble", x, y, width, height, rx: 10 })];
  if (tail !== "none") {
    const side = tail === "left" ? -1 : 1;
    const baseX = tail === "left" ? x : x + width;
    const baseY = y + height - 8;
    parts.push(thought
      ? svg("circle", { class: "bubble", cx: baseX + side * 6, cy: baseY + 5, r: 3 })
      : svg("path", { class: "bubble tail", d: `M${baseX} ${baseY - 7} L${baseX + side * 9} ${baseY + 4} L${baseX} ${baseY} Z` }));
  }
  return svg("g", {}, [...parts, ...children]);
}

/** A card with optional centred text. kind: "soft", "plain", "solid", "dashed" or "good". */
export function card(x, y, width, height, text = "", kind = "soft", size = "") {
  return svg("g", {}, [
    svg("rect", { class: `card ${kind}`, x, y, width, height, rx: 6 }),
    ...(text ? [label(text, x + width / 2, y + height / 2, { tone: kind === "solid" ? "on-solid" : "", size })] : []),
  ]);
}

export function star(cx, cy, radius = 7) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const r = index % 2 === 0 ? radius : radius * 0.45;
    const angle = (Math.PI / 5) * index - Math.PI / 2;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  });
  return svg("polygon", { class: "star", points: points.join(" ") });
}

export const cross = (cx, cy, size = 5) => svg("path", { class: "cross-mark", d: `M${cx - size} ${cy - size} L${cx + size} ${cy + size} M${cx + size} ${cy - size} L${cx - size} ${cy + size}` });

/**
 * A round gauge. `fraction` (0 to 1) is how much is filled. Returns { parts, update(fraction) } so a timer can
 * move it; parts is what to draw. `thin` draws a slimmer ring, and `fillIn` (a delay in seconds) makes it fill
 * itself once when the scene appears.
 */
export function gauge(cx, cy, radius, fraction = 1, tone = "accent", { thin = false, fillIn = null } = {}) {
  const arc = svg("circle", {
    class: `donut-arc ${tone}${thin ? " thin" : ""}${fillIn === null ? "" : " fill-in"}`, cx, cy, r: radius, pathLength: 1,
    "stroke-dasharray": `${fraction} 1`, transform: `rotate(-90 ${cx} ${cy})`, ...(fillIn === null ? {} : { style: `--d:${fillIn}s` }),
  });
  return {
    parts: [svg("circle", { class: `donut-track${thin ? " thin" : ""}`, cx, cy, r: radius }), arc],
    update: (value) => arc.setAttribute("stroke-dasharray", `${Math.min(1, Math.max(0, value))} 1`),
  };
}

/** A small flag on a pole, planted with its foot at (x, y). */
export function flag(x, y, text = "") {
  return svg("g", {}, [
    svg("line", { class: "pen", x1: x, y1: y, x2: x, y2: y - 26 }),
    svg("path", { class: "flag", d: `M${x} ${y - 26} L${x + 16} ${y - 20} L${x} ${y - 14} Z` }),
    ...(text ? [label(text, x + 20, y - 20, { anchor: "start", size: "small" })] : []),
  ]);
}

/**
 * Builds a scene's figure: the picture and its caption. `scene.draw(context)` returns the parts to draw, or
 * { parts, update } when the picture reacts to the step's timer (update(fraction) runs from 0 to 1).
 */
export function sceneFigure(scene, context = {}) {
  const drawn = scene.draw(context);
  const parts = Array.isArray(drawn) ? drawn : drawn.parts;
  return {
    node: html("figure", "visual", [
      svg("svg", { viewBox: "0 0 320 170", class: "scene wide-scene", role: "img", "aria-label": scene.caption }, parts),
      html("p", "visual-caption", [scene.caption]),
    ]),
    update: Array.isArray(drawn) ? undefined : drawn.update,
  };
}
