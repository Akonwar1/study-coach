// The "At a glance" cards at the top of a method page. Each card shows one result in the form that suits it:
//
//   compare  two or three results side by side as bars: { items: [{ name, value, tone? }], max, unit?, decimals? }
//   effect   an effect size on a small / medium / large scale: { value | range: [low, high], symbol: "d" | "g" }
//            (the card also says in plain words how many of 100 comparison learners the average learner beat)
//   dots     "26 of 30" as a row of dots: { filled, total }
//   number   one big figure: { value, unit? }
//   badge    a word or short phrase, such as a rating: { value }
//
// Every card also has `text` (what the figure means, in plain words) and `source` (the study it comes from).
// Everything is plain HTML so it reads well on a phone and follows the light and dark themes.

import { el } from "./dom.js";
import { EFFECT_NAMES, learnersBeaten } from "./effect-size.js";

const KIND_LABEL = {
  compare: "Side by side",
  effect: "Effect size",
  dots: "Head count",
  number: "Key number",
  badge: "Finding",
};

// Cohen's rule of thumb: below 0.2 is negligible, 0.2 to 0.5 small, 0.5 to 0.8 medium, above 0.8 large.
// The scale runs to 1.5; each label sits in the middle of its zone.
const EFFECT_SCALE_MAX = 1.5;
const EFFECT_MARKS = [{ at: 0.35, label: "small" }, { at: 0.65, label: "medium" }, { at: 1.15, label: "large" }];

const share = (value, max) => `${Math.min(100, Math.max(0, (value / max) * 100))}%`;

function renderCompare(stat) {
  const tones = ["a", "c", "b"];
  const rows = stat.items.map((item, index) => {
    const fill = el("span", { className: `barchart-fill tone-${item.tone ?? tones[index % tones.length]}` });
    fill.style.width = share(item.value, stat.max);
    const text = `${item.value.toFixed(stat.decimals ?? 0)}${stat.unit ?? ""}`;
    return el("div", { className: "glance-row" }, [
      el("span", { className: "glance-row-name", text: item.name }),
      el("span", { className: "glance-row-value", text }),
      el("div", { className: "barchart-track", attrs: { role: "img", "aria-label": `${item.name}: ${text}` } }, [fill]),
    ]);
  });
  return el("div", { className: "glance-compare" }, rows);
}

function renderEffect(stat) {
  const [low, high] = stat.range ?? [stat.value, stat.value];
  const display = stat.range ? `${low.toFixed(2)}–${high.toFixed(2)}` : low.toFixed(2);
  const marker = el("span", { className: "gauge-marker" });
  marker.style.left = share(low, EFFECT_SCALE_MAX);
  marker.style.width = `max(10px, calc(${share(high, EFFECT_SCALE_MAX)} - ${share(low, EFFECT_SCALE_MAX)}))`;
  const marks = EFFECT_MARKS.map((mark) => {
    const node = el("span", { className: "gauge-mark", text: mark.label });
    node.style.left = share(mark.at, EFFECT_SCALE_MAX);
    return node;
  });
  const beatenLow = learnersBeaten(low);
  const beatenHigh = learnersBeaten(high);
  const beaten = beatenLow === beatenHigh ? `${beatenLow}` : `${beatenLow} to ${beatenHigh}`;
  const name = EFFECT_NAMES[stat.symbol] ?? stat.symbol;
  return el("div", { className: "glance-effect" }, [
    el("p", { className: "glance-big" }, [display, el("span", { className: "glance-unit", text: ` ${name}` })]),
    el("p", { className: "glance-plain", text: `In plain terms: the average learner using the method did better than about ${beaten} out of 100 who did not.` }),
    el("div", { className: "gauge", attrs: { role: "img", "aria-label": `${name} = ${display} on a scale from 0 to ${EFFECT_SCALE_MAX}; 0.2 to 0.5 is small, 0.5 to 0.8 medium, above 0.8 large` } }, [
      el("span", { className: "gauge-zone zone-small" }),
      el("span", { className: "gauge-zone zone-medium" }),
      el("span", { className: "gauge-zone zone-large" }),
      marker,
    ]),
    el("div", { className: "gauge-marks", attrs: { "aria-hidden": "true" } }, marks),
  ]);
}

function renderDots(stat) {
  const dots = Array.from({ length: stat.total }, (_, index) => el("span", { className: `dot${index < stat.filled ? " filled" : ""}` }));
  return el("div", { className: "glance-dots" }, [
    el("p", { className: "glance-big", text: `${stat.filled} of ${stat.total}` }),
    el("div", { className: "dots", attrs: { role: "img", "aria-label": `${stat.filled} of ${stat.total}` } }, dots),
  ]);
}

function renderNumber(stat) {
  return el("p", { className: "glance-big" }, [stat.value, ...(stat.unit ? [el("span", { className: "glance-unit", text: ` ${stat.unit}` })] : [])]);
}

function renderBadge(stat) {
  return el("p", { className: "glance-badge", text: stat.value });
}

const RENDERERS = { compare: renderCompare, effect: renderEffect, dots: renderDots, number: renderNumber, badge: renderBadge };

export const GLANCE_KINDS = Object.keys(RENDERERS);

export function renderGlance(stats) {
  const cards = stats.map((stat) =>
    el("div", { className: `glance-card kind-${stat.kind}` }, [
      el("p", { className: "glance-kind", text: KIND_LABEL[stat.kind] }),
      RENDERERS[stat.kind](stat),
      el("p", { className: "glance-text", text: stat.text }),
      el("p", { className: "glance-source", text: stat.source }),
    ]));
  return el("div", { className: "glance" }, cards);
}
