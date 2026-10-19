// Plain-language help for effect sizes (the d and g numbers on the method pages).

import { el } from "./dom.js";

export const EFFECT_NAMES = { d: "Cohen’s d", g: "Hedges’ g" };

// Standard normal cumulative distribution (Abramowitz and Stegun 7.1.26, error under 0.0000002).
function normalCdf(z) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-x * x);
  return 0.5 * (1 + Math.sign(z) * erf);
}

/**
 * Cohen's "U3": if scores form a bell curve, an effect size of `size` puts the average learner who used the method
 * ahead of about this many of every 100 learners in the comparison group.
 */
export function learnersBeaten(size) {
  return Math.round(normalCdf(size) * 100);
}

const LADDER = [
  { size: 0, label: "0 · no difference" },
  { size: 0.2, label: "0.2 · small" },
  { size: 0.5, label: "0.5 · medium" },
  { size: 0.8, label: "0.8 · large" },
];

function renderLadder() {
  const rows = LADDER.map((step) => {
    const beaten = learnersBeaten(step.size);
    const fill = el("span", { className: "barchart-fill tone-a" });
    fill.style.width = `${beaten}%`;
    return el("div", { className: "glance-row" }, [
      el("span", { className: "glance-row-name", text: step.label }),
      el("span", { className: "glance-row-value", text: `${beaten} of 100` }),
      el("div", { className: "barchart-track", attrs: { role: "img", "aria-label": `${step.label}: ahead of ${beaten} of 100` } }, [fill]),
    ]);
  });
  return el("div", { className: "glance-compare effect-ladder" }, rows);
}

/** The "What do d and g mean?" box. Closed until opened; the effect cards already say the key point in words. */
export function renderEffectExplainer() {
  return el("details", { className: "explainer" }, [
    el("summary", { text: "What do d and g mean?" }),
    el("div", { className: "explainer-body" }, [
      el("p", { text: "Many studies on these pages report an effect size, written d or g. It answers one question: how big was the difference between the people who used the method and the people who did not?" }),
      el("h4", { text: "How it is measured" }),
      el("p", { text: "Take the gap between the two groups’ average scores and divide it by how spread out scores normally are (the standard deviation). Dividing by the spread puts every study on the same scale, so a quiz out of 10 and an exam out of 100 can be compared." }),
      el("h4", { text: "d or g?" }),
      el("p", { text: "Same idea. Cohen’s d is the original measure, and Hedges’ g is d with a small correction for studies with few people. Read them the same way." }),
      el("h4", { text: "What the numbers mean" }),
      el("p", { text: "Picture 100 learners who studied the usual way. The effect size tells you where the average learner who used the method would rank among them:" }),
      renderLadder(),
      el("h4", { text: "Handle with care" }),
      el("ul", {}, [
        el("li", { text: "The “ahead of about X of 100” reading assumes scores form a rough bell curve, so treat it as an approximation." }),
        el("li", { text: "Small, medium and large are Cohen’s rough labels, not verdicts. Whether a gap matters depends on what it costs you." }),
        el("li", { text: "A negative number means the comparison group did better." }),
        el("li", { text: "An average across many studies can hide big differences between them. It describes groups, not any one learner." }),
      ]),
    ]),
  ]);
}
