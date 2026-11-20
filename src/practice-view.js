// The Practice tab: a form for what to practise (class, subject, topic, study guide, extra notes, kinds of question,
// how many, how hard), then the AI-written questions to answer. Multiple choice and true/false are checked at once,
// with a note on why each choice is right or wrong. "Check my answer" on a written answer ticks off the key points it
// mentions and compares a problem's final number, in code (src/practice-check.js), then shows the model answer; the
// student marks it. Optional "Get AI feedback" sends every checked written answer still without feedback in one
// request. The AI is used sparingly on purpose: the student's free allowance is small (PLAN.md, 2026-11-15).
//
// Once a set exists, the form folds into an adjust bar that stays above the questions (level, kinds, how many, a
// focus, More settings opening the other fields in place), so the student can steer the set without starting over:
// Add to this set appends new questions and keeps the answers so far; Start a new set replaces them. Either way the
// AI is told which questions already exist, so it writes new ones (PLAN.md, 2026-11-15). Each question also offers
// More like this, Easier and Harder (new questions placed right below it) and Swap (a new one in its place), one AI
// request each, with the original question sent along so the AI can build on it. They are small tools on the
// question's top line, quieter than the question; once it is answered, one is outlined as a suggestion worked out in
// code from how the student did (missed: Easier; right: Harder).
//
// Every question shown is kept in a question bank in the browser (src/question-bank.js), filed under the class and
// topic it was asked for, with every result: right, close (a written answer marked Partly) or missed. "How you're
// doing", above the questions, lists the ideas practised on the set's topic, weakest first; "Your stats" (a second view
// of this tab, src/stats-view.js) shows every answer as plain numbers, filtered by class, subject area, topic and time,
// as the student asked (2026-11-15). All of it is plain code, with no AI request.
//
// The screen is built once and kept (see createPracticeScreen), so typed text survives switching tabs; parts redraw in
// place. The form, the set and the answers so far are also saved in the browser, so a reload keeps them.
import { button, el } from "./dom.js";
import { renderIcon } from "./icons.js";
import {
  cleanFeedbackRequest, cleanGroupRequest, cleanPracticeRequest, PRACTICE_DIFFICULTIES, PRACTICE_KINDS, PRACTICE_LIMITS, splitPromptCode, validatePracticeSet,
} from "./practice.js";
import { checkWrittenAnswer } from "./practice-check.js";
import { requestFeedback, requestGrouping, requestPracticeSet } from "./practice-client.js";
import {
  addQuestions, categoryFor, cleanBank, recordResult, setIdeaCategories, setTopicLabel, topicCategories, topicKey, topicStanding, ungroupedIdeas,
} from "./question-bank.js";
import { SUBJECT_QUESTION } from "./questions.js";
import { cleanStatsFilters, createStatsView } from "./stats-view.js";
import { loadPracticeState, loadQuestionBank, savePracticeState, saveQuestionBank } from "./storage.js";

const COUNTS = [3, 5, 8, 10];
const DEFAULT_FORM = { course: "", subject: "", topic: "", material: "", focus: "", kinds: ["multiple-choice", "short-answer"], count: 5, difficulty: "mixed" };
const GRADES = [
  { id: "got", label: "Got it" },
  { id: "partly", label: "Partly" },
  { id: "missed", label: "Missed it" },
];
const gradeLabel = (id) => GRADES.find((grade) => grade.id === id).label;
const isChoice = (question) => question.kind === "multiple-choice" || question.kind === "true-false";
// Per question: the choice picked, or for a written answer what is typed, whether it has been checked and shown,
// the text that was checked (so an edit can be spotted), the student's mark, and the AI's feedback with the text it
// was about. Older saved progress lacks the last two; `?? ""` / `?? null` below treat that as "not yet". Once the
// question is in the bank, its slot also holds `attempt` (names this answer, so a changed mark replaces its result)
// `about` (the class, topic and subject it is filed under) and `level` (the level the set was asked at).
const blankProgress = (set) => set.questions.map(() => ({ picked: null, typed: "", revealed: false, checkedTyped: null, grade: null, feedback: null }));
const kindLabel = (id) => PRACTICE_KINDS.find((kind) => kind.id === id).label;
const difficultyLabel = (id) => PRACTICE_DIFFICULTIES.find((option) => option.id === id).label;
// Shorter names for the levels in the adjust bar's chips, so the row fits on a phone.
const LEVEL_CHIP_LABELS = { intro: "Getting started", standard: "Like homework", challenging: "Like a hard exam", mixed: "A mix" };
// A set that has been added to can hold more questions, and more kinds, than its last request asked for, so a saved
// set is checked against these looser limits.
const SAVED_SET_LIMITS = { kinds: PRACTICE_KINDS.map((kind) => kind.id), count: PRACTICE_LIMITS.maxSet };

