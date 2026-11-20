// Small motion as a screen opens (step 2 of the visual refresh, 2026-11-19): numbers count up to their value and bars
// grow in, once, so the app feels alive without getting in the way. playEntrance is called when a screen opens (a tab,
// Your stats, a topic page), never on redraws after a change, and does nothing when the computer asks for reduced
// motion. The growing bars are CSS rules under `.animate-in` in styles.css; the counting is here.

// The numbers that count up: Your stats' tiles and History's totals.
const COUNTED = ".pstats-tile-value, .pstats-hero-value, .stat-value";
const COUNT_MS = 900;
const ENTRANCE_MS = 1600; // how long `.animate-in` stays, so the bars' CSS animation can finish

/** `text` with every number in it scaled to `share` (0 to 1) of itself, rounded: "3h 20m" at 0.5 is "2h 10m". */
export function countFrame(text, share) {
  return text.replace(/\d+/g, (digits) => String(Math.round(Number(digits) * share)));
}

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/**
 * Counts `node`'s number(s) up from zero. The element's own text stays the real value the whole time (so screen
 * readers and anything reading the page get it); the counting digits are drawn over it from `data-count` by
 * `.counting::after` in styles.css, which screen readers skip, and the real text shows again when they land.
 */
function countUp(node) {
  const real = node.textContent;
  if (!/\d/.test(real)) return;
  const stop = () => {
    node.classList.remove("counting");
    delete node.dataset.count;
  };
  const start = performance.now();
  const step = (now) => {
    if (!node.isConnected || node.textContent !== real) return stop(); // redrawn meanwhile: the new text is right
    const progress = Math.min(1, (now - start) / COUNT_MS);
    node.dataset.count = countFrame(real, 1 - (1 - progress) ** 3); // eases out, slowing as it nears the value
    if (progress < 1) requestAnimationFrame(step);
    else stop();
  };
  node.dataset.count = countFrame(real, 0);
  node.classList.add("counting");
  requestAnimationFrame(step);
}

const timers = new WeakMap();

/** Plays the entrance on `root`: counts its numbers up and lets its bars grow in (styles.css, `.animate-in`). */
export function playEntrance(root, { reduced = reducedMotion() } = {}) {
  if (reduced || !root) return;
  root.classList.remove("animate-in");
  void root.offsetWidth; // restarts the bars' animation if an entrance was still playing
  root.classList.add("animate-in");
  clearTimeout(timers.get(root));
  timers.set(root, setTimeout(() => root.classList.remove("animate-in"), ENTRANCE_MS));
  root.querySelectorAll(COUNTED).forEach(countUp);
}
