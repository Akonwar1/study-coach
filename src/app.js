import { button, el } from "./dom.js";
import { GOAL_RANGE_TEXT, buildEntry, cleanEntries, parseGoalHours, shouldLogStopped } from "./history.js";
import { renderHistoryScreen } from "./history-view.js";
import { FILTER_GROUPS, NO_FILTERS, describeFit, filterMethods, hasActiveFilters } from "./library.js";
import { METHODS } from "./methods.js";
import { ALL_QUESTIONS, SUBJECT_QUESTION } from "./questions.js";
import { recommend, validateAnswers } from "./recommend.js";
import { isComplete, isResumable, nextStep, startSession } from "./session.js";
import { renderSession, stopTicking } from "./session-view.js";
import { resolveSteps } from "./tailor.js";
import {
  addHistoryEntry, clearActiveSession, deleteHistoryEntry, loadActiveSession, loadHistory, loadWeeklyGoal, saveActiveSession, saveWeeklyGoal,
} from "./storage.js";

const HISTORY_PAGE_SIZE = 20;
const main = document.getElementById("main");
const methodById = (id) => METHODS.find((m) => m.id === id);

const VIEWS = ["coach", "library", "history"];
let view = VIEWS.find((id) => location.hash === `#${id}`) ?? "coach";
let libraryFilters = { ...NO_FILTERS };
let answers = {};
let stepIndex = 0; // which question we're on; ALL_QUESTIONS.length means "show results"
let errorMessage = "";
let activeSession = null; // the guided session on screen, or null
let finishedEntry = null; // the session just completed, for the "well done" screen
let saveFailed = false;
let goalError = "";
let pendingDeleteKey = null; // the history entry waiting for "Yes, delete"
let historyVisibleCount = HISTORY_PAGE_SIZE;

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
          logStoppedSession(session);
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
      el("span", { className: "history-meta", text: `${new Date(entry.completedAt).toLocaleDateString()} · ${entry.minutes} min${entry.completed === false ? " · stopped early" : ""}` }),
    ]),
  );
  return el("section", { className: "history" }, [
    el("h3", { text: "Recent sessions" }),
    el("ul", { className: "history-list" }, rows),
  ]);
}

