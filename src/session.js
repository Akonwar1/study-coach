// Guided study sessions: pure functions over plain objects, so they can be saved as JSON and tested.
//
// session  = { methodId, subject, startedAt, stepIndex, timers, statuses }
// timers   = one entry per step, so jumping between steps never loses a step's clock:
//            null (step has no timer) or { remainingMs, endsAt }
//            endsAt is null while paused, or the timestamp when the running timer reaches zero.
// statuses = one entry per step: "todo", "done" or "skipped".
// Storing endsAt (not a ticking counter) keeps the clock right when the tab is hidden or reopened.
// Only the step on screen can have a running timer: leaving a step pauses it.

const MINUTE_MS = 60_000;
const STATUSES = ["todo", "done", "skipped"];

export function hasWalkthrough(method) {
  return Array.isArray(method.session) && method.session.length > 0;
}

function timerForStep(step) {
  return step.minutes > 0 ? { remainingMs: step.minutes * MINUTE_MS, endsAt: null } : null;
}

export function startSession(method, now, subject = "other") {
  return {
    methodId: method.id,
    subject,
    startedAt: now,
    stepIndex: 0,
    timers: method.session.map(timerForStep),
    statuses: method.session.map(() => "todo"),
  };
}

export function isComplete(method, session) {
  return session.stepIndex >= method.session.length;
}

function withStep(list, index, value) {
  return list.map((item, i) => (i === index ? value : item));
}

function timerMsLeft(timer, now) {
  if (!timer) return null;
  return timer.endsAt === null ? timer.remainingMs : Math.max(0, timer.endsAt - now);
}

/** Milliseconds left on one step's timer, or null if that step has no timer. */
export function stepRemainingMs(session, index, now) {
  return timerMsLeft(session.timers[index], now);
}

/** Milliseconds left on the current step's timer, or null if the step has no timer. */
export function remainingMs(session, now) {
  return stepRemainingMs(session, session.stepIndex, now);
}

export function isTimerRunning(session) {
  const timer = session.timers[session.stepIndex];
  return Boolean(timer) && timer.endsAt !== null;
}

/** Starting the clock on a skipped step brings it back into the session. */
export function startTimer(session, now) {
  const timer = session.timers[session.stepIndex];
  if (!timer || timer.endsAt !== null || timer.remainingMs <= 0) return session;
  const running = { remainingMs: timer.remainingMs, endsAt: now + timer.remainingMs };
  const statuses = session.statuses[session.stepIndex] === "skipped" ? withStep(session.statuses, session.stepIndex, "todo") : session.statuses;
  return { ...session, timers: withStep(session.timers, session.stepIndex, running), statuses };
}

export function pauseTimer(session, now) {
  if (!isTimerRunning(session)) return session;
  const paused = { remainingMs: remainingMs(session, now), endsAt: null };
  return { ...session, timers: withStep(session.timers, session.stepIndex, paused) };
}

/** Puts the current step's clock back to its full time, paused, so the step can be redone. */
export function resetTimer(method, session) {
  const reset = timerForStep(method.session[session.stepIndex]);
  return { ...session, timers: withStep(session.timers, session.stepIndex, reset) };
}

/** Moves to any step. The step you leave keeps its clock, paused; the step you arrive at keeps its own. */
export function goToStep(method, session, index, now) {
  if (!Number.isInteger(index) || index < 0 || index >= method.session.length || index === session.stepIndex) return session;
  return { ...pauseTimer(session, now), stepIndex: index };
}

/** Marks the current step done and moves on. Past the last step the session is complete. */
export function nextStep(session, now) {
  const paused = pauseTimer(session, now);
  return { ...paused, statuses: withStep(paused.statuses, session.stepIndex, "done"), stepIndex: session.stepIndex + 1 };
}

/** Marks the current step skipped and moves on. */
export function skipStep(session, now) {
  const paused = pauseTimer(session, now);
  return { ...paused, statuses: withStep(paused.statuses, session.stepIndex, "skipped"), stepIndex: session.stepIndex + 1 };
}

export function previousStep(method, session, now) {
  return goToStep(method, session, session.stepIndex - 1, now);
}

/** Sessions saved before each step had its own clock kept one timer for the step on screen; convert them. */
export function upgradeSession(method, session) {
  if (!session || typeof session !== "object" || !method || Array.isArray(session.timers) || !("timer" in session)) return session;
  const { timer, ...rest } = session;
  const index = session.stepIndex;
  if (!Number.isInteger(index) || index < 0 || index >= method.session.length) return session;
  return {
    ...rest,
    timers: method.session.map((step, i) => (i === index ? timer : timerForStep(step))),
    statuses: method.session.map((step, i) => (i < index ? "done" : "todo")),
  };
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

function isValidTimer(timer) {
  return timer === null || (typeof timer === "object" && Number.isFinite(timer.remainingMs) && (timer.endsAt === null || Number.isFinite(timer.endsAt)));
}

/** True if saved data looks like a session we can safely resume for one of these methods. */
export function isResumable(session, methods) {
  if (!session || typeof session !== "object") return false;
  const method = methods.find((m) => m.id === session.methodId);
  if (!method || !hasWalkthrough(method)) return false;
  if (session.subject !== undefined && typeof session.subject !== "string") return false;
  if (!Number.isFinite(session.startedAt)) return false;
  if (!Number.isInteger(session.stepIndex) || session.stepIndex < 0 || session.stepIndex >= method.session.length) return false;
  const { timers, statuses } = session;
  if (!Array.isArray(timers) || timers.length !== method.session.length || !timers.every(isValidTimer)) return false;
  return Array.isArray(statuses) && statuses.length === method.session.length && statuses.every((status) => STATUSES.includes(status));
}
