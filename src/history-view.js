import { button, el } from "./dom.js";
import { byMethod, bySubject, formatMinutes, isFinished, minutesPerDay, subjectLabel, summarize } from "./history.js";
import { svg, svgText } from "./visuals.js";

const CHART_DAYS = 14;
const CHART_WIDTH = 300;
const CHART_HEIGHT = 130;
const CHART_TOP = 18;
const CHART_BOTTOM = 106;
const BREAKDOWN_ROWS = 5;

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

function renderChart(entries, now) {
  const days = minutesPerDay(entries, CHART_DAYS, now);
  const tallest = Math.max(...days.map((day) => day.minutes), 1);
  const slot = CHART_WIDTH / days.length;
  const barWidth = slot - 6;
  const total = days.reduce((sum, day) => sum + day.minutes, 0);

  const bars = days.flatMap((day, index) => {
    const height = (day.minutes / tallest) * (CHART_BOTTOM - CHART_TOP);
    const x = index * slot + 3;
    const parts = [
      svg("rect", { class: `bar${day.isToday ? " today" : ""}`, x, y: CHART_BOTTOM - height, width: barWidth, height: Math.max(height, day.minutes > 0 ? 2 : 0), rx: 3 }, [
        Object.assign(svg("title"), { textContent: `${day.weekday}: ${formatMinutes(day.minutes)}` }),
      ]),
      svgText(day.weekday.slice(0, 1), { x: x + barWidth / 2, y: CHART_HEIGHT - 8, class: `chart-label${day.isToday ? " today" : ""}` }),
    ];
    if (day.minutes > 0) parts.push(svgText(String(day.minutes), { x: x + barWidth / 2, y: CHART_BOTTOM - height - 4, class: "chart-value" }));
    return parts;
  });

  const chart = svg("svg", { viewBox: `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`, class: "chart", role: "img", "aria-label": `Minutes studied per day over the last ${CHART_DAYS} days: ${formatMinutes(total)} in total.` }, [
    svg("line", { class: "chart-axis", x1: 0, x2: CHART_WIDTH, y1: CHART_BOTTOM, y2: CHART_BOTTOM }),
    ...bars,
  ]);
  return el("section", { className: "chart-card" }, [
    el("h3", { text: `Minutes per day, last ${CHART_DAYS} days` }),
    chart,
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
    `${when.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}, ${when.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`,
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

/**
 * The History tab: weekly goal, totals, a 14-day chart, breakdowns and the full log.
 * `entries` are cleaned history entries, newest first. Handlers are supplied by the caller.
 */
export function renderHistoryScreen({ entries, now, goalMinutes, goalError, pendingDeleteKey, visibleCount, handlers }) {
  if (entries.length === 0) {
    return el("section", { className: "history-tab" }, [
      el("h2", { text: "Study history" }),
      renderGoal({ goalMinutes, weekMinutes: 0, goalError, ...handlers }),
      el("p", { className: "empty", text: "No sessions yet. Finish a guided session, or stop one after a few minutes, and it will show up here with your stats." }),
      button("Start a session", { primary: true, onClick: handlers.onGoCoach }),
    ]);
  }

  const totals = summarize(entries, now);
  const shown = entries.slice(0, visibleCount);
  return el("section", { className: "history-tab" }, [
    el("h2", { text: "Study history" }),
    renderGoal({ goalMinutes, weekMinutes: totals.weekMinutes, goalError, ...handlers }),
    el("div", { className: "stats" }, [
      stat(formatMinutes(totals.totalMinutes), "total study time"),
      stat(String(totals.sessions), totals.sessions === 1 ? "session logged" : "sessions logged"),
      stat(formatMinutes(totals.weekMinutes), `this week · ${totals.weekSessions} session${totals.weekSessions === 1 ? "" : "s"}`),
      stat(`${totals.streak} day${totals.streak === 1 ? "" : "s"}`, "current streak"),
    ]),
    renderChart(entries, now),
    el("div", { className: "breakdowns" }, [renderBreakdown("Methods you use most", byMethod(entries)), renderBreakdown("Time by subject", bySubject(entries))]),
    el("section", { className: "log" }, [
      el("h3", { text: "All sessions" }),
      el("p", { className: "tag-key", text: "Sessions you stop early are logged once you have done about a third of the method’s timed minutes." }),
      el("ul", { className: "log-list" }, shown.map((entry) => renderLogEntry(entry, { pendingDeleteKey, ...handlers }))),
      ...(entries.length > visibleCount ? [button(`Show more (${entries.length - visibleCount} older)`, { onClick: handlers.onShowMore })] : []),
    ]),
  ]);
}