const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`;
const aboutOf = (request) => ({ course: request?.course ?? "", topic: request?.topic ?? "", subject: request?.subject ?? "" });
const newAttempt = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const VIEWS = [{ id: "practise", label: "Practise" }, { id: "stats", label: "Your stats" }];

/** The saved state if it still makes sense (a set that passes the check, one answer slot per question), else a fresh one. */
function restore(initialSubject) {
  const saved = loadPracticeState();
  // Which view is open, whether How you're doing is folded, and Your stats' filters: kept even without a set.
  const views = {
    view: saved?.view === "stats" || saved?.view === "standing" ? "stats" : "practise", // "standing" was its first name
    standingOpen: saved?.standingOpen !== false,
    statsFilters: cleanStatsFilters(saved?.statsFilters),
  };
  const fresh = { form: { ...DEFAULT_FORM, subject: initialSubject ?? "" }, set: null, progress: [], batches: [], lastRequest: null, formOpen: true, ...views };
  if (!saved || typeof saved !== "object") return fresh;
  const form = { ...fresh.form, ...(saved.form ?? {}) };
  const request = cleanPracticeRequest(saved.lastRequest ?? {});
  const checked = request.ok && saved.set ? validatePracticeSet(saved.set, { ...request.request, ...SAVED_SET_LIMITS }) : { ok: false };
  if (!checked.ok || !Array.isArray(saved.progress) || saved.progress.length !== checked.set.questions.length) return { ...fresh, form };
  const size = checked.set.questions.length;
  const batches = Array.isArray(saved.batches)
    ? saved.batches.filter((batch) => Number.isInteger(batch?.from) && batch.from >= 0 && batch.from < size && typeof batch.label === "string")
    : [];
  // The settings start folded once there is a set; they open from the adjust bar.
  return { form, set: checked.set, progress: saved.progress, batches, lastRequest: request.request, formOpen: false, ...views };
}

/**
 * Builds the Practice screen once and returns its element. `initialSubject` (the quiz's subject answer) fills the
 * subject field when nothing is saved yet.
 */
export function createPracticeScreen({ initialSubject } = {}) {
  const subject = SUBJECT_QUESTION.options.some((option) => option.id === initialSubject && option.id !== "other") ? initialSubject : "";
  // feedbackLoading: the questions whose answers are being read by the AI; feedbackErrors: a message per question.
  // attempted: the last { request, mode } sent, for Try again; announce: a line for the status area after adding.
  // changing: the question being changed from its own buttons ({ index, action }) or null; changeErrors: a message per question.
  const state = {
    ...restore(subject), status: "idle", error: "", formError: "", adjustError: "", announce: "", attempted: null,
    feedbackLoading: [], feedbackErrors: {}, changing: null, changeErrors: {}, bank: cleanBank(loadQuestionBank()),
  };
  // One AI request at a time on this tab, so buttons that would start another wait meanwhile.
  const busy = () => state.status === "loading" || state.feedbackLoading.length > 0 || state.changing !== null;
  // batches: where each added group of questions starts in the set ({ from, label }), so its first question can say how it was asked for.
  const save = () => savePracticeState({
    form: state.form, set: state.set, progress: state.progress, batches: state.batches, lastRequest: state.lastRequest, formOpen: state.formOpen,
    view: state.view, standingOpen: state.standingOpen, statsFilters: state.statsFilters,
  });

  // ---------- the question bank ----------

  /** Keeps the questions at `indexes` in the bank, filed under `request`'s class and topic, and tags their answer slots. */
  function fileInBank(indexes, request) {
    const about = aboutOf(request);
    addQuestions(state.bank, about, indexes.map((i) => state.set.questions[i]));
    indexes.forEach((i) => Object.assign(state.progress[i], { attempt: newAttempt(), about, level: request?.difficulty ?? null }));
    saveQuestionBank(state.bank);
  }
  /** Records how question `index` went, if it has been answered; a changed mark replaces the result it gave before. */
  function recordInBank(index) {
    const question = state.set.questions[index];
    const slot = state.progress[index];
    const result = outcome(question, slot);
    if (!result) return;
    recordResult(state.bank, slot.about ?? aboutOf(state.lastRequest), question, result, { attempt: slot.attempt ?? null, level: slot.level ?? state.lastRequest?.difficulty ?? null }); // slots filed before levels were kept use the set's
    saveQuestionBank(state.bank);
  }
  const range = (from, count) => Array.from({ length: count }, (_, i) => from + i);
  /** Question `index`'s broader category, as the bank knows it (so ideas grouped later show it too); "" if none. */
  function shownCategory(index) {
    const question = state.set.questions[index];
    const entry = state.bank.topics[topicKey(state.progress[index].about ?? aboutOf(state.lastRequest))];
    return entry ? categoryFor(entry, question) : question.category ?? "";
  }
  /**
   * Sorts a topic's ideas that have no category into broader ones, with one AI request that sends only the idea names
   * (and the class and topic). Resolves to {} or { message } on failure, when nothing changes.
   */
  async function groupIdeas(topic) {
    const about = { course: topic.course, topic: topic.topic };
    const cleaned = cleanGroupRequest({
      course: topic.course, topic: topic.topic,
      ideas: ungroupedIdeas(state.bank, about).slice(0, PRACTICE_LIMITS.groupIdeas),
      categories: topicCategories(state.bank, about),
    });
    if (!cleaned.ok) return { message: cleaned.error };
    const result = await requestGrouping(cleaned.request);
    if (result.error) return { message: result.message };
    setIdeaCategories(state.bank, about, result.groups);
    saveQuestionBank(state.bank);
    drawStanding();
    drawSet();
    return {};
  }
  // A bank cleaned on loading (an older version, see cleanBank) is saved at once, so the cleanup sticks.
  const savedBank = loadQuestionBank();
  if (savedBank && savedBank.version !== state.bank.version) saveQuestionBank(state.bank);
  // A set saved before the bank existed (or by another tab) is filed now, with the answers it already has.
  if (state.set) {
    const unfiled = state.progress.flatMap((slot, i) => (slot.attempt ? [] : [i]));
    if (unfiled.length > 0) {
      fileInBank(unfiled, state.lastRequest);
      unfiled.forEach(recordInBank);
      save();
    }
  }

  // ---------- the form ----------

  const field = (id, kind, labelText, control, extra = []) =>
    el("div", { className: "filter-field practice-field", attrs: { "data-kind": kind } }, [
      el("label", { attrs: { for: id } }, [renderIcon(kind), labelText]),
      control,
      ...extra,
    ]);
  const input = (id, key, placeholder, maxLength) => {
    const node = el("input", { attrs: { id, type: "text", placeholder, maxlength: String(maxLength), autocomplete: "off" } });
    node.value = state.form[key];
    node.addEventListener("input", () => { state.form[key] = node.value; save(); });
    return node;
  };
  const select = (id, key, options, toValue = String) => {
    const node = el("select", { attrs: { id } }, options.map(({ value, label }) => el("option", { text: label, attrs: { value: String(value) } })));
    node.value = String(state.form[key]);
    node.addEventListener("change", () => { state.form[key] = toValue(node.value); save(); });
    return node;
  };

  const material = el("textarea", { attrs: { id: "practice-material", rows: "5", placeholder: "Paste a study guide, lecture notes or a past exam. The questions will stick to it." } });
  material.value = state.form.material;
  const charCount = el("p", { className: "practice-count-chars", attrs: { "aria-live": "polite" } });
  const showCharCount = () => {
    const used = material.value.length;
    charCount.textContent = `${used.toLocaleString("en-US")} / ${PRACTICE_LIMITS.material.toLocaleString("en-US")} characters`;
    charCount.classList.toggle("over", used > PRACTICE_LIMITS.material);
  };
  material.addEventListener("input", () => { state.form.material = material.value; showCharCount(); save(); });
  showCharCount();

  const kindBoxes = PRACTICE_KINDS.map((kind) => {
    const box = el("input", { attrs: { type: "checkbox", name: "practice-kind", value: kind.id } });
    box.checked = state.form.kinds.includes(kind.id);
    box.addEventListener("change", () => {
      state.form.kinds = kindBoxes.filter(({ box: b }) => b.checked).map(({ kind: k }) => k.id);
      save();
    });
    return { kind, box };
  });

  const makeButton = el("button", { className: "btn primary", text: "Make questions", attrs: { type: "submit" } });
  const formError = el("p", { className: "error", attrs: { role: "alert" } });
  const form = el("form", { className: "practice-form", attrs: { novalidate: "" } }, [
    el("div", { className: "practice-fields" }, [
      field("practice-course", "course", "Class", input("practice-course", "course", "e.g. CS 124", PRACTICE_LIMITS.course)),
      field("practice-subject", "subject", "Subject area", select("practice-subject", "subject", [
        { value: "", label: "Any, or not sure" },
        ...SUBJECT_QUESTION.options.filter((option) => option.id !== "other").map((option) => ({ value: option.id, label: option.label })),
      ])),
      field("practice-topic", "material", "Topic", input("practice-topic", "topic", "e.g. recursion, the Krebs cycle, the French Revolution", PRACTICE_LIMITS.topic)),
    ]),
    field("practice-material", "notes", "Study guide or notes (optional)", material, [charCount]),
    field("practice-focus", "task", "Anything else? (optional)", input("practice-focus", "focus", "e.g. exam is open-book, focus on chapter 3, no calculators", PRACTICE_LIMITS.focus)),
    el("fieldset", { className: "practice-kinds", attrs: { "data-kind": "struggle" } }, [
      el("legend", {}, [renderIcon("sessions"), "Kinds of question"]),
      ...kindBoxes.map(({ kind, box }) => el("label", { className: "practice-kind" }, [
        box,
        el("span", { className: "practice-kind-text" }, [el("span", { className: "option-label", text: kind.label }), el("span", { className: "option-hint", text: kind.hint })]),
      ])),
    ]),
    el("div", { className: "practice-fields practice-size" }, [
      field("practice-count", "count", "How many", select("practice-count", "count", COUNTS.map((n) => ({ value: n, label: `${n} questions` })), Number)),
      field("practice-difficulty", "level", "How hard", select("practice-difficulty", "difficulty", PRACTICE_DIFFICULTIES.map((d) => ({ value: d.id, label: d.label })))),
    ]),
    el("p", { className: "practice-privacy", text: "What you type here is sent to Google’s Gemini AI to write the questions, and Google may use it to improve its products. Leave out anything private." }),
    formError,
    makeButton,
  ]);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.form.kinds = kindBoxes.filter(({ box }) => box.checked).map(({ kind }) => kind.id); // read the boxes as they are now
    const cleaned = cleanPracticeRequest({ ...state.form, categories: topicCategories(state.bank, state.form) });
    state.formError = !cleaned.ok ? cleaned.error : state.form.kinds.length === 0 ? "Pick at least one kind of question." : "";
    if (state.formError) { drawStatus(); return; }
    ask(cleaned.request, "new");
  });
  // The form's own fields that the adjust bar also shows, kept in step with it.
  const formFocus = form.querySelector("#practice-focus");
  const formCount = form.querySelector("#practice-count");
  const formDifficulty = form.querySelector("#practice-difficulty");
  formFocus.addEventListener("input", () => { adjustFocus.value = formFocus.value; });
  formCount.addEventListener("change", () => drawAdjust());
  formDifficulty.addEventListener("change", () => drawAdjust());
  kindBoxes.forEach(({ box }) => box.addEventListener("change", () => drawAdjust()));
  /** Puts the bar's choices into the form's fields, which are hidden while there is a set but used if it is cleared. */
  function syncForm() {
    kindBoxes.forEach(({ kind, box }) => { box.checked = state.form.kinds.includes(kind.id); });
    formCount.value = String(state.form.count);
    formDifficulty.value = state.form.difficulty;
    formFocus.value = state.form.focus;
  }

  // ---------- the adjust bar: steering the set without leaving it ----------

  /** Changes one setting from the bar, saves it, and redraws the bar. */
  function adjust(change) {
    Object.assign(state.form, change);
    save();
    syncForm();
    drawAdjust();
  }

  const adjustFocus = el("input", { attrs: { id: "practice-adjust-focus", type: "text", maxlength: String(PRACTICE_LIMITS.focus), autocomplete: "off", placeholder: "Optional: e.g. tail recursion, use Java, more like question 3" } });
  adjustFocus.value = state.form.focus;
  adjustFocus.addEventListener("input", () => { state.form.focus = adjustFocus.value; formFocus.value = adjustFocus.value; save(); });
  const adjustSummary = el("p", { className: "practice-adjust-summary" });
  const adjustControls = el("div", { className: "practice-adjust-controls" });
  const adjustActions = el("div", { className: "practice-adjust-actions" });
  const adjustError = el("p", { className: "error", attrs: { role: "alert" } });
  const adjustBar = el("section", { className: "practice-adjust", attrs: { "aria-label": "Adjust your practice" } }, [
    adjustSummary,
    adjustControls,
    el("div", { className: "practice-adjust-focus" }, [
      el("label", { className: "practice-adjust-label", text: "Focus on", attrs: { for: "practice-adjust-focus" } }),
      adjustFocus,
    ]),
    adjustError,
    adjustActions,
  ]);

  /** A labelled row of small toggle buttons in the bar. */
  const adjustRow = (label, children, className = "") =>
    el("div", { className: `practice-adjust-row ${className}`.trim(), attrs: { role: "group", "aria-label": label } }, [
      el("span", { className: "practice-adjust-label", text: label, attrs: { "aria-hidden": "true" } }),
      el("div", { className: "practice-adjust-options" }, children),
    ]);
  const chip = (label, pressed, onClick, { disabled = false, className = "" } = {}) => {
    const node = button(label, { onClick, disabled });
    node.classList.add("practice-chip");
    if (className) node.classList.add(className);
    node.setAttribute("aria-pressed", String(pressed));
    return node;
  };

  function drawAdjust() {
    adjustBar.hidden = !state.set;
    if (!state.set) return;
    const loading = state.status === "loading";
    adjustSummary.replaceChildren(el("strong", { text: "Practising: " }), describeRequest(state.form));
    adjustControls.replaceChildren(
      // Every level is a chip, chosen like kinds and how many; the student found Easier/Harder steppers confusing.
      adjustRow("Level", PRACTICE_DIFFICULTIES.map((option) =>
        chip(LEVEL_CHIP_LABELS[option.id], state.form.difficulty === option.id, () => adjust({ difficulty: option.id }), { className: "practice-level-chip" }))),
      adjustRow("Kinds", PRACTICE_KINDS.map((kind) => {
        const on = state.form.kinds.includes(kind.id);
        const onlyOne = on && state.form.kinds.length === 1; // at least one kind must stay chosen
        return chip(kind.label, on, () => adjust({ kinds: on ? state.form.kinds.filter((id) => id !== kind.id) : PRACTICE_KINDS.map((k) => k.id).filter((id) => id === kind.id || state.form.kinds.includes(id)) }), { disabled: onlyOne, className: "practice-kind-chip" });
      })),
      adjustRow("How many", COUNTS.map((n) => chip(String(n), state.form.count === n, () => adjust({ count: n }))), "practice-count-chips"),
    );
    const full = state.set.questions.length >= PRACTICE_LIMITS.maxSet;
    const more = button("More settings", { onClick: () => { state.formOpen = !state.formOpen; save(); drawStatus(); if (state.formOpen) form.querySelector("input")?.focus(); } });
    more.setAttribute("aria-expanded", String(state.formOpen));
    adjustActions.replaceChildren(
      button(loading && state.attempted?.mode === "add" ? "Adding questions…" : "Add to this set", { primary: true, disabled: busy() || full, onClick: () => askFromBar("add") }),
      button(loading && state.attempted?.mode === "new" ? "Making questions…" : "Start a new set", { disabled: busy(), onClick: () => askFromBar("new") }),
      more,
      ...(full ? [el("p", { className: "practice-adjust-note", text: `This set has ${PRACTICE_LIMITS.maxSet} questions, the most one set can hold. Start a new set for more.` })] : []),
    );
    adjustError.textContent = state.adjustError;
    adjustError.hidden = !state.adjustError;
  }

  /** Sends the bar's settings: "add" appends to the set, "new" replaces it. Either way the AI is told what is there. */
  function askFromBar(mode) {
    const avoid = state.set.questions.map((question) => question.prompt).slice(-PRACTICE_LIMITS.avoidCount);
    const cleaned = cleanPracticeRequest({ ...state.form, avoid, categories: topicCategories(state.bank, state.form) });
    state.adjustError = cleaned.ok ? "" : cleaned.error;
    if (!cleaned.ok) { drawAdjust(); return; }
    ask(cleaned.request, mode);
  }

  // ---------- status and errors ----------

  const status = el("p", { className: "practice-status", attrs: { role: "status" } });
  const errorBox = el("div", { className: "practice-error", attrs: { role: "alert" } });
  const setArea = el("section", { className: "practice-set", attrs: { "aria-label": "Your practice questions" } });

  function describeRequest(request) {
    return [request.course, request.topic, request.material && "your notes"].filter(Boolean).join(" · ") || "your own choice of topic";
  }

  function drawStatus() {
    const loading = state.status === "loading";
    form.hidden = Boolean(state.set) && !state.formOpen;
    form.classList.toggle("as-settings", Boolean(state.set)); // with a set, the bar holds kinds, count, level and focus
    makeButton.disabled = loading;
    makeButton.textContent = loading ? "Making questions…" : "Make questions";
    formError.textContent = state.formError;
    formError.hidden = !state.formError;
    status.textContent = loading ? "Writing your questions. This usually takes 5 to 30 seconds." : state.announce;
    status.hidden = !status.textContent;
    errorBox.hidden = state.status !== "error";
    if (state.status === "error") {
      errorBox.replaceChildren(el("p", { text: state.error }), button("Try again", { onClick: () => ask(state.attempted.request, state.attempted.mode) }));
    }
    drawAdjust();
  }

  /** The note on the first question of an added group: how it was asked for. */
  const batchLabel = (request) => ["Added", difficultyLabel(request.difficulty), request.focus && `Focus: ${request.focus}`].filter(Boolean).join(" · ");

  /**
   * Asks for questions. `mode` "new" replaces the set (or makes the first one); "add" appends to it, keeping every
   * answer so far, and moves the keyboard to the first new question. A failure leaves the set as it was.
   */
  async function ask(request, mode) {
    if (busy()) return;
    Object.assign(state, { status: "loading", attempted: { request, mode }, formError: "", adjustError: "", announce: "" });
    drawStatus();
    drawSet();
    const result = await requestPracticeSet(request);
    if (!result.set) {
      Object.assign(state, { status: "error", error: result.message });
      drawStatus();
      drawSet();
      return;
    }
    const adding = mode === "add" && state.set;
    if (adding) {
      const from = state.set.questions.length;
      const added = result.set.questions.slice(0, PRACTICE_LIMITS.maxSet - from);
      state.set = { ...state.set, questions: [...state.set.questions, ...added] };
      state.progress = [...state.progress, ...blankProgress({ questions: added })];
      state.batches = [...state.batches, { from, label: batchLabel(request) }];
      state.announce = `${added.length} ${added.length === 1 ? "question" : "questions"} added below.`;
      fileInBank(range(from, added.length), request);
    } else {
      Object.assign(state, { set: result.set, progress: blankProgress(result.set), batches: [], formOpen: false, feedbackErrors: {}, changeErrors: {} });
      fileInBank(range(0, result.set.questions.length), request);
    }
    setTopicLabel(state.bank, aboutOf(request), result.set.topicLabel); // a short header for the topic in the stats
    saveQuestionBank(state.bank);
    Object.assign(state, { status: "ready", lastRequest: request });
    save();
    drawStatus();
    drawStanding();
    const from = adding ? state.batches.at(-1).from : 0;
    drawSet();
    const first = setArea.querySelectorAll(".practice-question")[from];
    if (adding) {
      first?.scrollIntoView?.({ block: "start" });
      first?.focus?.();
    } else {
      setArea.scrollIntoView?.({ block: "start" });
    }
  }

  // ---------- the questions ----------

  function score() {
    const done = state.progress.filter((p, i) => (isChoice(state.set.questions[i]) ? p.picked !== null : p.grade !== null)).length;
    const right = state.progress.filter((p, i) => (isChoice(state.set.questions[i]) ? p.picked === state.set.questions[i].answer : p.grade === "got")).length;
    return { done, right, total: state.set.questions.length };
  }

  /** After a choice is picked: why the picked wrong choice tempts, and a fold-out explaining every choice. */
  function choiceNotes(question, progress) {
    if (!question.choiceNotes) return [];
    const noteFor = (choice) => question.choiceNotes[question.choices.indexOf(choice)];
    const picked = progress.picked !== question.answer
      ? [el("p", { className: "practice-choice-note" }, [el("strong", { text: `Why not “${progress.picked}”: ` }), noteFor(progress.picked)])]
      : [];
    const all = el("details", { className: "practice-all-notes" }, [
      el("summary", { text: "Why each choice is right or wrong" }),
      el("ul", {}, question.choices.map((choice) => el("li", { className: choice === question.answer ? "correct" : "" }, [el("strong", { text: `${choice}: ` }), noteFor(choice)]))),
    ]);
    return [...picked, all];
  }

  function renderChoices(question, progress, index) {
    const answered = progress.picked !== null;
    const choices = el("div", { className: "practice-choices" }, question.choices.map((choice) => {
      const node = button(choice, { onClick: () => answer(index, { picked: choice }) });
      node.classList.add("practice-choice");
      node.setAttribute("aria-pressed", String(progress.picked === choice));
      if (answered) {
        node.disabled = true;
        if (choice === question.answer) node.classList.add("correct");
        else if (choice === progress.picked) node.classList.add("missed");
      }
      return node;
    }));
    if (!answered) return [choices];
    const right = progress.picked === question.answer;
    return [
      choices,
      el("p", { className: `practice-feedback ${right ? "right" : "not-quite"}`, attrs: { role: "status", tabindex: "-1" } }, right
        ? [el("strong", { text: "Right." })]
        : [el("strong", { text: "Not quite." }), ` The answer is: ${question.answer}`]),
      ...(question.explanation ? [el("p", { className: "practice-explain", text: question.explanation })] : []),
      ...choiceNotes(question, progress),
    ];
  }

  /** The check done in the app: key points found or not, the final number, and the mark that suggests. */
  function renderCheck(question, checked) {
    const result = checkWrittenAnswer(question, checked);
    if (result.points.length === 0 && !result.number) return [];
    const items = result.points.map(({ point, found }) => el("li", { className: found ? "found" : "" }, found
      ? [el("span", { className: "practice-check-mark", text: "✓", attrs: { "aria-hidden": "true" } }), `Mentioned: ${point}`]
      : [el("span", { className: "practice-check-mark", text: "○", attrs: { "aria-hidden": "true" } }), `Not found in your answer: ${point}`]));
    const { number } = result;
    if (number) {
      items.push(el("li", { className: number.match ? "found" : "" }, number.match
        ? [el("span", { className: "practice-check-mark", text: "✓", attrs: { "aria-hidden": "true" } }), `Your final number, ${number.given}, matches the answer.`]
        : [el("span", { className: "practice-check-mark", text: "○", attrs: { "aria-hidden": "true" } }), `Your final number, ${number.given}, does not match the answer, ${number.expected}.`]));
    }
    return [el("div", { className: "practice-check", attrs: { tabindex: "-1" } }, [
      el("p", { className: "practice-reveal-label", text: "Checked in the app" }),
      el("ul", {}, items),
      el("p", { className: "practice-check-suggest" }, [el("strong", { text: `Suggested mark: ${gradeLabel(result.suggested)}` }), " · you choose below. This looks for key words, so it can miss a right answer put another way."]),
    ])];
  }

  /** Written questions whose checked answer has no AI feedback yet: what one "Get AI feedback" press sends. */
  function awaitingFeedback() {
    return state.progress.flatMap((progress, index) => {
      const checked = (progress.checkedTyped ?? "").trim();
      const question = state.set.questions[index];
      const current = progress.feedback && progress.feedback.forTyped === progress.checkedTyped;
      return !isChoice(question) && progress.revealed && checked && !current ? [index] : [];
    });
  }

  function renderFeedback(progress) {
    const { feedback } = progress;
    if (!feedback) return [];
    const row = (label, value) => (value ? [el("dt", { text: label }), el("dd", { text: value })] : []);
    return [el("div", { className: "practice-ai-feedback", attrs: { tabindex: "-1" } }, [
      el("p", { className: "practice-reveal-label", text: "AI feedback" }),
      ...(feedback.forTyped !== progress.checkedTyped ? [el("p", { className: "practice-ai-stale", text: "You’ve changed your answer since, so this is about your earlier one." })] : []),
      el("p", { className: "practice-ai-grade" }, [el("strong", { text: `AI suggests: ${gradeLabel(feedback.grade)}` })]),
      el("dl", {}, [
        ...row("What you got right", feedback.right),
        ...row("Still missing", feedback.missing),
        ...row("Watch out", feedback.misconception),
        ...row("Next time", feedback.nextStep),
      ]),
    ])];
  }

  function renderFeedbackAsk(index) {
    const waiting = awaitingFeedback();
    if (!waiting.includes(index)) return [];
    const loading = state.feedbackLoading.includes(index);
    const others = waiting.filter((other) => other !== index).map((other) => other + 1);
    const note = others.length === 0
      ? "Uses 1 AI request."
      : `Uses 1 AI request · also reads your ${others.length === 1 ? "answer to question" : "answers to questions"} ${others.join(", ")}.`;
    const error = state.feedbackErrors[index];
    return [el("div", { className: "practice-ai-ask" }, [
      button(loading ? "Reading your answers…" : "Get AI feedback", { disabled: busy(), onClick: () => getFeedback(index) }),
      el("p", { text: note }),
      ...(error ? [el("p", { className: "error", text: error, attrs: { role: "alert" } })] : []),
    ])];
  }

  function renderWritten(question, progress, index) {
    const id = `practice-answer-${index}`;
    const box = el("textarea", { attrs: { id, rows: question.kind === "problem" ? "5" : "3", placeholder: question.kind === "problem" ? "Work it out here, ending with your answer" : "Your answer" } });
    box.value = progress.typed;
    const parts = [el("label", { className: "practice-answer-label", text: question.kind === "problem" ? "Your working" : "Your answer", attrs: { for: id } }), box];
    if (!progress.revealed) {
      box.addEventListener("input", () => { progress.typed = box.value; save(); });
      parts.push(button("Check my answer", { onClick: () => answer(index, { revealed: true, checkedTyped: progress.typed }) }));
      return parts;
    }
    // Once checked, editing shows "Check again" in place, without redrawing (which would lose the cursor).
    const recheck = button("Check again", { onClick: () => answer(index, { checkedTyped: progress.typed }) });
    recheck.hidden = progress.typed === (progress.checkedTyped ?? "");
    box.addEventListener("input", () => { progress.typed = box.value; recheck.hidden = progress.typed === (progress.checkedTyped ?? ""); save(); });
    const grades = el("div", { className: "practice-grades", attrs: { role: "group", "aria-label": "How did you do?" } }, GRADES.map((grade) => {
      const node = button(grade.label, { onClick: () => answer(index, { grade: grade.id }) });
      node.setAttribute("aria-pressed", String(progress.grade === grade.id));
      return node;
    }));
    parts.push(
      recheck,
      ...renderCheck(question, progress.checkedTyped ?? ""),
      el("div", { className: "practice-reveal", attrs: { tabindex: "-1" } }, [
        ...(question.steps ? [el("p", { className: "practice-reveal-label", text: "Worked solution" }), el("ol", { className: "practice-steps" }, question.steps.map((step) => el("li", { text: step })))] : []),
        el("p", { className: "practice-model-answer" }, [el("strong", { text: question.kind === "problem" ? "Answer: " : "Model answer: " }), question.answer]),
        ...(question.explanation ? [el("p", { className: "practice-explain", text: question.explanation })] : []),
      ]),
      ...renderFeedback(progress),
      ...renderFeedbackAsk(index),
      el("p", { className: "practice-reveal-label", text: "How did you do?" }),
      grades,
    );
    return parts;
  }

  /** The question's words, with any code in it shown as a code block between them. */
  function renderPrompt(prompt) {
    const { before, code, after } = splitPromptCode(prompt);
    return el("div", { className: "practice-prompt" }, [
      ...(before ? [el("p", { text: before })] : []),
      ...(code ? [el("pre", { className: "practice-code", text: code })] : []),
      ...(after ? [el("p", { text: after })] : []),
    ]);
  }

  // ---------- changing one question ----------

  // The choices on each question: what to ask for, how many, whether the result goes below the question or in its
  // place, the note on the first new question, and the line saying what it does.
  const CHANGES = [
    // Named as actions, with an icon, because the student found plain adjectives ("Easier") read like information text.
    { label: "Make easier", icon: "M12 5v14M6 13l6 6 6-6", hint: "Same idea, fewer steps", variant: "easier", count: 1, place: "below", note: "Easier version of the question above" },
    { label: "Make harder", icon: "M12 19V5M6 11l6-6 6 6", hint: "Same idea, more to it", variant: "harder", count: 1, place: "below", note: "Harder version of the question above" },
    { label: "Add similar", icon: "M12 5v14M5 12h14", hint: "Two more on this idea", variant: "similar", count: 2, place: "below", note: "More like the question above" },
    { label: "Swap", icon: "M4 8h14l-4-4M20 16H6l4 4", hint: "A different question here", variant: "swap", count: 1, place: "instead", note: "Swapped in" },
  ];

  /**
   * How the student did on question `index`: "right", "close", "missed", or null before they have answered. Choice
   * questions are right or missed; a written answer goes by the student's own mark.
   */
  function outcome(question, progress) {
    if (isChoice(question)) return progress.picked === null ? null : progress.picked === question.answer ? "right" : "missed";
    return { got: "right", partly: "close", missed: "missed" }[progress.grade] ?? null;
  }
  // The tool suggested for each outcome. Plain code: no AI request is spent on it.
  const SUGGEST = { missed: "Make easier", close: "Make easier", right: "Make harder" };

  /** A small line icon from an SVG path, drawn in the text colour. */
  function toolIcon(path) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", path);
    svg.append(line);
    return svg;
  }

  /**
   * The tools on a question's top line. The student found a feedback-style row, then a filled panel, pulled
   * attention from the question, and then that plain outlined words did not look clickable (2026-11-15), so these are
   * small buttons styled like the app's others, each with an icon and an action name; hover or focus says what it does.
   */
  function renderChanges(question, index) {
    const full = state.set.questions.length >= PRACTICE_LIMITS.maxSet;
    const working = state.changing?.index === index;
    const suggest = SUGGEST[outcome(question, state.progress[index])] ?? null;
    return el("div", { className: "practice-tools", attrs: { role: "group", "aria-label": "Change this question" } }, CHANGES.map((change) => {
      const isSuggested = change.label === suggest;
      const pressed = working && state.changing.action === change.label;
      const node = button(pressed ? "Writing…" : change.label, { disabled: busy() || (full && change.place === "below"), onClick: () => changeQuestion(index, change) });
      node.classList.add("practice-tool");
      node.prepend(toolIcon(change.icon));
      if (isSuggested) node.classList.add("suggested");
      const what = `${change.hint} · 1 AI request`;
      node.title = isSuggested ? `Suggested: ${what}` : what;
      node.setAttribute("aria-label", `${node.textContent}: ${change.hint}, uses 1 AI request${isSuggested ? " (suggested)" : ""}`);
      return node;
    }));
  }

  /** A failure from the tools, shown under the question's top line. */
  function renderChangeError(index) {
    const error = state.changeErrors[index];
    return error ? [el("p", { className: "error practice-tools-error", text: error, attrs: { role: "alert" } })] : [];
  }

  /**
   * Asks the AI to build on question `index` (see CHANGES) and puts the result right below it or in its place. Notes
   * on added groups move with their questions; answers to every other question are kept. A failure changes nothing.
   */
  async function changeQuestion(index, change) {
    if (busy()) return;
    const question = state.set.questions[index];
    const cleaned = cleanPracticeRequest({
      ...state.form,
      kinds: [question.kind],
      count: change.count,
      variant: change.variant,
      basedOn: { kind: question.kind, concept: question.concept, category: shownCategory(index), prompt: question.prompt, answer: question.answer },
      avoid: state.set.questions.map((q) => q.prompt).slice(-PRACTICE_LIMITS.avoidCount),
      categories: topicCategories(state.bank, state.form),
    });
    state.changeErrors = {};
    if (!cleaned.ok) { state.changeErrors[index] = cleaned.error; redraw(index); return; }
    state.changing = { index, action: change.label };
    drawAdjust();
    drawSet();
    const result = await requestPracticeSet(cleaned.request);
    state.changing = null;
    let focusAt = index;
    if (result.error) {
      state.changeErrors[index] = result.message;
    } else if (change.place === "instead") {
      state.set.questions[index] = result.set.questions[0];
      state.progress[index] = blankProgress({ questions: [null] })[0];
      state.batches = [...state.batches.filter((batch) => batch.from !== index), { from: index, label: change.note }].sort((a, b) => a.from - b.from);
      fileInBank([index], cleaned.request);
    } else {
      const at = index + 1;
      const added = result.set.questions.slice(0, Math.min(change.count, PRACTICE_LIMITS.maxSet - state.set.questions.length));
      state.set.questions.splice(at, 0, ...added);
      state.progress.splice(at, 0, ...blankProgress({ questions: added }));
      const moved = state.batches.map((batch) => (batch.from >= at ? { ...batch, from: batch.from + added.length } : batch));
      state.batches = [...moved, { from: at, label: change.note }].sort((a, b) => a.from - b.from);
      state.feedbackErrors = {}; // keyed by position, which just shifted
      fileInBank(range(at, added.length), cleaned.request);
      focusAt = at;
    }
    save();
    drawAdjust();
    drawStanding();
    drawSet();
    const target = setArea.querySelectorAll(".practice-question")[focusAt];
    if (!result.error) target?.scrollIntoView?.({ block: "nearest" });
    (result.error ? target?.querySelector(".practice-tools-error") : target)?.focus?.();
  }

  function renderQuestion(question, index) {
    const progress = state.progress[index];
    const batch = state.batches.find((entry) => entry.from === index);
    return el("li", { className: "practice-question", attrs: { "data-question-kind": question.kind, tabindex: "-1" } }, [
      ...(batch ? [el("p", { className: "practice-batch-note", text: batch.label })] : []),
      // The topic leads, on its own; the student found it lost inside the small label line (2026-11-15).
      // Two fixed columns, so the tools sit in the same place on every question whatever the topic's length.
      el("div", { className: "practice-q-head" }, [
        el("div", { className: "practice-q-title" }, [
          // The broader category sits above the idea, quieter, so the specific idea stays what the eye lands on.
          ...(shownCategory(index) ? [el("p", { className: "practice-category", text: shownCategory(index) })] : []),
          ...(question.concept ? [el("p", { className: "practice-concept", text: question.concept })] : []),
          el("p", { className: "practice-q-label", text: `Question ${index + 1} · ${kindLabel(question.kind)}` }),
        ]),
        renderChanges(question, index),
      ]),
      ...renderChangeError(index),
      renderPrompt(question.prompt),
      ...(isChoice(question) ? renderChoices(question, progress, index) : renderWritten(question, progress, index)),
    ]);
  }

  /** Redraws question `index` in place and returns its new element. */
  function redraw(index) {
    const old = setArea.querySelectorAll(".practice-question")[index];
    const fresh = renderQuestion(state.set.questions[index], index);
    old.replaceWith(fresh);
    return fresh;
  }

  /**
   * Sends every checked written answer still without feedback in one request, and puts the feedback under each.
   * `index` is the question whose button was pressed: errors show there, and the keyboard goes to its feedback.
   */
  async function getFeedback(index) {
    const waiting = awaitingFeedback();
    if (busy() || waiting.length === 0) return;
    const sent = waiting.map((i) => ({ index: i, typed: state.progress[i].checkedTyped }));
    const cleaned = cleanFeedbackRequest({
      course: state.lastRequest?.course,
      topic: state.lastRequest?.topic,
      items: sent.map(({ index: i, typed }) => {
        const question = state.set.questions[i];
        return { kind: question.kind, prompt: question.prompt, answer: question.answer, steps: question.steps ?? [], keyPoints: question.keyPoints ?? [], studentAnswer: typed };
      }),
    });
    state.feedbackErrors = {};
    if (!cleaned.ok) {
      state.feedbackErrors[index] = cleaned.error;
      redraw(index);
      return;
    }
    state.feedbackLoading = waiting;
    waiting.forEach(redraw);
    const result = await requestFeedback(cleaned.request);
    state.feedbackLoading = [];
    if (result.error) {
      state.feedbackErrors[index] = result.message;
    } else {
      sent.forEach(({ index: i, typed }, k) => {
        const entry = result.feedback[k];
        if (entry) state.progress[i].feedback = { ...entry, forTyped: typed };
        else state.feedbackErrors[i] = "The AI’s feedback on this answer couldn’t be used. Try again in a moment.";
      });
      save();
    }
    waiting.forEach(redraw);
    const pressed = setArea.querySelectorAll(".practice-question")[index];
    (pressed.querySelector(".practice-ai-feedback, .practice-ai-ask .error") ?? pressed).focus?.();
  }

  const scoreLine = el("p", { className: "practice-score", attrs: { role: "status" } });
  const setFooter = el("div", { className: "practice-set-actions" });

  function drawScore() {
    const { done, right, total } = score();
    scoreLine.textContent = done === total ? `All done: ${right} of ${total} right.` : `${done} of ${total} answered · ${right} right`;
    const loading = state.status === "loading";
    const full = total >= PRACTICE_LIMITS.maxSet;
    setFooter.replaceChildren(...(done === total && !full ? [
      button(loading ? "Adding questions…" : "Add more like these", { primary: true, disabled: busy(), onClick: () => askFromBar("add") }),
      el("p", { className: "practice-adjust-note", text: "Or change the level, kinds or focus in the bar above first." }),
    ] : []));
  }

  /** Records an answer, then redraws only that question and the score, and keeps the keyboard where it was. */
  function answer(index, change) {
    Object.assign(state.progress[index], change);
    save();
    if ("picked" in change || "grade" in change) {
      recordInBank(index);
      drawStanding();
    }
    // A check can change which other questions' "Get AI feedback" buttons list it, so those redraw too.
    const fresh = redraw(index);
    if ("checkedTyped" in change) awaitingFeedback().filter((other) => other !== index).forEach(redraw);
    // Keep the keyboard on what just changed: a mark just chosen, else the result of the check or the choice.
    const target = "grade" in change ? ".practice-grades [aria-pressed='true']" : ".practice-feedback, .practice-check, .practice-reveal";
    (fresh.querySelector(target) ?? fresh).focus?.();
    drawScore();
  }

  function drawSet() {
    if (!state.set) { setArea.hidden = true; return; }
    setArea.hidden = false;
    drawScore();
    setArea.replaceChildren(
      el("h3", { text: state.set.title }),
      el("p", { className: "practice-ai-note", text: "Written by an AI (Google Gemini). The answers are usually right but not always: if one looks wrong, check it against your notes." }),
      scoreLine,
      el("ol", { className: "practice-list" }, state.set.questions.map(renderQuestion)),
      setFooter,
    );
  }

  // ---------- how you're doing, and your standing ----------

  /** A bar filled as far as `strength` (0 to 1), in the hue of whatever it sits in; its words say the same. */
  function meter(strength, level) {
    const percent = Math.round(strength * 100);
    return el("span", { className: "standing-meter", attrs: { role: "img", "aria-label": `${level.label}: ${percent} out of 100` } }, [
      // A sliver even at 0, so an empty bar still reads as a bar.
      el("span", { className: "standing-meter-fill", attrs: { style: `width: ${Math.max(percent, 3)}%` } }),
    ]);
  }
  const resultsText = (idea) => [idea.right && `${idea.right} right`, idea.close && `${idea.close} close`, idea.missed && `${idea.missed} missed`].filter(Boolean).join(" · ");
  /** The ideas of one topic, weakest first: name, meter, level and how the answers went. Always in the practice teal. */
  const renderIdeas = (ideas) => el("ul", { className: "standing-ideas", attrs: { "data-kind": "practice" } }, ideas.map((idea) =>
    el("li", { className: "standing-idea" }, [
      el("span", { className: "standing-idea-name", text: idea.concept }),
      meter(idea.strength, idea.level),
      el("span", { className: "standing-level", text: idea.level.label }),
      el("span", { className: "standing-results", text: resultsText(idea) }),
    ])));

  // How you're doing on the set's topic, between the adjust bar and the questions; it can be folded, and that is remembered.
  const standingPanel = el("details", { className: "practice-standing", attrs: { "data-kind": "practice" } });
  standingPanel.open = state.standingOpen;
  standingPanel.addEventListener("toggle", () => {
    if (state.standingOpen === standingPanel.open) return;
    state.standingOpen = standingPanel.open;
    save();
  });

  function drawStanding() {
    standingPanel.hidden = !state.set;
    if (!state.set) return;
    const about = aboutOf(state.lastRequest);
    const standing = topicStanding(state.bank, about);
    const ideas = standing?.ideas ?? [];
    standingPanel.replaceChildren(
      el("summary", {}, [
        renderIcon("level"),
        el("span", { className: "standing-title", text: "How you’re doing" }),
        el("span", { className: "standing-on", text: [about.course, state.bank.topics[topicKey(about)]?.label || about.topic].filter(Boolean).join(" · ") || "your own topic" }),
      ]),
      ...(ideas.length === 0
        ? [el("p", { className: "standing-empty", text: "Nothing answered on this topic yet. Answer a question and its idea shows up here, with how you’re doing on it." })]
        : [
          el("p", { className: "standing-summary", text: `${plural(standing.questions, "question")} in your bank · ${standing.toReview} waiting for review` }),
          renderIdeas(ideas),
          el("p", { className: "standing-note", text: "Weakest first. Recent answers count more. Every class and topic is under Your stats." }),
        ]),
    );
  }

  // Your stats: every answer as plain numbers, apart from any one set.
  const stats = createStatsView({
    getBank: () => state.bank, filters: state.statsFilters, onChange: save, groupIdeas,
    onBankChange: () => { saveQuestionBank(state.bank); drawStanding(); drawSet(); },
  });

  // The two views of this tab: practising, and the stats as a whole.
  const viewSwitch = el("div", { className: "practice-views", attrs: { role: "group", "aria-label": "Practice view" } });
  const practiseArea = el("div", { className: "practice-practise" }, [adjustBar, form, status, errorBox, standingPanel, setArea]);

  function drawView() {
    viewSwitch.replaceChildren(...VIEWS.map(({ id, label }) => {
      const node = button(label, { onClick: () => { state.view = id; save(); drawView(); } });
      node.setAttribute("aria-pressed", String(state.view === id));
      return node;
    }));
    practiseArea.hidden = state.view !== "practise";
    stats.element.hidden = state.view !== "stats";
    if (state.view === "stats") stats.draw();
  }

  const screen = el("section", { className: "practice", attrs: { "data-kind": "practice" } }, [
    el("h2", { text: "Practice questions" }),
    el("p", { className: "practice-intro", text: "Say what you’re studying and get practice questions to answer: for a class, a topic, or your own study guide." }),
    viewSwitch,
    practiseArea,
    stats.element,
  ]);
  drawStatus();
  drawStanding();
  drawSet();
  drawView();
  return screen;
}
