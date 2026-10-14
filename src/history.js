// Study history: building log entries, deciding which stopped sessions are worth logging, and the stats
// shown on the History tab. Pure functions over plain objects so they can be tested without a page.
//
// entry = { methodId, methodName, subject?, startedAt, completedAt, minutes, completed?, stepsDone?, totalSteps? }
// Entries saved before subjects and stopped sessions existed lack the optional fields; a missing
// `completed` means the session was finished.

import { SUBJECT_QUESTION } from "./questions.js";
import { elapsedMinutes, remainingMs } from "./session.js";

const MINUTE_MS = 60_000;
const LOG_THRESHOLD_SHARE = 0.3; // a stopped session is logged once this share of the method's timed minutes is done
const MIN_LOG_THRESHOLD_MINUTES = 3;
const MAX_WALL_CLOCK_FACTOR = 2; // a finished session never counts more than this multiple of its planned time
const MIN_GOAL_HOURS = 0.5;
const MAX_GOAL_HOURS = 100;

// ---------- building entries ----------

export function plannedMinutes(method) {
  return method.session.reduce((total, step) => total + step.minutes, 0);
}

/** Timer minutes a stopped session must have reached to be worth logging; depends on how long the method is. */
export function loggingThreshold(method) {
  return Math.max(MIN_LOG_THRESHOLD_MINUTES, Math.round(plannedMinutes(method) * LOG_THRESHOLD_SHARE));
}

/** Minutes of timer progress so far: finished steps at their planned length plus the current step's elapsed timer. */
export function timerProgressMinutes(method, session, now) {
  const finished = method.session.slice(0, session.stepIndex).reduce((total, step) => total + step.minutes, 0);
  const step = method.session[session.stepIndex];
  const left = remainingMs(session, now);
  const current = step && left !== null ? (step.minutes * MINUTE_MS - left) / MINUTE_MS : 0;
  return Math.max(0, finished + current);
}

export function shouldLogStopped(method, session, now) {
  return timerProgressMinutes(method, session, now) >= loggingThreshold(method);
}

export function buildEntry({ method, session, now, completed }) {
  const cap = Math.max(1, plannedMinutes(method) * MAX_WALL_CLOCK_FACTOR);
  const minutes = completed
    ? Math.min(elapsedMinutes(session, now), cap)
    : Math.max(1, Math.round(timerProgressMinutes(method, session, now)));
  return {
    methodId: method.id,
    methodName: method.name,
    subject: session.subject ?? "other",
    startedAt: session.startedAt,
    completedAt: now,
    minutes,
    completed,
    stepsDone: completed ? method.session.length : session.stepIndex,
    totalSteps: method.session.length,
  };
}

// ---------- reading entries ----------

export const isFinished = (entry) => entry.completed !== false;

/** Keeps only entries with usable numbers, so one corrupted record cannot break the stats. */
export function cleanEntries(entries) {
  return (Array.isArray(entries) ? entries : []).filter(
    (entry) => entry && Number.isFinite(entry.minutes) && entry.minutes >= 0 && Number.isFinite(entry.completedAt) && typeof entry.methodName === "string",
  );
}

export function subjectLabel(subjectId) {
  return SUBJECT_QUESTION.options.find((option) => option.id === subjectId)?.label ?? "Not recorded";
}

// ---------- days and weeks (local time) ----------

export function dayKey(ms) {
  const date = new Date(ms);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Midnight at the start of the most recent Monday. */
export function startOfWeek(now) {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date.getTime();
}

function daysAgo(now, count) {
  const date = new Date(now);
  date.setHours(12, 0, 0, 0); // noon, so daylight-saving changes cannot skip or repeat a day
  date.setDate(date.getDate() - count);
  return date;
}

// ---------- stats ----------

const sumMinutes = (entries) => entries.reduce((total, entry) => total + entry.minutes, 0);

/** Days in a row, ending today (or yesterday if nothing is logged yet today), with at least one session. */
export function streakDays(entries, now) {
  const days = new Set(entries.map((entry) => dayKey(entry.completedAt)));
  let offset = days.has(dayKey(now)) ? 0 : 1;
  let streak = 0;
  while (days.has(dayKey(daysAgo(now, offset).getTime()))) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

export function summarize(entries, now) {
  const weekStart = startOfWeek(now);
  const thisWeek = entries.filter((entry) => entry.completedAt >= weekStart);
  return {
    totalMinutes: sumMinutes(entries),
    sessions: entries.length,
    finishedSessions: entries.filter(isFinished).length,
    weekMinutes: sumMinutes(thisWeek),
    weekSessions: thisWeek.length,
    streak: streakDays(entries, now),
  };
}

/** Minutes studied on each of the last `days` days, oldest first. */
export function minutesPerDay(entries, days, now) {
  const perDay = new Map();
  for (const entry of entries) perDay.set(dayKey(entry.completedAt), (perDay.get(dayKey(entry.completedAt)) ?? 0) + entry.minutes);
  return Array.from({ length: days }, (_, index) => {
    const date = daysAgo(now, days - 1 - index);
    return {
      key: dayKey(date.getTime()),
      weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
      minutes: perDay.get(dayKey(date.getTime())) ?? 0,
      isToday: index === days - 1,
    };
  });
}

/** Total minutes and sessions grouped by `pick(entry)` (returns { id, label }), most minutes first. */
export function breakdown(entries, pick) {
  const groups = new Map();
  for (const entry of entries) {
    const { id, label } = pick(entry);
    const group = groups.get(id) ?? { id, label, minutes: 0, sessions: 0 };
    group.minutes += entry.minutes;
    group.sessions += 1;
    groups.set(id, group);
  }
  return [...groups.values()].sort((a, b) => b.minutes - a.minutes || b.sessions - a.sessions);
}

export const byMethod = (entries) => breakdown(entries, (entry) => ({ id: entry.methodId ?? entry.methodName, label: entry.methodName }));
export const bySubject = (entries) => breakdown(entries, (entry) => ({ id: entry.subject ?? "unknown", label: subjectLabel(entry.subject) }));

// ---------- weekly goal and formatting ----------

/** Turns the goal field's text (hours) into whole minutes, or null if it is not a sensible number. */
export function parseGoalHours(text) {
  const hours = Number(String(text).trim());
  if (!String(text).trim() || !Number.isFinite(hours) || hours < MIN_GOAL_HOURS || hours > MAX_GOAL_HOURS) return null;
  return Math.round(hours * 60);
}

export const GOAL_RANGE_TEXT = `${MIN_GOAL_HOURS} to ${MAX_GOAL_HOURS} hours`;

export function formatMinutes(minutes) {
  const rounded = Math.round(minutes);
  if (rounded < 60) return `${rounded} min`;
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${String(rest).padStart(2, "0")} min`;
}
