import { button, el } from "./dom.js";
import { renderIcon } from "./icons.js";
import { makePlan, personalizableQuestions } from "./plan.js";
import { renderPlanPreview } from "./plan-view.js";
import { ALL_QUESTIONS } from "./questions.js";

/**
 * An optional offer, for a student who picked a method themselves with no quiz, to fit its session to their situation.
 * It is one line on the page: a button that opens a dialog over the page, so nothing behind it grows or moves. The
 * dialog has one question per thing the method can adjust to, each answerable or skippable, shows the resulting plan
 * as they choose, and keeps its start button in view while the questions scroll.
 * `state` is { choices, fromQuiz } and belongs to the caller so it survives the screen being redrawn;
 * `getSituation()` gives the rest of the situation (the subject); onStart(situation) begins the personalized session.
 * Returns null for a method with nothing to adjust.
 */
export function renderPersonalizer({ method, state, getSituation, onStart }) {
  const questionIds = personalizableQuestions(method);
  if (questionIds.length === 0) return null;

  const situation = () => ({ ...getSituation(), ...state.choices });
  const preview = el("div", { className: "personalize-preview" });
  const refresh = () => preview.replaceChildren(renderPlanPreview(method, makePlan(method, situation())));

  const groups = questionIds.map((id) => {
    const question = ALL_QUESTIONS.find((q) => q.id === id);
    const chips = question.options.map((option) => {
      const chip = el("button", { className: "pick", text: option.label, attrs: { type: "button", "aria-pressed": String(state.choices[id] === option.id) } });
      chip.addEventListener("click", () => {
        if (state.choices[id] === option.id) delete state.choices[id];
        else state.choices[id] = option.id;
        chips.forEach((other) => other.setAttribute("aria-pressed", String(other === chip && state.choices[id] === option.id)));
        refresh();
      });
      return chip;
    });
    return el("fieldset", { className: "personalize-question", attrs: { "data-kind": id } }, [
      el("legend", {}, [renderIcon(id), question.prompt]),
      el("div", { className: "picks" }, chips),
    ]);
  });
  refresh();

  const titleId = `personalize-${method.id}`;
  const close = el("button", { className: "personalize-close", text: "×", attrs: { type: "button", "aria-label": "Close without starting" } });
  const dialog = el("dialog", { className: "personalize-dialog", attrs: { "aria-labelledby": titleId } }, [
    el("header", { className: "personalize-head" }, [
      el("div", {}, [el("h3", { text: "Fit it to my situation", attrs: { id: titleId } }), el("p", { className: "personalize-method", text: method.name })]),
      close,
    ]),
    el("div", { className: "personalize-body" }, [
      el("p", { className: "personalize-lead", text: state.fromQuiz ? "Filled in from your quiz answers. Change or clear any of them." : "Answer any of these, or none. A question you skip changes nothing." }),
      ...groups,
      preview,
    ]),
    el("div", { className: "personalize-actions" }, [button("Start with my plan", { primary: true, onClick: () => { dialog.close(); onStart(situation()); } })]),
  ]);
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }); // a tap on the dimmed page behind

  const open = el("button", { className: "btn personalize-open", attrs: { type: "button" } }, [renderIcon("plan"), "Fit it to my situation ", el("span", { className: "optional", text: "optional" })]);
  open.addEventListener("click", () => dialog.showModal());
  return el("div", { className: "personalize", attrs: { "data-kind": "plan" } }, [open, dialog]);
}
