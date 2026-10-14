// Guided study sessions: pure functions over plain objects, so they can be saved as JSON and tested.
//
// session = { methodId, subject, startedAt, stepIndex, timer }
// timer   = null (step has no timer) or { remainingMs, endsAt }
//           endsAt is null while paused, or the timestamp when the running timer reaches zero.
// Storing endsAt (not a ticking counter) keeps the clock right when the tab is hidden or reopened.

const MINUTE_MS = 60_000;

export function hasWalkthrough(method) {
  return Array.isArray(method.session) && method.session.length > 0;
}

function timerForStep(step) {
  return step.minutes > 0 ? { remainingMs: step.minutes * MINUTE_MS, endsAt: null } : null;
}

export function startSession(method, now, subject = "other") {
  return { methodId: method.id, subject, startedAt: now, stepIndex: 0, timer: timerForStep(method.session[0]) };
}

export function isComplete(method, session) {
  return session.stepIndex >= method.session.length;
}

/** Milliseconds left on the current step's timer, or null if the step has no timer. */
export function remainingMs(session, now) {
  const timer = session.timer;
  if (!timer) return null;
  return timer.endsAt === null ? timer.remainingMs : Math.max(0, timer.endsAt - now);
}

export function isTimerRunning(session) {
  return session.timer !== null && session.timer.endsAt !== null;
}

export function startTimer(session, now) {
  const timer = session.timer;
  if (!timer || timer.endsAt !== null || timer.remainingMs <= 0) return session;
  return { ...session, timer: { remainingMs: timer.remainingMs, endsAt: now + timer.remainingMs } };
}

export function pauseTimer(session, now) {
  if (!isTimerRunning(session)) return session;
  return { ...session, timer: { remainingMs: remainingMs(session, now), endsAt: null } };
}

/** Moves to the next step with a fresh timer. Past the last step the session is complete. */
export function nextStep(method, session) {
  const stepIndex = session.stepIndex + 1;
  const timer = stepIndex < method.session.length ? timerForStep(method.session[stepIndex]) : null;
  return { ...session, stepIndex, timer };
}

export function previousStep(method, session) {
  if (session.stepIndex === 0) return session;
  const stepIndex = session.stepIndex - 1;
  return { ...session, stepIndex, timer: timerForStep(method.session[stepIndex]) };
}

export function elapsedMinutes(session, now) {
  return Math.max(1, Math.round((now - session.startedAt) / MINUTE_MS));
}

export function formatClock(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** True if saved data looks like a session we can safely resume for one of these methods. */
export function isResumable(session, methods) {
  if (!session || typeof session !== "object") return false;
  const method = methods.find((m) => m.id === session.methodId);
  if (!method || !hasWalkthrough(method)) return false;
  if (session.subject !== undefined && typeof session.subject !== "string") return false;
  if (!Number.isFinite(session.startedAt)) return false;
  if (!Number.isInteger(session.stepIndex) || session.stepIndex < 0 || session.stepIndex >= method.session.length) return false;
  const timer = session.timer;
  if (timer === null) return true;
  return typeof timer === "object" && Number.isFinite(timer.remainingMs) && (timer.endsAt === null || Number.isFinite(timer.endsAt));
}
