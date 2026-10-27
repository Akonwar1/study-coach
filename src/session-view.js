import { button, el } from "./dom.js";
import { describeFit } from "./library.js";
import { formatClock, goToStep, isTimerRunning, pauseTimer, previousStep, remainingMs, resetTimer, skipStep, startTimer, stepRemainingMs } from "./session.js";
import { renderStepStrip, renderVisual } from "./visuals.js";

const APP_TITLE = "Study Coach";
const MINUTE_MS = 60_000;
let tickHandle = null;
// Which panels are open, remembered between steps so reading the method's description is not undone by moving on.
const openPanels = { about: false, steps: false };

/** Stops the clock; call whenever the session screen is replaced. */
export function stopTicking() {
  clearInterval(tickHandle);
  tickHandle = null;
  document.title = APP_TITLE;
}

function panel(name, title, children) {
  const node = el("details", { className: `session-panel ${name}` }, [el("summary", { text: title }), ...children]);
  node.open = openPanels[name];
  node.addEventListener("toggle", () => { openPanels[name] = node.open; });
  return node;
}

function renderAboutPanel(method, onReadMore) {
  const fit = describeFit(method);
  return panel("about", "About this method", [
    el("p", { className: "panel-lead", text: method.tagline }),
    el("h4", { className: "panel-heading", text: "What it is" }),
    el("p", { text: method.def }),
    el("h4", { className: "panel-heading", text: "In plain terms" }),
    el("p", { text: method.why.intuition }),
    el("h4", { className: "panel-heading", text: "What the research says" }),
    el("p", { text: method.why.science }),
    el("p", { className: "library-fit" }, [el("strong", { text: "Helps when: " }), fit.struggle]),
    el("p", { className: "library-fit" }, [el("strong", { text: "Suits: " }), fit.material]),
    ...(onReadMore ? [button(`Read the full page on ${method.name}`, { onClick: onReadMore })] : []),
  ]);
}

const STATUS_LABEL = { done: "Done", skipped: "Skipped", todo: "" };

function renderStepsPanel(steps, session, onPick) {
  const items = steps.map((step, index) => {
    const isCurrent = index === session.stepIndex;
    const status = isCurrent ? "You are here" : STATUS_LABEL[session.statuses[index]];
    const row = el("button", {
      className: `step-row${isCurrent ? " current" : ""}`,
      attrs: { type: "button", ...(isCurrent ? { "aria-current": "step" } : {}) },
    }, [
      el("span", { className: "step-row-title", text: `${index + 1}. ${step.title}` }),
      el("span", { className: "step-row-meta", text: [step.minutes > 0 ? `${step.minutes} min` : "no timer", status].filter(Boolean).join(" · ") }),
    ]);
    row.addEventListener("click", () => onPick(index));
    return el("li", {}, [row]);
  });
  return panel("steps", "All steps", [el("ol", { className: "step-list" }, items)]);
}

/** A two-step "are you sure" for ending the session early, so one stray tap cannot end it. */
function renderFinishEarly(onFinishEarly) {
  const ask = el("button", { className: "link-btn", text: "Finish early", attrs: { type: "button" } });
  const confirm = el("div", { className: "confirm-row", attrs: { hidden: "" } }, [
    el("span", { text: "End this session now?" }),
    button("Yes, finish", { onClick: onFinishEarly }),
  ]);
  const keep = button("Keep going", {
    onClick: () => {
      confirm.hidden = true;
      ask.hidden = false;
    },
  });
  confirm.append(keep);
  ask.addEventListener("click", () => {
    ask.hidden = true;
    confirm.hidden = false;
  });
  return [ask, confirm];
}

/**
 * Shows one step of a guided session and returns the screen's element.
 * `steps` are the method's steps already tailored to the subject (see tailor.js).
 * onUpdate(session) is called with every change so the caller can save and redraw;
 * onNext() moves on (the caller decides when the session is finished); onFinishEarly() ends it now;
 * onReadMore() (optional) opens the method's in-depth page; onLeave() goes home with the session saved.
 */
