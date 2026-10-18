import { renderBarChart } from "./charts.js";
import { button, el } from "./dom.js";
import { renderGlance } from "./glance.js";
import { renderVisual } from "./visuals.js";

function section(title, children) {
  return el("section", { className: "page-section" }, [el("h3", { text: title }), ...children]);
}

function labelledParagraph({ heading, text }) {
  return el("div", { className: "page-block" }, [el("h4", { text: heading }), el("p", { text })]);
}

function renderEvidence(entry) {
  return el("div", { className: "evidence-entry" }, [
    el("h4", { text: entry.title }),
    el("p", { text: entry.text }),
    ...(entry.chart ? [renderBarChart(entry.chart)] : []),
    ...(entry.afterText ? [el("p", { text: entry.afterText })] : []),
  ]);
}

function renderPractice(practice) {
  const diagram = renderVisual(practice.visual);
  if (!diagram) return [];
  return [el("div", { className: "visual-wrap" }, [diagram.node]), el("p", { className: "barchart-source", text: practice.caption })];
}

/**
 * The in-depth page for one method. `page` is its entry in method-pages.js.
 * onBack() leaves the page; onStart() begins a guided session for this method.
 */
export function renderMethodPage({ method, page, onBack, onStart }) {
  const sections = [
    { id: "glance", title: "At a glance", children: [renderGlance(page.glance)] },
    { id: "history", title: "Where it came from", children: [el("ol", { className: "timeline" }, page.history.map((item) =>
      el("li", {}, [el("span", { className: "timeline-when", text: item.when }), el("p", { text: item.text })])))] },
    { id: "how", title: "How it works", children: page.how.map(labelledParagraph) },
    { id: "evidence", title: "The evidence", children: page.evidence.map(renderEvidence) },
    { id: "limits", title: "Where it falls short", children: page.limits.map(labelledParagraph) },
    { id: "practice", title: "In practice", children: [...renderPractice(page.practice), el("div", { className: "card-action" }, [button("Start guided session", { primary: true, onClick: onStart })])] },
    { id: "sources", title: "Sources", children: [el("ul", { className: "sources" }, page.sources.map((source) => el("li", { text: source })))] },
  ].map((item) => ({ ...item, node: section(item.title, item.children) }));

  const jumps = sections.map((item) => {
    const chip = el("button", { className: "chip", text: item.title, attrs: { type: "button" } });
    chip.addEventListener("click", () => item.node.scrollIntoView({ behavior: "smooth", block: "start" }));
    return chip;
  });

  return el("article", { className: "method-page" }, [
    button("← Back", { onClick: onBack }),
    el("p", { className: "badge", text: "Method deep dive" }),
    el("h2", { text: method.name }),
    el("p", { className: "method-tagline", text: method.tagline }),
    el("p", { className: "page-lede", text: method.def }),
    el("div", { className: "card-action" }, [button("Start guided session", { primary: true, onClick: onStart })]),
    el("nav", { className: "chips", attrs: { "aria-label": "Sections on this page" } }, jumps),
    ...sections.map((item) => item.node),
  ]);
}
