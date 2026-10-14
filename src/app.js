import { button, el } from "./dom.js";
import { METHODS } from "./methods.js";
import { QUESTIONS } from "./questions.js";
import { recommend, validateAnswers } from "./recommend.js";
import { elapsedMinutes, isComplete, isResumable, nextStep, startSession } from "./session.js";
import { renderSession, stopTicking } from "./session-view.js";
import { addHistoryEntry, clearActiveSession, loadActiveSession, loadHistory, saveActiveSession } from "./storage.js";

const main = document.getElementById("main");
const methodById = (id) => METHODS.find((m) => m.id === id);

let answers = {};
let stepIndex = 0; // which question we're on; QUESTIONS.length means "show results"
let errorMessage = "";
let activeSession = null; // the guided session on screen, or null
let finishedEntry = null; // the session just completed, for the "well done" screen
let saveFailed = false;

function show(...nodes) {
  main.replaceChildren(...nodes);
  window.scrollTo({ top: 0 });
}

// ---------- home: questions, resume banner, recent sessions ----------

function savedSession() {
  const session = loadActiveSession();
  return isResumable(session, METHODS) ? session : null;
}

function renderResumeBanner(session) {
  const method = methodById(session.methodId);
  return el("div", { className: "banner" }, [
    el("p", { className: "banner-title", text: `Session in progress: ${method.name}` }),
    el("p", { className: "banner-detail", text: `You were on step ${session.stepIndex + 1} of ${method.session.length}.` }),
    el("div", { className: "banner-actions" }, [
      button("Resume", { primary: true, onClick: () => openSession(session) }),
      button("Discard", {
        onClick: () => {
          clearActiveSession();
          render();
        },
      }),
    ]),
  ]);
}

function renderHistory() {
  const history = loadHistory();
  if (history.length === 0) return null;
  const rows = history.slice(0, 5).map((entry) =>
    el("li", {}, [
      el("span", { className: "history-method", text: entry.methodName }),
      el("span", { className: "history-meta", text: `${new Date(entry.completedAt).toLocaleDateString()} · ${entry.minutes} min` }),
    ]),
  );
  return el("section", { className: "history" }, [
    el("h3", { text: "Recent sessions" }),
    el("ul", { className: "history-list" }, rows),
  ]);
}

function renderQuestion() {
  const question = QUESTIONS[stepIndex];
  const isLast = stepIndex === QUESTIONS.length - 1;
  const selected = answers[question.id];

  const options = question.options.map((option) => {
    const choice = el("button", {
      className: "option",
      attrs: { type: "button", "aria-pressed": String(selected === option.id) },
    }, [
      el("span", { className: "option-label", text: option.label }),
      ...(option.hint ? [el("span", { className: "option-hint", text: option.hint })] : []),
    ]);
    choice.addEventListener("click", () => {
      answers[question.id] = option.id;
      errorMessage = "";
      render();
    });
    return choice;
  });

  const back = button("Back", {
    disabled: stepIndex === 0,
    onClick: () => {
      stepIndex -= 1;
      errorMessage = "";
      render();
    },
  });

  const next = button(isLast ? "Get my recommendation" : "Next", {
    primary: true,
    onClick: () => {
      if (!selected) {
        errorMessage = "Please choose an answer to continue.";
      } else if (isLast) {
        errorMessage = validateAnswers(answers) ?? "";
        if (!errorMessage) stepIndex = QUESTIONS.length;
      } else {
        stepIndex += 1;
        errorMessage = "";
      }
      render();
    },
  });

  const resumable = stepIndex === 0 ? savedSession() : null;
  const history = stepIndex === 0 ? renderHistory() : null;

  show(
    ...(resumable ? [renderResumeBanner(resumable)] : []),
    el("section", { className: "question" }, [
      el("p", { className: "progress", text: `Question ${stepIndex + 1} of ${QUESTIONS.length}` }),
      el("div", { className: "progress-bar" }, [
        el("span", { attrs: { style: `width:${((stepIndex + 1) / QUESTIONS.length) * 100}%` } }),
      ]),
      el("h2", { text: question.prompt }),
      el("div", { className: "options", attrs: { role: "group", "aria-label": question.prompt } }, options),
      ...(errorMessage ? [el("p", { className: "error", text: errorMessage, attrs: { role: "alert" } })] : []),
      el("div", { className: "nav-row" }, [back, next]),
    ]),
    ...(history ? [history] : []),
  );
}