export function renderSession({ method, steps, subject, subjectLabel, session, onUpdate, onNext, onFinishEarly, onReadMore, onLeave }) {
  stopTicking();
  const now = Date.now();
  const step = steps[session.stepIndex];
  const visual = step.visual ? renderVisual(step.visual, { subject }) : null;
  const fractions = steps.map((s, index) => {
    const left = stepRemainingMs(session, index, now);
    return left === null ? 0 : 1 - left / (s.minutes * MINUTE_MS);
  });
  const goTo = (index) => onUpdate(goToStep(method, session, index, Date.now()));
  const strip = renderStepStrip(steps, session.stepIndex, { statuses: session.statuses, fractions, onPick: goTo });
  const isLastStep = session.stepIndex === steps.length - 1;

  const clock = el("p", { className: "clock", attrs: { role: "timer" } });
  const status = el("p", { className: "clock-status" });
  const toggle = button("", {
    primary: true,
    onClick: () => {
      const clicked = Date.now();
      onUpdate(isTimerRunning(session) ? pauseTimer(session, clicked) : startTimer(session, clicked));
    },
  });
  const reset = el("button", { className: "link-btn compact", text: "Reset timer", attrs: { type: "button" } });
  reset.addEventListener("click", () => onUpdate(resetTimer(method, session)));

  function refreshTimer() {
    const left = remainingMs(session, Date.now());
    const full = step.minutes * MINUTE_MS;
    clock.textContent = formatClock(left);
    const finished = left === 0;
    const fraction = 1 - left / full;
    strip.update(fraction);
    visual?.update?.(fraction);
    const running = isTimerRunning(session) && !finished;
    clock.classList.toggle("running", running);
    clock.classList.toggle("finished", finished);
    toggle.hidden = finished;
    reset.hidden = left === full;
    toggle.textContent = running ? "Pause timer" : left < full ? "Resume timer" : "Start timer";
    status.textContent = finished ? "Time’s up. Move on when you’re ready." : running ? "" : "Timer paused. Press start when you begin this step.";
    document.title = finished ? `Time’s up · ${APP_TITLE}` : APP_TITLE;
  }

  const hasTimer = session.timers[session.stepIndex] !== null;
  const timerBlock = hasTimer ? [el("div", { className: "timer-block" }, [clock, status, toggle, reset])] : [];
  if (hasTimer) {
    refreshTimer();
    tickHandle = setInterval(refreshTimer, 500);
  }

  const back = button("Back", { disabled: session.stepIndex === 0, onClick: () => onUpdate(previousStep(method, session, Date.now())) });
  const next = button(isLastStep ? "Finish session" : "Next step", { primary: true, onClick: onNext });
  const skip = el("button", { className: "link-btn", text: "Skip this step", attrs: { type: "button" } });
  skip.addEventListener("click", () => onUpdate(skipStep(session, Date.now())));
  const leave = el("button", { className: "link-btn", text: "Pause and exit (you can resume later)", attrs: { type: "button" } });
  leave.addEventListener("click", onLeave);

  return el("section", { className: "session" }, [
    el("p", { className: "progress", text: `${method.name}${subjectLabel ? ` for ${subjectLabel}` : ""} · step ${session.stepIndex + 1} of ${steps.length}` }),
    strip.node,
    el("div", { className: "session-panels" }, [renderAboutPanel(method, onReadMore), renderStepsPanel(steps, session, goTo)]),
    el("h2", { text: step.title }),
    ...(visual ? [el("div", { className: "visual-wrap" }, [visual.node])] : []),
    el("p", { className: "instruction", text: step.instruction }),
    ...(step.mindset ? [el("div", { className: "step-note mindset" }, [el("p", { className: "mindset-label", text: "How to think about it" }), el("p", { text: step.mindset })])] : []),
    ...(step.example ? [el("p", { className: "step-note example", text: `Example: ${step.example}` })] : []),
    ...(step.tip ? [el("p", { className: "step-note tip", text: `Tip: ${step.tip}` })] : []),
    ...timerBlock,
    el("div", { className: "nav-row" }, [back, next]),
    el("div", { className: "session-exits" }, [...(isLastStep ? [] : [skip]), ...renderFinishEarly(onFinishEarly), leave]),
  ]);
}
