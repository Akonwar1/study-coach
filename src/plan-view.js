import { el } from "./dom.js";
import { renderIcon } from "./icons.js";
import { planSummary } from "./plan.js";

// Same hues and icons as the answer chips and rows on the results screen: each change is drawn in the colour of the
// answer that caused it, so "your deadline" is amber here as it is everywhere else.
const CHANGE_LABEL = {
  material: "Your material",
  horizon: "Your deadline",
  struggle: "What’s in your way",
  task: "What you’ll do with it",
  subject: "Your subject",
};
const ADJUSTED_FOR = {
  material: "your material",
  horizon: "your deadline",
  struggle: "what’s in your way",
  task: "what you’ll do with it",
  subject: "your subject",
};

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

function renderChange(change) {
  return el("li", { className: "plan-change", attrs: { "data-kind": change.kind } }, [
    renderIcon(change.kind),
    el("div", {}, [
      el("span", { className: "why-category", text: CHANGE_LABEL[change.kind] }),
      el("p", { className: "why-text", text: change.summary }),
    ]),
  ]);
}

function renderStepList(plan) {
  const items = plan.steps.map((step, index) => el("li", step.adjustedFor ? { attrs: { "data-kind": step.adjustedFor[0].kind } } : {}, [
    el("span", { className: "plan-step-name", text: `${index + 1}. ${step.title}` }),
    el("span", { className: "plan-step-time", text: step.minutes > 0 ? `${step.minutes} min` : "no timer" }),
  ]));
  return el("details", { className: "plan-steps" }, [
    el("summary", { text: `See the ${plural(plan.steps.length, "step")}` }),
    el("ol", { className: "plan-step-list" }, items),
  ]);
}

/**
 * The “Your plan” part of a result card: how many steps and minutes this student's session will have, what changed
 * because of their answers, and the steps themselves (folded away). A method with no rules, or answers it needs no
 * change for, says so instead of implying it was tailored.
 */
export function renderPlanPreview(method, plan) {
  const { steps, minutes } = planSummary(plan);
  const adjusts = Array.isArray(method.adapt) && method.adapt.length > 0;
  const standardNote = adjusts ? "Your answers fit the standard steps as written." : "These are the method’s standard steps.";
  return el("section", { className: "your-plan", attrs: { "data-kind": "plan" } }, [
    el("h4", { text: "Your plan" }),
    el("div", { className: "plan-summary" }, [
      renderIcon("plan"),
      el("ul", { className: "plan-chips" }, [
        el("li", { text: plural(steps, "step") }),
        el("li", { text: `about ${minutes} min` }),
      ]),
    ]),
    ...(plan.changes.length > 0 ? [el("ul", { className: "plan-changes" }, plan.changes.map(renderChange))] : [el("p", { className: "plan-standard", text: standardNote })]),
    renderStepList(plan),
  ]);
}

/** One note per answer that changed this step, saying which answer and why; nothing for a step that is as written. */
export function renderAdjustedNotes(step) {
  return (step.adjustedFor ?? []).map((mark) => el("div", { className: "step-adjusted", attrs: { "data-kind": mark.kind } }, [
    renderIcon(mark.kind),
    el("div", {}, [
      el("p", { className: "adjusted-label", text: `Adjusted for ${ADJUSTED_FOR[mark.kind]}` }),
      el("p", { className: "adjusted-because", text: mark.because }),
    ]),
  ]));
}
