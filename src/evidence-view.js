// Draws the "strength of evidence" ratings: a ranked panel for the library and a per-question breakdown for a method page.

import { button, el } from "./dom.js";
import { CRITERIA, DUNLOSKY_CODES, MAX_SCORE, RATING_RULES, evidenceFor, rankByEvidence } from "./evidence-strength.js";

function ratingPill(rating) {
  return el("span", { className: `rating-pill rating-${rating.toLowerCase()}`, text: rating });
}

function scoreBar(total) {
  const fill = el("span", { className: "barchart-fill tone-a" });
  fill.style.width = `${(total / MAX_SCORE) * 100}%`;
  return el("div", { className: "barchart-track", attrs: { role: "img", "aria-label": `${total} of ${MAX_SCORE} points` } }, [fill]);
}


/** Dunlosky et al.'s ratings for the three questions that match ours, in words. */
function describeGrid(grid) {
  const word = (code) => code.split("-").map((letter) => DUNLOSKY_CODES[letter]).join(", then ");
  return `For ${grid.technique.toLowerCase()} they rated: materials ${grid.materials} (${word(grid.materials)}), retention and tasks ${grid.tasks} (${word(grid.tasks)}), real classrooms ${grid.classes} (${word(grid.classes)}).`;
}

function renderRubric() {
  return el("ol", { className: "rubric" }, CRITERIA.map((criterion) =>
    el("li", {}, [el("strong", { text: criterion.name }), ` — ${criterion.question} `, el("span", { className: "rubric-scale", text: `2 = ${criterion.scale[2].toLowerCase()}; 0 = ${criterion.scale[0].toLowerCase()}.` })])));
}

/**
 * The library panel: every method with an evidence entry, best supported first.
 * `methods` is the METHODS list; onOpen(methodId) opens that method's page.
 */
export function renderEvidencePanel({ methods, onOpen, hasPage }) {
  const byId = new Map(methods.map((method) => [method.id, method]));
  const rows = rankByEvidence(methods.map((method) => method.id)).map((id) => {
    const evidence = evidenceFor(id);
    return el("li", { className: "rating-row" }, [
      el("div", { className: "rating-head" }, [
        el("h4", { text: byId.get(id).name }),
        ratingPill(evidence.rating),
        el("span", { className: "rating-score", text: `${evidence.total} of ${MAX_SCORE}` }),
      ]),
      scoreBar(evidence.total),
      el("p", { className: "rating-supports", text: evidence.supports }),
      el("p", { className: "rating-check", text: `Dunlosky et al. (2013), an outside check: ${evidence.dunlosky}` }),
      ...(evidence.nearCutoff ? [el("p", { className: "rating-near", text: evidence.nearCutoff })] : []),
      ...(hasPage(id) ? [button("See the score for each question", { onClick: () => onOpen(id) })] : []),
    ]);
  });
  return el("details", { className: "evidence-panel" }, [
    el("summary", { text: "How strong is the evidence for each method?" }),
    el("div", { className: "evidence-panel-body" }, [
      el("p", { text: "Each method is scored on six questions, 0 to 2 points each, from the studies cited on its page. The rating is about evidence that the method helps you learn, not about how large its effect was." }),
      renderRubric(),
      el("ul", { className: "rating-rules" }, RATING_RULES.map((rule) =>
        el("li", {}, [ratingPill(rule.rating), ` ${rule.rule}`]))),
      el("p", { className: "rating-note", text: "The questions and the cut-offs between Strong, Moderate and Thin are my judgment, and every score has its reason and its studies on the method’s page. Where a page does not show something, the score is 1, not 2." }),
      el("h4", { text: "What else is checked" }),
      el("ul", { className: "rating-checks" }, [
        el("li", { text: "Every study a score names must appear in that method’s source list; a test fails otherwise." }),
        el("li", { text: "Each rating shows when one point either way would change it, since those ratings are the least certain." }),
        el("li", { text: "Cautions are listed beside each rating, such as signs of missing studies or effects that shrink in real classrooms. They are shown, not scored." }),
        el("li", { text: "“Results vary” is the I² figure from Donoghue & Hattie (2021): the share of the differences between studies that is real, not chance. It was between 68% and 89% for all ten techniques they measured, so every average hides a lot of variation." }),
      ]),
      el("ol", { className: "rating-list" }, rows),
    ]),
  ]);
}