// ---------- results ----------

function renderResultCard({ method, reasons }, rank) {
  const isTop = rank === 0;
  const startAction = button("Start guided session", { primary: true, onClick: () => beginSession(method) });

  return el("article", { className: `result-card${isTop ? " top" : ""}` }, [
    el("p", { className: "badge", text: isTop ? "Start with this" : "Also worth trying" }),
    el("h3", { text: method.name }),
    el("p", { className: "method-tagline", text: method.tagline }),
    el("span", { className: "duration", text: `about ${method.minutes} min per session` }),
    el("p", { text: method.def }),
    el("ul", { className: "reasons" }, reasons.map((reason) => el("li", { text: reason }))),
    el("h4", { className: "steps-title", text: "How to do it" }),
    el("ol", { className: "steps" }, method.steps.map((step) => el("li", { text: step }))),
    el("p", { className: "evidence", text: method.evidence }),
    el("div", { className: "card-action" }, [startAction]),
  ]);
}

function renderResults() {
  show(
    el("p", { className: "results-intro", text: "Based on your answers, here is where I’d start." }),
    ...recommend(answers).map(renderResultCard),
    el("div", { className: "nav-row" }, [
      button("Change my answers", {
        onClick: () => {
          stepIndex = 0;
          render();
        },
      }),
      button("Start over", {
        primary: true,
        onClick: () => {
          answers = {};
          stepIndex = 0;
          render();
        },
      }),
    ]),
  );
}

// ---------- guided session ----------

function beginSession(method) {
  openSession(startSession(method, Date.now()));
}

function openSession(session) {
  activeSession = session;
  saveFailed = !saveActiveSession(session);
  render();
}

function updateSession(session) {
  openSession(session);
}

function advanceSession() {
  const method = methodById(activeSession.methodId);
  const moved = nextStep(method, activeSession);
  if (isComplete(method, moved)) finishSession(method);
  else updateSession(moved);
}

function finishSession(method) {
  const now = Date.now();
  finishedEntry = {
    methodId: method.id,
    methodName: method.name,
    startedAt: activeSession.startedAt,
    completedAt: now,
    minutes: elapsedMinutes(activeSession, now),
  };
  saveFailed = !addHistoryEntry(finishedEntry);
  clearActiveSession();
  activeSession = null;
  render();
}

function leaveSession() {
  activeSession = null;
  stepIndex = 0;
  render();
}

function renderSessionScreen() {
  const method = methodById(activeSession.methodId);
  const screen = renderSession({
    method,
    session: activeSession,
    onUpdate: updateSession,
    onNext: advanceSession,
    onLeave: leaveSession,
  });
  show(
    ...(saveFailed ? [el("p", { className: "error", text: "This browser couldn’t save your progress, so closing the tab will lose this session." })] : []),
    screen,
  );
}

function renderDone() {
  const entry = finishedEntry;
  show(
    el("section", { className: "done" }, [
      el("p", { className: "badge", text: "Session complete" }),
      el("h2", { text: `Nice work. You finished ${entry.methodName}.` }),
      el("p", { text: `That took about ${entry.minutes} minute${entry.minutes === 1 ? "" : "s"}.` }),
      el("p", {
        className: saveFailed ? "error" : "saved-note",
        text: saveFailed ? "This browser couldn’t save the session to your history." : "Saved to your recent sessions.",
      }),
      el("div", { className: "nav-row" }, [
        button("Study again", {
          onClick: () => {
            finishedEntry = null;
            stepIndex = 0;
            render();
          },
        }),
      ]),
    ]),
  );
}

function render() {
  stopTicking(); // only the session screen runs a clock, and it restarts its own
  if (activeSession) renderSessionScreen();
  else if (finishedEntry) renderDone();
  else if (stepIndex >= QUESTIONS.length) renderResults();
  else renderQuestion();
}

render();
