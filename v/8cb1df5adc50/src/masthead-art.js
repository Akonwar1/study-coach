// The drawn scene beside the title, one per tab (the student chose the illustrated look, 2026-11-19): books, a pencil
// and a timer on Coach me; a bookshelf on Method library; a calendar filling with ticks on History; question cards on
// Practice. Colours come from the app's colour tokens (classes in styles.css, "ms-" for masthead scene), so dark mode
// gets its own lighter versions. Motion lives only in styles.css, slow and with long rests, and only when the computer
// allows motion: the student asked for movement that is never "too distracting or irritating ... in the periphery".

const SCENES = {
  coach: `
    <ellipse class="ms-shadow" cx="62" cy="88" rx="56" ry="4"/>
    <rect class="ms-accent" x="8" y="70" width="74" height="13" rx="2"/>
    <rect class="ms-manila" x="14" y="57" width="66" height="13" rx="2"/>
    <rect class="ms-teal" x="10" y="44" width="60" height="13" rx="2"/>
    <path class="ms-page-line" d="M16 63h40M18 50h34M14 76h46"/>
    <rect class="ms-paper" x="84" y="74" width="50" height="10" rx="1.5"/>
    <path class="ms-ink ms-write-line" d="M88 79h40"/>
    <g class="ms-pencil">
      <rect class="ms-pencil-body" x="84" y="50" width="6" height="24" rx="1" transform="rotate(28 87 62)"/>
      <path class="ms-pencil-tip" d="M93 74l-5-3 1 6z"/>
    </g>
    <circle class="ms-paper ms-clock-face" cx="112" cy="30" r="19"/>
    <path class="ms-clock-ticks" d="M112 14v3M112 43v3M96 30h3M125 30h3"/>
    <line class="ms-clock-hand" x1="112" y1="30" x2="112" y2="17"/>
    <circle class="ms-accent" cx="112" cy="30" r="2.2"/>`,
  library: `
    <ellipse class="ms-shadow" cx="70" cy="90" rx="62" ry="4"/>
    <rect class="ms-shelf" x="8" y="82" width="124" height="6" rx="2"/>
    <rect class="ms-accent" x="16" y="34" width="14" height="48" rx="2"/>
    <rect class="ms-info" x="32" y="42" width="12" height="40" rx="2"/>
    <g class="ms-book-out"><rect class="ms-manila" x="46" y="28" width="16" height="54" rx="2"/><path class="ms-page-line" d="M50 40h8M50 46h8"/></g>
    <rect class="ms-teal" x="64" y="38" width="12" height="44" rx="2"/>
    <rect class="ms-good" x="78" y="46" width="14" height="36" rx="2" transform="rotate(-12 92 82)"/>
    <rect class="ms-accent-soft-fill" x="100" y="40" width="12" height="42" rx="2"/>
    <rect class="ms-info" x="114" y="50" width="12" height="32" rx="2"/>
    <path class="ms-ribbon" d="M54 82v8l3-3 3 3v-8"/>
    <circle class="ms-spark" cx="122" cy="22" r="2.5"/>`,
  history: `
    <ellipse class="ms-shadow" cx="70" cy="90" rx="52" ry="4"/>
    <rect class="ms-paper" x="22" y="14" width="96" height="72" rx="6"/>
    <rect class="ms-manila" x="22" y="14" width="96" height="16" rx="6"/>
    <rect class="ms-manila" x="22" y="24" width="96" height="6"/>
    <path class="ms-rings" d="M44 9v10M96 9v10"/>
    <g class="ms-days">
      <rect x="32" y="38" width="16" height="12" rx="2"/><rect x="52" y="38" width="16" height="12" rx="2"/><rect x="72" y="38" width="16" height="12" rx="2"/><rect x="92" y="38" width="16" height="12" rx="2"/>
      <rect x="32" y="54" width="16" height="12" rx="2"/><rect x="52" y="54" width="16" height="12" rx="2"/><rect x="72" y="54" width="16" height="12" rx="2"/><rect x="92" y="54" width="16" height="12" rx="2"/>
      <rect x="32" y="70" width="16" height="10" rx="2"/><rect x="52" y="70" width="16" height="10" rx="2"/><rect x="72" y="70" width="16" height="10" rx="2"/>
    </g>
    <path class="ms-tick ms-tick-1" d="M35 44l3 3 7-6"/>
    <path class="ms-tick ms-tick-2" d="M55 44l3 3 7-6"/>
    <path class="ms-tick ms-tick-3" d="M75 60l3 3 7-6"/>
    <path class="ms-tick ms-tick-4" d="M35 75l3 3 7-6"/>`,
  practice: `
    <ellipse class="ms-shadow" cx="72" cy="90" rx="54" ry="4"/>
    <g class="ms-card-back"><rect class="ms-teal-soft-fill" x="30" y="18" width="70" height="56" rx="6" transform="rotate(-9 65 46)"/></g>
    <g class="ms-card-front">
      <rect class="ms-paper" x="44" y="26" width="72" height="56" rx="6"/>
      <rect class="ms-teal" x="44" y="26" width="72" height="9" rx="4"/>
      <text class="ms-question" x="62" y="66">?</text>
      <path class="ms-page-line" d="M80 50h26M80 58h20M80 66h24"/>
    </g>
    <g class="ms-check"><circle class="ms-good" cx="114" cy="78" r="11"/><path class="ms-check-mark" d="M109 78l3.5 3.5 6.5-7"/></g>
    <circle class="ms-spark ms-spark-1" cx="26" cy="24" r="2.5"/>
    <circle class="ms-spark ms-spark-2" cx="128" cy="30" r="2"/>`,
};

/** Draws the scene for `view` ("coach", "library", "history" or "practice") into `slot`, unless it is already there. */
export function drawMastheadScene(slot, view) {
  const id = SCENES[view] ? view : "coach";
  if (slot.dataset.scene === id) return; // redrawing would restart its motion on every screen change
  slot.dataset.scene = id;
  slot.innerHTML = `<svg viewBox="0 0 140 96" focusable="false">${SCENES[id]}</svg>`;
}