/** The "How strong is the evidence?" block on a method page: the rating and the reason behind each score. */
export function renderEvidenceBreakdown(methodId) {
  const evidence = evidenceFor(methodId);
  if (!evidence) return null;
  const rows = CRITERIA.map((criterion) => {
    const { score, reason } = evidence.criteria[criterion.id];
    const dots = Array.from({ length: 2 }, (_, index) => el("span", { className: `dot${index < score ? " filled" : ""}` }));
    return el("li", { className: "criterion" }, [
      el("div", { className: "criterion-head" }, [
        el("h4", { text: criterion.name }),
        el("span", { className: "dots", attrs: { role: "img", "aria-label": `${score} of 2` } }, dots),
        el("span", { className: "criterion-meaning", text: criterion.scale[score] }),
      ]),
      el("p", { text: reason }),
    ]);
  });
  return el("div", { className: "evidence-breakdown" }, [
    el("div", { className: "rating-head" }, [ratingPill(evidence.rating), el("span", { className: "rating-score", text: `${evidence.total} of ${MAX_SCORE} points` })]),
    el("p", { text: evidence.supports }),
    ...(evidence.nearCutoff ? [el("p", { className: "rating-near", text: evidence.nearCutoff })] : []),
    el("ol", { className: "criteria" }, rows),
    el("h4", { text: "Keep in mind" }),
    el("ul", { className: "cautions" }, [
      ...evidence.cautions.map((caution) => el("li", { text: caution.text })),
      ...(evidence.variation ? [el("li", { text: `Results vary a lot between studies: I² = ${evidence.variation.percent}% for ${evidence.variation.technique} (Donoghue & Hattie, 2021). The average hides big swings.` })] : []),
    ]),
    el("p", { className: "barchart-source", text: `Outside check: Dunlosky et al. (2013) rated this technique ${evidence.dunlosky.toLowerCase()}.${evidence.dunloskyGrid ? ` ${describeGrid(evidence.dunloskyGrid)}` : ""} How the scores work is explained under “How strong is the evidence for each method?” in the Method library.` }),
  ]);
}

const RATING_MEANING = {
  Strong: "Well established: many studies agree",
  Moderate: "Good support, with some gaps",
  Thin: "Promising, but fewer studies so far",
};
const RATING_LEVEL = { Strong: 3, Moderate: 2, Thin: 1 };

/** Three bars, filled up to the rating, so strength reads as a level and not as a grade. */
function levelMeter(rating) {
  const level = RATING_LEVEL[rating];
  const bars = [1, 2, 3].map((position) => el("span", { className: `meter-bar${position <= level ? " on" : ""}` }));
  return el("span", { className: `level-meter rating-${rating.toLowerCase()}`, attrs: { role: "img", "aria-label": `${level} of 3` } }, bars);
}

function evidenceLine(className, title, text) {
  return el("p", { className: `rating-tag-line ${className}` }, [el("strong", { text: `${title}: ` }), text]);
}

/**
 * The evidence summary for cards and page headers: the rating as a level with a plain-words meaning, then what the
 * research shows and what to keep in mind. Every method has both, including the Strong ones, because none of the
 * evidence is without limits.
 */
export function renderEvidenceTag(methodId) {
  const evidence = evidenceFor(methodId);
  if (!evidence) return null;
  return el("div", { className: "rating-tag" }, [
    el("div", { className: "rating-tag-head" }, [
      el("div", { className: "rating-tag-scale" }, [
        el("span", { className: "rating-tag-label", text: "Strength of evidence" }),
        levelMeter(evidence.rating),
      ]),
      ratingPill(evidence.rating),
      el("span", { className: "rating-tag-meaning", text: RATING_MEANING[evidence.rating] }),
    ]),
    evidenceLine("rating-tag-backed", "What the research shows", evidence.backed),
    evidenceLine("rating-tag-note", "Worth knowing", evidence.note.text),
  ]);
}
