import { button, el } from "./dom.js";
import { formatClock, isTimerRunning, pauseTimer, previousStep, remainingMs, startTimer } from "./session.js";
import { renderStepStrip, renderVisual } from "./visuals.js";

const APP_TITLE = "Study Coach";
let tickHandle = null;

/** Stops the clock; call whenever the session screen is replaced. */
export function stopTicking() {
  clearInterval(tickHandle);
  tickHandle = null;
  document.title = APP_TITLE;
}

/**
 * Shows one step of a guided session and returns the screen's element.
 * `steps` are the method's steps already tailored to the subject (see tailor.js).
 * onUpdate(session) is called with every change so the caller can save and redraw;
 * onNext() moves on (the caller decides when the session is finished); onLeave() goes home.
 */
export function renderSession({ method, steps, subject, subjectLabel, session, onUpdate, onNext, onLeave }) {
  stopTicking();
  const step = steps[session.stepIndex];
  const visual = step.visual ? renderVisual(step.visual, { subject }) : null;
  const strip = renderStepStrip(steps, session.stepIndex);
  const isLastStep = session.stepIndex === steps.length - 1;

  const clock = el("p", { className: "clock", attrs: { role: "timer" } });
  const status = el("p", { className: "clock-status" });
  const toggle = button("", {
    primary: true,
    onClick: () => {
      const now = Date.now();
      onUpdate(isTimerRunning(session) ? pauseTimer(session, now) : startTimer(session, now));
    },
  });

  function refreshTimer() {
    const left = remainingMs(session, Date.now());
    clock.textContent = formatClock(left);
    const finished = left === 0;
    const fraction = 1 - left / (step.minutes * 60_000);
    strip.update(fraction);
    visual?.update?.(fraction);
    const running = isTimerRunning(session) && !finished;
    clock.classList.toggle("running", running);
    clock.classList.toggle("finished", finished);
    toggle.hidden = finished;
    toggle.textContent = running ? "Pause timer" : left < step.minutes * 60_000 ? "Resume timer" : "Start timer";
    status.textContent = finished ? "Time’s up. Move on when you’re ready." : running ? "" : "Timer paused. Press start when you begin this step.";
    document.title = finished ? `Time’s up · ${APP_TITLE}` : APP_TITLE;
  }

  const timerBlock = session.timer ? [el("div", { className: "timer-block" }, [clock, status, toggle])] : [];
  if (session.timer) {
    refreshTimer();
    tickHandle = setInterval(refreshTimer, 500);
  }

  const back = button("Back", { disabled: session.stepIndex === 0, onClick: () => onUpdate(previousStep(method, session)) });
  const next = button(isLastStep ? "Finish session" : "Next step", { primary: true, onClick: onNext });
  const leave = el("button", { className: "link-btn", text: "Leave for now (you can resume later)", attrs: { type: "button" } });
  leave.addEventListener("click", onLeave);

  return el("section", { className: "session" }, [
    el("p", { className: "progress", text: `${method.name}${subjectLabel ? ` for ${subjectLabel}` : ""} · step ${session.stepIndex + 1} of ${steps.length}` }),
    strip.node,
    el("h2", { text: step.title }),
    ...(visual ? [el("div", { className: "visual-wrap" }, [visual.node])] : []),
    el("p", { className: "instruction", text: step.instruction }),
    ...(step.example ? [el("p", { className: "step-note example", text: `Example: ${step.example}` })] : []),
    ...(step.tip ? [el("p", { className: "step-note tip", text: `Tip: ${step.tip}` })] : []),
    ...timerBlock,
    el("div", { className: "nav-row" }, [back, next]),
    leave,
  ]);
}
