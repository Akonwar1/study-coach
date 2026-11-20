// The motes rising through the sky behind every screen (styles.css, "the illustrated look"). Their number follows the
// window's width, so a large window is as full as a small one (the student, 2026-11-19: in a larger window "the motes
// feel slightly too sparse ... leaving the background empty in some places"). Each mote gets a place spread evenly
// across the width, one of three depths (far: small, faint, slowest; middle; near: larger, brighter, a little faster),
// a colour, and its own sway and lean; the movement itself is shared, in styles.css. Variations come from a fixed
// sequence, so the sky looks the same on every visit.

const MIN_MOTES = 12;
const MAX_MOTES = 36;
const WIDTH_PER_MOTE = 52; // pixels of window width per mote

const DEPTHS = [
  { size: [4, 5], peak: 0.3, rise: 240, sway: [10, 16], swayTime: [13, 17], lean: 2 }, // far
  { size: [6, 7], peak: 0.45, rise: 170, sway: [16, 24], swayTime: [10, 13], lean: 3 }, // middle
  { size: [9, 10], peak: 0.6, rise: 120, sway: [22, 30], swayTime: [8, 10], lean: 4 }, // near
];
const COLOURS = ["var(--accent)", "var(--teal)", "var(--manila)", "var(--info)"];

/** How many motes a window `width` pixels wide gets. */
export function moteCount(width) {
  return Math.min(MAX_MOTES, Math.max(MIN_MOTES, Math.round(width / WIDTH_PER_MOTE)));
}

/** A fixed number between 0 and 1 for mote `i` and property `salt`, the same on every visit. */
function fixed(i, salt) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const between = ([low, high], share) => low + (high - low) * share;

/** The numbers 0 to n - 1 in a fixed shuffled order (seeded), the same on every visit. */
function shuffled(n, seed) {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(fixed(i, seed) * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/**
 * Where across (x, 0 to 1) and how far through its rise (phase, 0 to 1) each of `count` motes starts. Mote i is in
 * depth i % 3. Each mote gets its own strip of the width (so every part of the width has one) and each depth's motes
 * get evenly spaced turns through the rise (so the sky is never empty); which strip goes with which turn is shuffled.
 * A shuffle can still lean or clump by chance with few motes, so fixed shuffles are tried in turn and the first with
 * no lean and no clump is kept (the student saw the motes on a slanted line, 2026-11-19: places and turns had
 * followed one order). The same window width always gives the same scatter.
 */
export function scatter(count) {
  const perDepth = DEPTHS.map((_, depth) => Math.ceil((count - depth) / DEPTHS.length));
  let best = null;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const strips = shuffled(count, 11 + count + attempt * 101);
    const turns = DEPTHS.map((_, depth) => shuffled(perDepth[depth], 23 + depth + count + attempt * 101));
    const motes = strips.map((strip, i) => ({
      x: (strip + 0.15 + fixed(i, 1) * 0.7) / count,
      phase: (turns[i % DEPTHS.length][Math.floor(i / DEPTHS.length)] + 0.25 + fixed(i, 2) * 0.5) / perDepth[i % DEPTHS.length],
    }));
    const lean = Math.abs(correlation(motes));
    const clumped = motes.some((a, i) => motes.some((b, j) => j > i && i % DEPTHS.length === j % DEPTHS.length && Math.abs(a.x - b.x) <= 0.035 && Math.abs(a.phase - b.phase) <= 0.07));
    if (!clumped && lean < 0.15) return motes;
    if (!clumped && (!best || lean < best.lean)) best = { motes, lean };
  }
  return best.motes;
}

/** How strongly the motes' places across and their phases go together (-1 to 1); near 0 means no slant at all. */
function correlation(motes) {
  const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const mx = mean(motes.map((m) => m.x));
  const mp = mean(motes.map((m) => m.phase));
  const together = mean(motes.map((m) => (m.x - mx) * (m.phase - mp)));
  const spread = (key, m) => Math.sqrt(mean(motes.map((mote) => (mote[key] - m) ** 2)));
  return together / (spread("x", mx) * spread("phase", mp));
}

/** Fills `sky` with the motes for a window `width` wide, unless it already has that many (so they keep moving). */
export function drawMotes(sky, width) {
  const count = moteCount(width);
  if (Number(sky.dataset.motes) === count) return;
  sky.dataset.motes = String(count);
  sky.querySelectorAll(".sky-mote").forEach((mote) => mote.remove());
  for (const [i, { x, phase }] of scatter(count).entries()) {
    const depth = DEPTHS[i % DEPTHS.length];
    const start = -phase * depth.rise;
    const mote = document.createElement("i");
    mote.className = "sky-mote";
    const settings = {
      "--x": `${(x * 100).toFixed(1)}%`,
      "--size": `${Math.round(between(depth.size, fixed(i, 3)))}px`,
      "--c": COLOURS[i % COLOURS.length],
      "--peak": String(depth.peak),
      "--rise": `${depth.rise}s`,
      "--start": `${start.toFixed(1)}s`,
      "--sway": `${Math.round(between(depth.sway, fixed(i, 4)))}px`,
      "--sway-time": `${between(depth.swayTime, fixed(i, 5)).toFixed(1)}s`,
      "--lean": `${((fixed(i, 6) - 0.5) * 2 * depth.lean).toFixed(1)}vw`,
    };
    for (const [name, value] of Object.entries(settings)) mote.style.setProperty(name, value);
    sky.append(mote);
  }
}

/** Draws the motes for this window, and again when its width changes enough to need more or fewer. */
export function startSky(sky) {
  drawMotes(sky, window.innerWidth);
  let waiting = null;
  window.addEventListener("resize", () => {
    clearTimeout(waiting);
    waiting = setTimeout(() => drawMotes(sky, window.innerWidth), 300);
  });
}
