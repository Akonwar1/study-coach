import { button, el } from "./dom.js";
import { byMethod, bySubject, dayKey, formatMinutes, groupByDay, isFinished, minutesPerDay, monthCells, subjectLabel, summarize } from "./history.js";

const CHART_DAYS = 14;
const BREAKDOWN_ROWS = 5;
const WEEKDAY_HEADINGS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const entryKey = (entry) => `${entry.startedAt}-${entry.completedAt}`;

function stat(value, label) {
  return el("div", { className: "stat" }, [el("p", { className: "stat-value", text: value }), el("p", { className: "stat-label", text: label })]);
}

function renderGoal({ goalMinutes, weekMinutes, goalError, onSetGoal, onClearGoal }) {
  const input = el("input", { attrs: { id: "goal-hours", type: "number", inputmode: "decimal", min: "0.5", max: "100", step: "0.5", placeholder: "e.g. 5" } });
  if (goalMinutes) input.value = String(goalMinutes / 60);
  const save = button(goalMinutes ? "Update goal" : "Set goal", { primary: true, onClick: () => onSetGoal(input.value) });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") onSetGoal(input.value);
  });

  const progress = goalMinutes
    ? [
        el("div", { className: "goal-bar", attrs: { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(goalMinutes), "aria-valuenow": String(Math.min(weekMinutes, goalMinutes)), "aria-label": "Progress toward weekly goal" } }, [
          el("span", { attrs: { style: `width:${Math.min(100, (weekMinutes / goalMinutes) * 100)}%` } }),
        ]),
        el("p", {
          className: "goal-text",
          text: weekMinutes >= goalMinutes
            ? `Goal reached: ${formatMinutes(weekMinutes)} of ${formatMinutes(goalMinutes)} this week.`
            : `${formatMinutes(weekMinutes)} of ${formatMinutes(goalMinutes)} this week. ${formatMinutes(goalMinutes - weekMinutes)} to go.`,
        }),
      ]
    : [el("p", { className: "goal-text", text: "No goal yet. Pick a number of hours to aim for each week (weeks start on Monday)." })];

  return el("section", { className: "goal" }, [
    el("h3", { text: "Weekly goal" }),
    ...progress,
    el("div", { className: "goal-form" }, [
      el("label", { text: "Hours per week", attrs: { for: "goal-hours" } }),
      input,
      save,
      ...(goalMinutes ? [button("Remove goal", { onClick: onClearGoal })] : []),
    ]),
    ...(goalError ? [el("p", { className: "error", text: goalError, attrs: { role: "alert" } })] : []),
  ]);
}

function renderChart(entries, now, { selectedKey, onPickDay }) {
  const days = minutesPerDay(entries, CHART_DAYS, now);
  const tallest = Math.max(...days.map((day) => day.minutes), 1);
  const total = days.reduce((sum, day) => sum + day.minutes, 0);

  const columns = days.map((day) => {
    const column = el("button", {
      className: `chart-col${day.isToday ? " today" : ""}${day.key === selectedKey ? " selected" : ""}`,
      attrs: { type: "button", "aria-label": `${day.fullDate}: ${formatMinutes(day.minutes)}. Show this day’s sessions.`, title: `${day.fullDate}: ${formatMinutes(day.minutes)}` },
    }, [
      el("span", { className: "chart-value", text: day.minutes > 0 ? String(day.minutes) : "" }),
      el("span", { className: "chart-track" }, [
        el("span", { className: "chart-bar", attrs: { style: `height:${day.minutes > 0 ? Math.max(4, (day.minutes / tallest) * 100) : 0}%` } }),
      ]),
      el("span", { className: "chart-weekday", text: day.weekday }),
      el("span", { className: "chart-date", text: String(day.dayOfMonth) }),
    ]);
    column.addEventListener("click", () => onPickDay(day.key));
    return column;
  });

  return el("section", { className: "chart-card" }, [
    el("h3", { text: `Minutes per day, last ${CHART_DAYS} days` }),
    el("p", { className: "tag-key", text: `${formatMinutes(total)} in total. Tap a day to see its sessions below.` }),
    el("div", { className: "chart" }, columns),
  ]);
}

