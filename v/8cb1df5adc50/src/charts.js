// Bar charts for the method pages. Built from HTML (not SVG) so the labels stay readable on a phone,
// follow the light and dark themes, and can be read by a screen reader. Bars always start at zero.
//
// chart = {
//   title, source,
//   groups: [{ label, bars: [{ value, label?, valueText?, tone?, series? }] }],
//   max,                 value that fills a whole bar
//   unit?, decimals?,    shown after each value unless the bar has its own valueText
//   legend?: [{ tone, label }]   when bars share colours across groups, instead of labelling every bar
// }

import { el } from "./dom.js";

function formatValue(bar, { unit = "", decimals = 0 }) {
  return bar.valueText ?? `${bar.value.toFixed(decimals)}${unit}`;
}

function renderBar(bar, chart) {
  const text = formatValue(bar, chart);
  const fill = el("span", { className: `barchart-fill tone-${bar.tone ?? "a"}` });
  fill.style.width = `${Math.min(100, Math.max(0, (bar.value / chart.max) * 100))}%`;
  const track = el("div", { className: "barchart-track", attrs: { role: "img", "aria-label": `${bar.label ?? bar.series ?? ""} ${text}`.trim() } }, [fill]);
  return el("div", { className: "barchart-row" }, [
    ...(bar.label ? [el("span", { className: "barchart-bar-label", text: bar.label })] : []),
    track,
    el("span", { className: "barchart-value", text }),
  ]);
}

export function renderBarChart(chart) {
  const legend = chart.legend
    ? [el("ul", { className: "barchart-legend" }, chart.legend.map((item) =>
      el("li", {}, [el("span", { className: `swatch tone-${item.tone}` }), item.label])))]
    : [];
  const groups = chart.groups.map((group) =>
    el("div", { className: "barchart-group" }, [
      ...(group.label ? [el("p", { className: "barchart-group-label", text: group.label })] : []),
      ...group.bars.map((bar) => renderBar(bar, chart)),
    ]));
  return el("figure", { className: "barchart" }, [
    el("figcaption", { className: "barchart-title", text: chart.title }),
    ...legend,
    ...groups,
    el("p", { className: "barchart-source", text: `Source: ${chart.source}` }),
  ]);
}
