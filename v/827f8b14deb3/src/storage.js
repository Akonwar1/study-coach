// Saves the in-progress session and finished-session history in this browser.
// Storage can be missing or full (private windows, blocked site data), so every call is guarded
// and write functions return whether the save worked.

const ACTIVE_KEY = "studyCoach.activeSession";
const HISTORY_KEY = "studyCoach.history";
const GOAL_KEY = "studyCoach.weeklyGoalMinutes";
const MAX_HISTORY = 1000;

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadActiveSession() {
  return read(ACTIVE_KEY, null);
}

export function saveActiveSession(session) {
  return write(ACTIVE_KEY, session);
}

export function clearActiveSession() {
  try {
    localStorage.removeItem(ACTIVE_KEY);
  } catch {
    // Nothing saved, so nothing to clear.
  }
}

export function loadHistory() {
  const history = read(HISTORY_KEY, []);
  return Array.isArray(history) ? history : [];
}

/** Adds a finished session, newest first. Returns false if it could not be saved. */
export function addHistoryEntry(entry) {
  return write(HISTORY_KEY, [entry, ...loadHistory()].slice(0, MAX_HISTORY));
}

/** Removes one logged session (matched by when it started and ended). Returns false if it could not be saved. */
export function deleteHistoryEntry(entry) {
  const kept = loadHistory().filter((saved) => !(saved.startedAt === entry.startedAt && saved.completedAt === entry.completedAt));
  return write(HISTORY_KEY, kept);
}

/** The weekly study goal in minutes, or null if none is set. */
export function loadWeeklyGoal() {
  const minutes = read(GOAL_KEY, null);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
}

/** Saves the weekly goal in minutes; null removes it. Returns false if it could not be saved. */
export function saveWeeklyGoal(minutes) {
  if (minutes === null) {
    try {
      localStorage.removeItem(GOAL_KEY);
      return true;
    } catch {
      return false;
    }
  }
  return write(GOAL_KEY, minutes);
}

const PRACTICE_KEY = "studyCoach.practice";

/** The Practice tab's form, current set and answers so far, or null. Checked by the Practice screen before use. */
export function loadPracticeState() {
  return read(PRACTICE_KEY, null);
}

export function savePracticeState(state) {
  return write(PRACTICE_KEY, state);
}

const BANK_KEY = "studyCoach.questionBank";

/** Every practice question shown, with its results (src/question-bank.js), or null. Cleaned by cleanBank before use. */
export function loadQuestionBank() {
  return read(BANK_KEY, null);
}

export function saveQuestionBank(bank) {
  return write(BANK_KEY, bank);
}

// Light or dark (src/theme.js). index.html reads this key too, before the page is drawn, so keep the two in step.
const THEME_KEY = "studyCoach.theme";

/** "light" if light mode was chosen, else "dark", the app's default whatever the computer prefers. */
export function loadTheme() {
  return read(THEME_KEY, "dark") === "light" ? "light" : "dark";
}

export function saveTheme(theme) {
  return write(THEME_KEY, theme === "light" ? "light" : "dark");
}