function renderBreakdown(title, rows) {
  const top = rows.slice(0, BREAKDOWN_ROWS);
  const most = Math.max(...top.map((row) => row.minutes), 1);
  return el("section", { className: "breakdown" }, [
    el("h3", { text: title }),
    el("ul", { className: "bar-rows" }, top.map((row) =>
      el("li", { className: "bar-row" }, [
        el("span", { className: "bar-label", text: row.label }),
        el("span", { className: "bar-track" }, [el("span", { className: "bar-fill", attrs: { style: `width:${(row.minutes / most) * 100}%` } })]),
        el("span", { className: "bar-value", text: `${formatMinutes(row.minutes)} · ${row.sessions} session${row.sessions === 1 ? "" : "s"}` }),
      ]),
    )),
  ]);
}

function renderLogEntry(entry, { pendingDeleteKey, onAskDelete, onConfirmDelete, onCancelDelete }) {
  const when = new Date(entry.completedAt);
  const finished = isFinished(entry);
  const key = entryKey(entry);
  const confirming = pendingDeleteKey === key;
  const detail = [
    when.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    formatMinutes(entry.minutes),
    subjectLabel(entry.subject),
  ].join(" · ");

  const actions = confirming
    ? [button("Yes, delete", { onClick: () => onConfirmDelete(entry) }), button("Keep", { onClick: onCancelDelete })]
    : [button("Delete", { onClick: () => onAskDelete(key) })];

  return el("li", { className: "log-entry" }, [
    el("div", { className: "log-main" }, [
      el("p", { className: "log-title" }, [
        el("span", { text: entry.methodName }),
        el("span", {
          className: `log-badge${finished ? "" : " stopped"}`,
          text: finished ? "Finished" : `Stopped at step ${entry.stepsDone + 1} of ${entry.totalSteps}`,
        }),
      ]),
      el("p", { className: "log-detail", text: detail }),
    ]),
    el("div", { className: "log-actions" }, actions),
  ]);
}

function renderCalendar({ entries, year, month, selectedKey, todayKey, onPickDay, onShowMonth }) {
  const byDay = groupByDay(entries);
  const monthStart = new Date(year, month, 1);
  const earliest = new Date(Math.min(...entries.map((entry) => entry.completedAt)));
  const canGoBack = monthStart > new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const canGoForward = dayKey(new Date(year, month + 1, 1, 12).getTime()) <= todayKey;
  const longest = Math.max(...[...byDay.values()].map((day) => day.minutes), 1);

  const cells = monthCells(year, month).map((cell) => {
    if (!cell) return el("span", { className: "cal-pad" });
    const day = byDay.get(cell.key);
    const classes = ["cal-day", day ? "has-sessions" : "", cell.key === selectedKey ? "selected" : "", cell.key === todayKey ? "today" : ""].filter(Boolean).join(" ");
    const count = day?.entries.length ?? 0;
    const node = el("button", {
      className: classes,
      attrs: {
        type: "button",
        "aria-pressed": String(cell.key === selectedKey),
        "aria-label": `${new Date(year, month, cell.day).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}: ${day ? `${formatMinutes(day.minutes)}, ${count} session${count === 1 ? "" : "s"}` : "no sessions"}`,
        ...(day ? { style: `--level:${Math.round(15 + (day.minutes / longest) * 35)}%` } : {}),
      },
    }, [el("span", { className: "cal-number", text: String(cell.day) }), el("span", { className: "cal-minutes", text: day ? `${day.minutes}m` : "" })]);
    node.addEventListener("click", () => onPickDay(cell.key));
    return node;
  });

  const previous = button("‹", { onClick: () => onShowMonth(year, month - 1), disabled: !canGoBack });
  const next = button("›", { onClick: () => onShowMonth(year, month + 1), disabled: !canGoForward });
  previous.setAttribute("aria-label", "Previous month");
  next.setAttribute("aria-label", "Next month");
  return el("div", { className: "session-calendar" }, [
    el("div", { className: "cal-header" }, [
      previous,
      el("h4", { text: monthStart.toLocaleDateString(undefined, { month: "long", year: "numeric" }) }),
      next,
    ]),
    el("div", { className: "cal-grid" }, [...WEEKDAY_HEADINGS.map((name) => el("span", { className: "cal-weekday", text: name })), ...cells]),
  ]);
}

