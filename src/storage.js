// Saves the in-progress session and finished-session history in this browser.
// Storage can be missing or full (private windows, blocked site data), so every call is guarded
// and write functions return whether the save worked.

const ACTIVE_KEY = "studyCoach.activeSession";
const HISTORY_KEY = "studyCoach.history";
const MAX_HISTORY = 50;

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