function renderQuestion() {
  const question = ALL_QUESTIONS[stepIndex];
  const isLast = stepIndex === ALL_QUESTIONS.length - 1;
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
        if (!errorMessage) stepIndex = ALL_QUESTIONS.length;
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
      el("p", { className: "progress", text: `Question ${stepIndex + 1} of ${ALL_QUESTIONS.length}` }),
      el("div", { className: "progress-bar" }, [
        el("span", { attrs: { style: `width:${((stepIndex + 1) / ALL_QUESTIONS.length) * 100}%` } }),
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

function renderHowTo(method) {
  return [
    el("h4", { className: "steps-title", text: "How to do it" }),
    el("ol", { className: "steps" }, method.steps.map((step) => el("li", { text: step }))),
    el("p", { className: "evidence", text: method.evidence }),
  ];
}

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
    ...renderHowTo(method),
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

/** Logs a session that is being abandoned, but only if enough of it was done to count as study. */
function logStoppedSession(session) {
  const method = methodById(session.methodId);
  const now = Date.now();
  if (shouldLogStopped(method, session, now)) addHistoryEntry(buildEntry({ method, session, now, completed: false }));
}

function beginSession(method) {
  const replaced = savedSession(); // starting fresh replaces a session that was left unfinished
  if (replaced) logStoppedSession(replaced);
  openSession(startSession(method, Date.now(), answers.subject));
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
  finishedEntry = buildEntry({ method, session: activeSession, now, completed: true });
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
  const subject = SUBJECT_QUESTION.options.find((option) => option.id === activeSession.subject);
  const screen = renderSession({
    method,
    steps: resolveSteps(method, activeSession.subject),
    subject: activeSession.subject,
    subjectLabel: subject && subject.id !== "other" ? subject.label : "",
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

// ---------- method library ----------

function renderFilterSelect(group) {
  const id = `filter-${group.id}`;
  const select = el("select", { attrs: { id } }, [
    el("option", { text: "Any", attrs: { value: "" } }),
    ...group.options.map((option) => el("option", { text: option.label, attrs: { value: option.id } })),
  ]);
  select.value = libraryFilters[group.id];
  select.addEventListener("change", () => {
    libraryFilters = { ...libraryFilters, [group.id]: select.value };
    render();
  });
  return el("div", { className: "filter-field" }, [el("label", { text: group.prompt, attrs: { for: id } }), select]);
}

function renderSubjectPicker() {
  const select = el("select", { attrs: { id: "library-subject" } }, SUBJECT_QUESTION.options.map((option) =>
    el("option", { text: option.label, attrs: { value: option.id } }),
  ));
  select.value = answers.subject ?? "other";
  select.addEventListener("change", () => {
    answers.subject = select.value;
  });
  return el("div", { className: "filter-field" }, [
    el("label", { text: "Subject for guided sessions", attrs: { for: "library-subject" } }),
    select,
  ]);
}

function renderLibraryCard(method) {
  const fit = describeFit(method);
  return el("article", { className: "library-card" }, [
    el("div", { className: "library-card-head" }, [
      el("h3", { text: method.name }),
      el("span", { className: "duration", text: `~${method.minutes} min` }),
    ]),
    el("p", { className: "method-tagline", text: method.tagline }),
    el("ul", { className: "tags", attrs: { "aria-label": "Tags" } }, [
      ...method.tags.helps.map((tag) => el("li", { className: "tag helps", text: tag })),
      ...method.tags.how.map((tag) => el("li", { className: "tag how", text: tag })),
    ]),
    el("details", {}, [
      el("summary", { text: "Details and steps" }),
      el("p", { text: method.def }),
      el("p", { className: "library-fit" }, [el("strong", { text: "Helps when: " }), fit.struggle]),
      el("p", { className: "library-fit" }, [el("strong", { text: "Suits: " }), fit.material]),
      ...renderHowTo(method),
    ]),
    button("Start guided session", { primary: true, onClick: () => beginSession(method) }),
  ]);
}

function renderLibrary() {
  const matches = filterMethods(METHODS, libraryFilters);
  const clear = button("Clear filters", {
    onClick: () => {
      libraryFilters = { ...NO_FILTERS };
      render();
    },
  });
  const cards = matches.length
    ? el("div", { className: "library-grid" }, matches.map(renderLibraryCard))
    : el("p", { className: "empty", text: "No methods match all of those filters. Try choosing “Any” for one of them." });

  show(
    el("section", { className: "library" }, [
      el("h2", { text: "Method library" }),
      el("div", { className: "library-filters" }, [...FILTER_GROUPS.map(renderFilterSelect), renderSubjectPicker()]),
      el("div", { className: "library-status" }, [
        el("p", { className: "library-count", text: `Showing ${matches.length} of ${METHODS.length} methods`, attrs: { role: "status" } }),
        ...(hasActiveFilters(libraryFilters) ? [clear] : []),
      ]),
      el("p", { className: "tag-key" }, [
        el("span", { className: "tag helps", text: "Filled" }), " tags: what it helps with. ",
        el("span", { className: "tag how", text: "Outlined" }), " tags: how it works.",
      ]),
      cards,
    ]),
  );
}

// ---------- history tab ----------

function renderHistoryTab() {
  const handlers = {
    onSetGoal(text) {
      const minutes = parseGoalHours(text);
      if (minutes === null) {
        goalError = `Enter a number of hours between ${GOAL_RANGE_TEXT}.`;
      } else {
        goalError = saveWeeklyGoal(minutes) ? "" : "This browser couldn’t save your goal.";
      }
      render();
    },
    onClearGoal() {
      goalError = saveWeeklyGoal(null) ? "" : "This browser couldn’t remove your goal.";
      render();
    },
    onAskDelete(key) {
      pendingDeleteKey = key;
      render();
    },
    onCancelDelete() {
      pendingDeleteKey = null;
      render();
    },
    onConfirmDelete(entry) {
      pendingDeleteKey = null;
      deleteHistoryEntry(entry);
      render();
    },
    onShowMore() {
      historyVisibleCount += HISTORY_PAGE_SIZE;
      render();
    },
    onGoCoach: () => switchView("coach"),
  };
  show(renderHistoryScreen({
    entries: cleanEntries(loadHistory()),
    now: Date.now(),
    goalMinutes: loadWeeklyGoal(),
    goalError,
    pendingDeleteKey,
    visibleCount: historyVisibleCount,
    handlers,
  }));
}

// ---------- tabs ----------

const TABS = [
  { id: "coach", label: "Coach me" },
  { id: "library", label: "Method library" },
  { id: "history", label: "History" },
];

function switchView(next) {
  view = next;
  history.replaceState(null, "", next === "coach" ? location.pathname + location.search : `#${next}`);
  goalError = "";
  pendingDeleteKey = null;
  activeSession = null; // an in-progress session is already saved and can be resumed from the coach tab
  finishedEntry = null;
  render();
}

function renderTabs() {
  const tabs = TABS.map((tab) => {
    const node = el("button", {
      className: "tab",
      text: tab.label,
      attrs: { type: "button", ...(view === tab.id ? { "aria-current": "page" } : {}) },
    });
    node.addEventListener("click", () => switchView(tab.id));
    return node;
  });
  document.getElementById("tabs").replaceChildren(...tabs);
}

function render() {
  stopTicking(); // only the session screen runs a clock, and it restarts its own
  renderTabs();
  document.querySelector(".app").classList.toggle("wide", view === "library" && !activeSession && !finishedEntry);
  if (activeSession) renderSessionScreen();
  else if (finishedEntry) renderDone();
  else if (view === "library") renderLibrary();
  else if (view === "history") renderHistoryTab();
  else if (stepIndex >= ALL_QUESTIONS.length) renderResults();
  else renderQuestion();
}

render();