function renderDayPanel({ entries, selectedKey, todayKey, pendingDeleteKey, handlers }) {
  const [year, month, day] = selectedKey.split("-").map(Number);
  const heading = new Date(year, month - 1, day).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const sessions = entries.filter((entry) => dayKey(entry.completedAt) === selectedKey).sort((a, b) => b.completedAt - a.completedAt);
  const minutes = sessions.reduce((sum, entry) => sum + entry.minutes, 0);
  return el("div", { className: "day-panel", attrs: { "aria-live": "polite" } }, [
    el("h4", { text: `${selectedKey === todayKey ? "Today · " : ""}${heading}` }),
    sessions.length === 0
      ? el("p", { className: "empty", text: "No sessions logged this day." })
      : el("p", { className: "log-detail", text: `${formatMinutes(minutes)} across ${sessions.length} session${sessions.length === 1 ? "" : "s"}` }),
    el("ul", { className: "log-list" }, sessions.map((entry) => renderLogEntry(entry, { pendingDeleteKey, ...handlers }))),
  ]);
}

/**
 * The History tab: weekly goal, totals, a 14-day chart, breakdowns and a calendar of past sessions.
 * `entries` are cleaned history entries, newest first. `selectedKey` (a dayKey) and `shownMonth` ({ year, month })
 * may be null, in which case the day of the latest session is selected and its month shown. Handlers are supplied by the caller.
 */
export function renderHistoryScreen({ entries, now, goalMinutes, goalError, pendingDeleteKey, selectedKey, shownMonth, handlers }) {
  if (entries.length === 0) {
    return el("section", { className: "history-tab" }, [
      el("h2", { text: "Study history" }),
      renderGoal({ goalMinutes, weekMinutes: 0, goalError, ...handlers }),
      el("p", { className: "empty", text: "No sessions yet. Finish a guided session, or stop one after a few minutes, and it will show up here with your stats." }),
      button("Start a session", { primary: true, onClick: handlers.onGoCoach }),
    ]);
  }

  const totals = summarize(entries, now);
  const todayKey = dayKey(now);
  const selected = selectedKey ?? dayKey(entries[0].completedAt);
  const [selectedYear, selectedMonth] = selected.split("-").map(Number);
  const { year, month } = shownMonth ?? { year: selectedYear, month: selectedMonth - 1 };
  const calendarProps = { entries, selectedKey: selected, todayKey, onPickDay: handlers.onPickDay };
  return el("section", { className: "history-tab" }, [
    el("h2", { text: "Study history" }),
    renderGoal({ goalMinutes, weekMinutes: totals.weekMinutes, goalError, ...handlers }),
    el("div", { className: "stats" }, [
      stat(formatMinutes(totals.totalMinutes), "total study time"),
      stat(String(totals.sessions), totals.sessions === 1 ? "session logged" : "sessions logged"),
      stat(formatMinutes(totals.weekMinutes), `this week · ${totals.weekSessions} session${totals.weekSessions === 1 ? "" : "s"}`),
      stat(`${totals.streak} day${totals.streak === 1 ? "" : "s"}`, "current streak"),
    ]),
    renderChart(entries, now, { selectedKey: selected, onPickDay: handlers.onPickDay }),
    el("div", { className: "breakdowns" }, [renderBreakdown("Methods you use most", byMethod(entries)), renderBreakdown("Time by subject", bySubject(entries))]),
    el("section", { className: "log" }, [
      el("h3", { text: "Past sessions" }),
      el("p", { className: "tag-key", text: "Pick a day to see what you studied. Sessions you stop early are logged once you have done about a third of the method’s timed minutes." }),
      renderCalendar({ ...calendarProps, year, month, onShowMonth: handlers.onShowMonth }),
      renderDayPanel({ entries, selectedKey: selected, todayKey, pendingDeleteKey, handlers }),
    ]),
  ]);
}
