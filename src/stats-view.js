// Your stats, the second view of the Practice tab: every practice answer in the question bank as plain numbers. Filters
// for class, subject area, topic, category and time range narrow everything below them: four number tiles, accuracy by
// question type and by level, broader categories that open to their ideas (with "Group my ideas" for ideas from before
// categories, "Rename category" and "Move to" for the student's own names), a sortable and searchable table of ideas,
// and a table of topics. A topic's name opens a page of its own (2026-11-19, the student: clicking it should "clearly be
// changing the page"): a back button, the topic's header, the time range, and only that topic's numbers.
// Numbers come from src/practice-stats.js; this file only draws them. Asked for by the student (2026-11-15): stats on
// "proficiency and ability during practice in quantifiable and real data ... easy, reliable, and intuitive".
// Sample answers (src/sample-practice.js) are a testing tool for the student only (2026-11-19): a Testing tools box at
// the top adds and removes them, shown only at ?dev on this computer (see devToolsOn), and says what each press did.
// Whenever sample answers are in, a notice at the top says so, so they are never taken for real ones.
import { button, el } from "./dom.js";
import { renderIcon } from "./icons.js";
import { categoryKeyOf, filterOptions, IDEA_SORTS, practiceStats, searchIdeas, sortIdeas } from "./practice-stats.js";
import { CATEGORY_NAME_LIMIT, moveIdea, renameCategory, topicCategories, whenLabel } from "./question-bank.js";
import { addSampleData, countSampleAnswers, removeSampleData } from "./sample-practice.js";

/**
 * Whether the student's testing tools show: only with ?dev in the address, and only when the app is opened on this
 * computer (localhost or 127.0.0.1), so no one using the live site ever sees them, even by adding ?dev.
 */
export function devToolsOn(address) {
  const url = new URL(address);
  return url.searchParams.has("dev") && ["localhost", "127.0.0.1"].includes(url.hostname);
}

const TIME_RANGES = [{ days: 7, label: "Last 7 days" }, { days: 30, label: "Last 30 days" }, { days: null, label: "All time" }];
// `page` is the topic whose own page is open (its key), "" for the main page; the other filters belong to the main page.
export const DEFAULT_STATS_FILTERS = { course: "", subject: "", topic: "", category: "", days: null, sort: "lowest", page: "" };
// Ideas shown before "Show all", so a long history does not make the page endless.
const IDEAS_SHOWN = 25;
const MARKS = { right: "✓", close: "~", missed: "✗" };
const OUTCOME_WORDS = { right: "right", close: "close", missed: "missed" };

/** Saved filters made safe to use: anything unexpected falls back to the default. */
export function cleanStatsFilters(saved) {
  const filters = { ...DEFAULT_STATS_FILTERS };
  if (!saved || typeof saved !== "object") return filters;
  for (const key of ["course", "subject", "topic", "category", "page"]) if (typeof saved[key] === "string") filters[key] = saved[key];
  if (saved.days === 7 || saved.days === 30) filters.days = saved.days;
  if (IDEA_SORTS.some((sort) => sort.id === saved.sort)) filters.sort = saved.sort;
  return filters;
}

const percentText = (value) => (value === null ? "—" : `${value}%`);
const dateText = (time) => new Date(time).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** A table cell; `label` names the column, shown beside the value when a pstats-stack table is stacked on a phone. */
const cell = (label, children, className = "") => el("td", { className, attrs: { "data-label": label } }, children);

/** Right, close and missed as one bar, so a row's mix can be seen at a glance; the numbers beside it say the same. */
function splitBar({ answered, right, close, missed }) {
  const part = (count, kind) => el("span", { className: `pstats-split-${kind}`, attrs: { style: `flex-grow: ${count}` } });
  return el("span", { className: "pstats-split", attrs: { "aria-hidden": "true" } }, answered === 0 ? [] : [part(right, "right"), part(close, "close"), part(missed, "missed")]);
}

/** The table for accuracy by question type or by level. */
function accuracyTable(className, firstHeading, rows) {
  const headings = [firstHeading, "Answered", "Right", "Close", "Missed", "% right"];
  return el("div", { className: "pstats-table-wrap" }, [el("table", { className: `pstats-table ${className}` }, [
    el("thead", {}, [el("tr", {}, headings.map((text) => el("th", { text, attrs: { scope: "col" } })))]),
    el("tbody", {}, rows.map((row) => el("tr", {}, [
      el("th", { text: row.label, attrs: { scope: "row", "data-label": firstHeading } }),
      cell("Answered", [String(row.answered)]),
      cell("Right", [String(row.right)]),
      // Multiple choice and true or false are right or wrong; only written answers can be close.
      cell("Close", [row.id === "multiple-choice" || row.id === "true-false" ? "—" : String(row.close)]),
      cell("Missed", [String(row.missed)]),
      cell("% right", [el("span", { className: "pstats-percent", text: percentText(row.percentRight) }), splitBar(row)], "pstats-percent-cell"),
    ]))),
  ])]);
}

/**
 * Builds the view. `getBank()` gives the current question bank; `filters` is the saved filter object, changed in
 * place; `onChange()` is called after a filter changes, to save it; `groupIdeas(topic)` sorts a topic's ungrouped ideas
 * into categories (one AI request) and resolves to {} or { message }; `onBankChange()` saves the bank after this view
 * changed it in place (sample data added or removed). Returns { element, draw }.
 */
export function createStatsView({ getBank, filters, onChange, groupIdeas, onBankChange }) {
  const element = el("section", { className: "pstats", attrs: { "aria-label": "Your stats" } });
  let search = "";
  let showAllIdeas = false;
  const ideasBody = el("div", { className: "pstats-ideas-body" });

  const change = (update) => {
    Object.assign(filters, update);
    showAllIdeas = false;
    onChange();
    draw();
  };
  const clearButton = () => button("Clear filters", { onClick: () => change({ course: "", subject: "", topic: "", category: "", days: null }) });
  const filtered = () => Boolean(filters.course || filters.subject || filters.topic || filters.category || filters.days);
  // The topic whose ideas are being grouped (its key) while the AI works, and a failure message per topic.
  let grouping = null;
  const groupErrors = {};
  // Changing categories (step B, no AI request): the rows left open (by key, kept across redraws), the row being renamed
  // and its error, the idea getting a new category ({ key, idea }) and its error, what the last change did, and a field
  // to focus once drawn.
  const openCategories = new Set();
  let renaming = null;
  let renameError = "";
  let movingNew = null;
  let moveError = "";
  let categoryMessage = "";
  let focusAfterDraw = null;

  /** A labelled menu for one filter, in the hue of that part of the student's situation, as in the Practice form. */
  function menu(id, kind, label, options, value, onPick) {
    const node = el("select", { attrs: { id } }, options.map((option) => el("option", { text: option.label, attrs: { value: option.value } })));
    node.value = options.some((option) => option.value === value) ? value : "";
    node.addEventListener("change", () => onPick(node.value));
    return el("div", { className: "filter-field pstats-filter", attrs: { "data-kind": kind } }, [el("label", { attrs: { for: id } }, [renderIcon(kind), label]), node]);
  }

  // The testing tools' last message (what the last press did), kept across redraws until the next press.
  const devTools = devToolsOn(window.location.href);
  let devMessage = "";
  const answeredIn = (bank) => practiceStats(bank, DEFAULT_STATS_FILTERS).totals.answered;
  const ownAnswersLeft = (count) => (count === 0 ? "You have no answers of your own yet." : `Your own answers are untouched (${count} ${count === 1 ? "answer" : "answers"}).`);

  /** Adds or removes the sample answers in place, saves, redraws, and says what changed beside the buttons. */
  function changeSample(adding) {
    const bank = getBank();
    try {
      const before = countSampleAnswers(bank);
      if (adding && before > 0) devMessage = `Sample data is already in (${before} sample answers). Remove it first to add it fresh.`;
      else if (!adding && before === 0) devMessage = "There was no sample data to remove.";
      else {
        (adding ? addSampleData : removeSampleData)(bank);
        onBankChange();
        // The sample is in classes of its own, so a class or topic filter would hide all of it (the student's Chrome,
        // 2026-11-19): adding clears the filters, so the sample is in view, and says so.
        const hidden = adding && filtered();
        if (hidden) {
          Object.assign(filters, { course: "", subject: "", topic: "", category: "", days: null });
          onChange();
        }
        devMessage = adding
          ? `Added ${countSampleAnswers(bank)} sample answers.${hidden ? " Your filters were cleared so you can see them." : ""}`
          : `Removed ${before} sample answers. ${ownAnswersLeft(answeredIn(bank))}`;
      }
    } catch (error) {
      devMessage = `That did not work: ${error.message}`;
    }
    draw();
  }
  // Whenever sample answers are in: a notice at the top, so they are never taken for real ones.
  const sampleNotice = (count) => el("div", { className: "pstats-sample", attrs: { "data-kind": "horizon", role: "note" } }, [
    renderIcon("notes"),
    el("p", {}, [el("strong", { text: "Sample answers are included." }), ` ${count} made-up answers in four classes are mixed in with yours, added for testing.`]),
    ...(devTools ? [] : [button("Remove sample data", { onClick: () => changeSample(false) })]),
  ]);
  // The student's testing tools (?dev on this computer only), at the top so what a press did is always in view.
  const devBox = () => el("div", { className: "pstats-dev", attrs: { "data-kind": "proven" } }, [
    el("p", { className: "pstats-dev-title" }, [renderIcon("task"), "Testing tools", el("span", { text: "only at ?dev on this computer" })]),
    el("div", { className: "pstats-dev-actions" }, [
      button("Add sample data", { onClick: () => changeSample(true) }),
      button("Remove sample data", { onClick: () => changeSample(false) }),
    ]),
    el("p", { className: "pstats-dev-status", text: devMessage, attrs: { role: "status" } }),
  ]);

  function drawFilters(bank) {
    const options = filterOptions(bank, filters);
    const topicLabel = (topic) => (filters.course || !topic.course ? topic.label : `${topic.label} (${topic.course})`);
    return el("div", { className: "pstats-filters" }, [
      el("div", { className: "pstats-menus" }, [
        menu("pstats-course", "course", "Class", [{ value: "", label: "All classes" }, ...options.courses.map((course) => ({ value: course, label: course }))], filters.course, (course) => change({ course, topic: "", category: "" })),
        menu("pstats-subject", "subject", "Subject area", [{ value: "", label: "All subject areas" }, ...options.subjects.map((subject) => ({ value: subject.id, label: subject.label }))], filters.subject, (subject) => change({ subject, topic: "", category: "" })),
        menu("pstats-topic", "material", "Topic", [{ value: "", label: "All topics" }, ...options.topics.map((topic) => ({ value: topic.key, label: topicLabel(topic) }))], filters.topic, (topic) => change({ topic, category: "" })),
        menu("pstats-category", "task", "Category", [{ value: "", label: "All categories" }, ...options.categories.map((category) => ({ value: category.key, label: filters.topic ? category.label : `${category.label} (${category.topic})` }))], filters.category, (category) => change({ category })),
      ]),
      timeRow(filtered() ? [clearButton()] : []),
    ]);
  }

  /** The time range buttons (shared by the main page and a topic page), then `extra`. */
  function timeRow(extra = []) {
    return el("div", { className: "pstats-time-row", attrs: { "data-kind": "horizon" } }, [
      el("span", { className: "pstats-time-label", text: "Time", attrs: { "aria-hidden": "true" } }),
      el("div", { className: "pstats-time", attrs: { role: "group", "aria-label": "Time range" } }, TIME_RANGES.map((range) => {
        const node = button(range.label, { onClick: () => change({ days: range.days }) });
        node.setAttribute("aria-pressed", String(filters.days === range.days));
        return node;
      })),
      ...extra,
    ]);
  }

  /** "Showing: BIOL 201 · last 7 days", so it is always clear what the numbers are about. */
  function showing(bank) {
    const topic = filterOptions(bank, filters).topics.find((option) => option.key === filters.topic);
    const subject = filterOptions(bank, filters).subjects.find((option) => option.id === filters.subject);
    const category = filterOptions(bank, filters).categories.find((option) => option.key === filters.category);
    const parts = [filters.course, subject?.label, topic?.label, category?.label].filter(Boolean);
    const time = TIME_RANGES.find((range) => range.days === filters.days).label.toLowerCase();
    return el("p", { className: "pstats-showing" }, [el("strong", { text: "Showing: " }), `${parts.length ? parts.join(" · ") : "every class and topic"}, ${time}`]);
  }

  function tile(kind, icon, label, value, note) {
    return el("div", { className: "pstats-tile", attrs: { "data-kind": kind } }, [
      renderIcon(icon),
      el("div", {}, [
        el("p", { className: "pstats-tile-value", text: value }),
        el("p", { className: "pstats-tile-label", text: label }),
        el("p", { className: "pstats-tile-note", text: note }),
      ]),
    ]);
  }

  function drawTiles(totals) {
    const range = filters.days ? `in the last ${filters.days} days` : `since ${dateText(totals.firstAt)}`;
    return el("div", { className: "pstats-tiles" }, [
      tile("sessions", "sessions", "Answered", String(totals.answered), `${totals.questions} different ${totals.questions === 1 ? "question" : "questions"}`),
      tile("done", "done", "Right", percentText(totals.percentRight), `${totals.right} of ${totals.answered}${totals.close ? ` · ${totals.close} close` : ""}`),
      tile("horizon", "horizon", "Waiting for review", String(totals.toReview), "last answer was close or missed"),
      tile("library", "week", "Days practised", String(totals.days), range),
    ]);
  }

  function ideaRow(idea) {
    const marks = idea.last.map((outcome) => el("span", { className: `pstats-mark ${outcome}`, text: MARKS[outcome] }));
    return el("tr", {}, [
      el("th", { className: "pstats-idea-name", text: idea.concept, attrs: { scope: "row", "data-label": "Idea" } }),
      cell("Category", [idea.category], "pstats-topic-cell"),
      cell("Topic", [el("span", {}, [idea.topic || "No topic given", ...(idea.course ? [el("span", { className: "pstats-course", text: ` · ${idea.course}` })] : [])])], "pstats-topic-cell"),
      cell("Answered", [String(idea.answered)]),
      cell("% right", [el("span", { className: "pstats-percent", text: percentText(idea.percentRight) })]),
      cell("Latest", [el("span", { className: "pstats-marks", attrs: { role: "img", "aria-label": `Latest answers, newest first: ${idea.last.map((outcome) => OUTCOME_WORDS[outcome]).join(", ")}` } }, marks)]),
      cell("Last practised", [whenLabel(idea.lastAt)]),
    ]);
  }

  /** The ideas table on its own, so typing in the search box redraws only this and keeps the cursor. */
  function drawIdeas(ideas) {
    const found = sortIdeas(searchIdeas(ideas, search), filters.sort);
    const shown = showAllIdeas ? found : found.slice(0, IDEAS_SHOWN);
    const headings = ["Idea", "Category", "Topic", "Answered", "% right", "Latest", "Last practised"];
    ideasBody.replaceChildren(
      el("p", { className: "pstats-count", attrs: { "aria-live": "polite" }, text: search ? `${found.length} of ${ideas.length} ideas match “${search.trim()}”` : `${ideas.length} ${ideas.length === 1 ? "idea" : "ideas"}` }),
      ...(found.length === 0 ? [el("p", { className: "pstats-empty", text: "No idea, topic or class matches that search." })] : [
        el("div", { className: "pstats-table-wrap" }, [el("table", { className: "pstats-table pstats-stack pstats-ideas" }, [
          el("thead", {}, [el("tr", {}, headings.map((text) => el("th", { text, attrs: { scope: "col" } })))]),
          el("tbody", {}, shown.map(ideaRow)),
        ])]),
      ]),
      ...(found.length > shown.length ? [button(`Show all ${found.length} ideas`, { onClick: () => { showAllIdeas = true; drawIdeas(ideas); } })] : []),
    );
  }

  /** Presses "Group my ideas" for one topic: waits for the AI, then redraws with the ideas in their categories. */
  async function group(topic) {
    grouping = topic.key;
    delete groupErrors[topic.key];
    draw();
    const result = await groupIdeas(topic);
    grouping = null;
    if (result.message) groupErrors[topic.key] = result.message;
    draw();
  }

  /** The class and topic of the category `category` belongs to, as the question bank names them. */
  const aboutOf = (category) => {
    const entry = getBank().topics[category.topicKey];
    return { course: entry.course, topic: entry.topic };
  };

  /** Saves a category change, says what it did, and redraws with `opened` open. */
  function afterCategoryChange(message, opened) {
    onBankChange();
    categoryMessage = message;
    openCategories.add(opened);
    draw();
  }

  /** Saves the name typed for `category`: renames it, or merges it into a category the topic already has. */
  function saveRename(category, typed) {
    const result = renameCategory(getBank(), aboutOf(category), category.name, typed);
    if (result.error) {
      renameError = result.error;
      draw();
      return;
    }
    const key = categoryKeyOf(category.topicKey, result.name);
    renaming = null;
    renameError = "";
    openCategories.delete(category.key);
    if (filters.category === category.key) {
      filters.category = key;
      onChange();
    }
    afterCategoryChange(result.merged
      ? `“${result.from}” joined “${result.name}”, which this topic already had. Its ideas are all there now.`
      : `Renamed “${result.from}” to “${result.name}”.`, key);
  }

  /** Files `idea` of `category` under the category named `to` (existing or new). */
  function saveMove(category, idea, to) {
    const result = moveIdea(getBank(), aboutOf(category), idea, to);
    if (result.error) {
      moveError = result.error;
      draw();
      return;
    }
    movingNew = null;
    moveError = "";
    afterCategoryChange(`Moved “${idea}” to “${result.name}”${result.created ? ", a new category" : ""}.`, categoryKeyOf(category.topicKey, result.name));
  }

  /** A text box for a category name with Save-style and Cancel buttons; Enter saves and Escape cancels. */
  function nameForm(className, id, label, value, error, saveLabel, onSave, onCancel) {
    const field = el("input", { attrs: { id, type: "text", maxlength: String(CATEGORY_NAME_LIMIT), autocomplete: "off" } });
    field.value = value;
    field.addEventListener("keydown", (event) => {
      if (event.key === "Enter") onSave(field.value);
      if (event.key === "Escape") onCancel();
    });
    focusAfterDraw = field;
    return el("div", { className: `pstats-name-form ${className}` }, [
      el("label", { text: label, attrs: { for: id } }),
      el("div", { className: "pstats-name-row" }, [field, button(saveLabel, { primary: true, onClick: () => onSave(field.value) }), button("Cancel", { onClick: onCancel })]),
      ...(error ? [el("p", { className: "error", text: error, attrs: { role: "alert" } })] : []),
    ]);
  }

  /** An idea's Move to menu: the topic's other categories, then a new one. */
  function moveMenu(category, idea, others, index) {
    const menuNode = el("select", { className: "pstats-move", attrs: { "aria-label": `Move ${idea.concept} to another category`, id: `pstats-move-${index}` } }, [
      el("option", { text: "Move to…", attrs: { value: "" } }),
      ...others.map((name) => el("option", { text: name, attrs: { value: name } })),
      el("option", { text: "New category…", attrs: { value: "new" } }),
    ]);
    menuNode.addEventListener("change", () => {
      if (menuNode.value === "new") {
        movingNew = { key: category.key, idea: idea.concept };
        moveError = "";
        draw();
      } else if (menuNode.value) saveMove(category, idea.concept, menuNode.value);
    });
    return menuNode;
  }

  /** One category as a row that opens to its ideas, with Rename and Move to; "Not grouped yet" also offers to group that topic's ideas. */
  function categoryRow(category, topics, index) {
    const topic = topics.find((entry) => entry.key === category.topicKey);
    const others = topicCategories(getBank(), aboutOf(category)).filter((name) => !category.grouped || name.toLowerCase() !== category.name.toLowerCase());
    const ideaHeadings = ["Idea", "Answered", "% right", "Latest", "Move to"];
    const moving = movingNew?.key === category.key ? movingNew.idea : null;
    const row = el("details", { className: `pstats-category${category.grouped ? "" : " ungrouped"}` }, [
      el("summary", {}, [
        el("span", { className: "pstats-category-title" }, [
          el("span", { className: "pstats-category-name", text: category.name }),
          el("span", { className: "pstats-course", text: [category.topic || "No topic given", category.course].filter(Boolean).join(" · ") }),
        ]),
        el("span", { className: "pstats-category-figure", attrs: { "data-label": "Answered" } }, [el("span", { className: "pstats-category-answered", text: String(category.answered) })]),
        el("span", { className: "pstats-category-figure", attrs: { "data-label": "% right" } }, [el("span", { className: "pstats-percent", text: percentText(category.percentRight) }), splitBar(category)]),
        el("span", { className: "pstats-category-figure", attrs: { "data-label": "To review" } }, [String(category.toReview)]),
        el("span", { className: "pstats-category-figure", attrs: { "data-label": "Ideas" } }, [String(category.ideas.length)]),
      ]),
      el("table", { className: "pstats-table pstats-stack pstats-category-ideas" }, [
        el("thead", {}, [el("tr", {}, ideaHeadings.map((text) => el("th", { text, attrs: { scope: "col" } })))]),
        el("tbody", {}, category.ideas.map((idea, ideaIndex) => el("tr", {}, [
          el("th", { text: idea.concept, attrs: { scope: "row" } }),
          cell("Answered", [String(idea.answered)]),
          cell("% right", [el("span", { className: "pstats-percent", text: percentText(idea.percentRight) })]),
          cell("Latest", [el("span", { className: "pstats-marks", attrs: { role: "img", "aria-label": `Latest answers, newest first: ${idea.last.map((outcome) => OUTCOME_WORDS[outcome]).join(", ")}` } }, idea.last.map((outcome) => el("span", { className: `pstats-mark ${outcome}`, text: MARKS[outcome] })))]),
          cell("Move to", [moveMenu(category, idea, others, `${index}-${ideaIndex}`)], "pstats-move-cell"),
        ]))),
      ]),
      ...(moving ? [nameForm("pstats-move-new", `pstats-new-${index}`, `New category for “${moving}”`, "", moveError, "Move",
        (typed) => saveMove(category, moving, typed), () => { movingNew = null; moveError = ""; draw(); })] : []),
      ...(!category.grouped ? [] : renaming === category.key
        ? [nameForm("pstats-rename", `pstats-rename-${index}`, "New name for this category", category.name, renameError, "Save",
          (typed) => saveRename(category, typed), () => { renaming = null; renameError = ""; draw(); })]
        : [el("div", { className: "pstats-category-tools" }, [button("Rename category", { onClick: () => { renaming = category.key; renameError = ""; draw(); } })])]),
    ]);
    row.open = openCategories.has(category.key);
    row.addEventListener("toggle", () => (row.open ? openCategories.add(category.key) : openCategories.delete(category.key)));
    if (category.grouped || !topic || !groupIdeas) return el("li", {}, [row]);
    const working = grouping === topic.key;
    return el("li", {}, [row, el("div", { className: "pstats-group-ask" }, [
      button(working ? "Grouping your ideas…" : "Group my ideas · 1 AI request", { disabled: grouping !== null, onClick: () => group(topic) }),
      el("p", { text: `Sorts the ideas on ${category.topic || "this topic"} that came before categories. Only the idea names are sent.` }),
      ...(groupErrors[topic.key] ? [el("p", { className: "error", text: groupErrors[topic.key], attrs: { role: "alert" } })] : []),
    ])]);
  }

  function categoriesSection(categories, topics) {
    return el("section", { className: "pstats-section", attrs: { "data-kind": "task" } }, [
      el("h4", { text: "Categories" }),
      el("p", { className: "pstats-section-note", text: "Broader areas that several ideas fall under, weakest first. Open one to see its ideas, rename it, or move an idea to another category." }),
      el("p", { className: "pstats-category-status", text: categoryMessage, attrs: { role: "status" } }),
      el("div", { className: "pstats-category-head", attrs: { "aria-hidden": "true" } }, ["Category", "Answered", "% right", "To review", "Ideas"].map((text) => el("span", { text }))),
      el("ul", { className: "pstats-categories" }, categories.map((category, index) => categoryRow(category, topics, index))),
    ]);
  }

  function ideasSection(ideas) {
    const searchBox = el("input", { attrs: { id: "pstats-search", type: "search", placeholder: "e.g. stack, Krebs, HIST 277", autocomplete: "off" } });
    searchBox.value = search;
    searchBox.addEventListener("input", () => { search = searchBox.value; showAllIdeas = false; drawIdeas(ideas); });
    const sort = el("select", { attrs: { id: "pstats-sort" } }, IDEA_SORTS.map((option) => el("option", { text: option.label, attrs: { value: option.id } })));
    sort.value = filters.sort;
    sort.addEventListener("change", () => { filters.sort = sort.value; onChange(); drawIdeas(ideas); });
    drawIdeas(ideas);
    return el("section", { className: "pstats-section", attrs: { "data-kind": "practice" } }, [
      el("h4", { text: "Ideas" }),
      el("p", { className: "pstats-section-note", text: "The specific idea each question tested, within its topic and category. Latest shows the last five answers, newest first: ✓ right, ~ close, ✗ missed." }),
      el("div", { className: "pstats-idea-tools" }, [
        el("div", { className: "pstats-tool" }, [el("label", { text: "Find an idea", attrs: { for: "pstats-search" } }), searchBox]),
        el("div", { className: "pstats-tool" }, [el("label", { text: "Sort by", attrs: { for: "pstats-sort" } }), sort]),
      ]),
      ideasBody,
    ]);
  }

  function topicsSection(topics) {
    const headings = ["Topic", "Class", "Answered", "% right", "Waiting for review", "Last practised"];
    return el("section", { className: "pstats-section", attrs: { "data-kind": "material" } }, [
      el("h4", { text: "Topics" }),
      el("p", { className: "pstats-section-note", text: "Open a topic for a page of its own numbers." }),
      el("div", { className: "pstats-table-wrap" }, [el("table", { className: "pstats-table pstats-stack pstats-topics" }, [
        el("thead", {}, [el("tr", {}, headings.map((text) => el("th", { text, attrs: { scope: "col" } })))]),
        el("tbody", {}, topics.map((topic) => {
          const open = button(topic.topic, { onClick: () => openTopic(topic.key) });
          open.classList.add("pstats-topic-link");
          open.dataset.topic = topic.key;
          open.setAttribute("aria-label", `Open the page for ${topic.topic}`);
          return el("tr", {}, [
            // The short label is the header; the wording typed in the form stays underneath, so it can still be recognised.
            el("th", { attrs: { scope: "row", "data-label": "Topic" } }, [open, ...(topic.typed && topic.typed.toLowerCase() !== topic.topic.toLowerCase() ? [el("span", { className: "pstats-typed", text: topic.typed })] : [])]),
            cell("Class", [topic.course || "—"]),
            cell("Answered", [String(topic.answered)]),
            cell("% right", [el("span", { className: "pstats-percent", text: percentText(topic.percentRight) }), splitBar(topic)], "pstats-percent-cell"),
            cell("Waiting for review", [String(topic.toReview)]),
            cell("Last practised", [whenLabel(topic.lastAt)]),
          ]);
        })),
      ])]),
    ]);
  }

  // The topic page's heading, to focus once it is drawn; where the main page was scrolled to when a topic was opened.
  let topicHeading = null;
  let mainScroll = null;

  /**
   * Opens the topic page for `key`. It swaps in at once and starts at the top of the screen, as the app's other screens
   * do, with no smooth scroll (the student found that "irritating", 2026-11-19); the cursor goes to its heading.
   */
  function openTopic(key) {
    mainScroll = window.scrollY;
    filters.page = key;
    onChange();
    draw();
    window.scrollTo({ top: 0 });
    topicHeading?.focus({ preventScroll: true });
  }

  /** Back to the main page, as it was and where it was scrolled to, with the cursor on the topic just left. */
  function closeTopic() {
    const leaving = filters.page;
    filters.page = "";
    onChange();
    draw();
    const link = [...element.querySelectorAll(".pstats-topic-link")].find((node) => node.dataset.topic === leaving);
    if (mainScroll !== null) window.scrollTo({ top: mainScroll });
    else link?.scrollIntoView({ block: "center" }); // opened before a reload: no position kept, so go to the topic
    mainScroll = null;
    link?.focus({ preventScroll: true });
  }

  /** Tiles, accuracy by type and level, categories and ideas for `numbers`; the topics table too on the main page. */
  function statsBody(numbers, withTopics) {
    return [
      drawTiles(numbers.totals),
      el("div", { className: "pstats-pair" }, [
        el("section", { className: "pstats-section", attrs: { "data-kind": "struggle" } }, [el("h4", { text: "By question type" }), accuracyTable("pstats-kinds", "Question type", numbers.byKind)]),
        el("section", { className: "pstats-section", attrs: { "data-kind": "level" } }, [el("h4", { text: "By level" }), accuracyTable("pstats-levels", "Level", numbers.byLevel)]),
      ]),
      categoriesSection(numbers.categories, numbers.topics),
      ideasSection(numbers.ideas),
      ...(withTopics ? [topicsSection(numbers.topics)] : []),
    ];
  }

  const backButton = () => {
    const node = button("← All your stats", { onClick: closeTopic });
    node.classList.add("pstats-back");
    return node;
  };

  /** The page of one topic (`topic` from the all-time numbers): back button, header, time range and its own numbers. */
  function topicPage(bank, topic, top) {
    const numbers = practiceStats(bank, { ...DEFAULT_STATS_FILTERS, course: topic.course, topic: topic.key, days: filters.days });
    topicHeading = el("h3", { text: topic.topic, attrs: { tabindex: "-1" } });
    const typed = topic.typed && topic.typed.toLowerCase() !== topic.topic.toLowerCase() ? topic.typed : "";
    return el("div", { className: "pstats-topic-page" }, [
      backButton(),
      el("header", { className: "pstats-topic-head", attrs: { "data-kind": "material" } }, [
        renderIcon("material"),
        el("div", {}, [
          el("p", { className: "pstats-topic-kicker", text: "Topic" }),
          topicHeading,
          el("p", { className: "pstats-topic-sub", text: [topic.course || "No class given", typed && `You typed “${typed}”`].filter(Boolean).join(" · ") }),
        ]),
      ]),
      ...top,
      timeRow(),
      ...(numbers.totals.answered === 0
        ? [el("div", { className: "pstats-none" }, [el("p", { text: "Nothing answered on this topic in this time range." }), button("All time", { onClick: () => change({ days: null }) })])]
        : statsBody(numbers, false)),
    ]);
  }

  function draw() {
    focusAfterDraw = null;
    topicHeading = null;
    const bank = getBank();
    const all = practiceStats(bank, DEFAULT_STATS_FILTERS);
    const heading = [
      el("h3", { text: "Your stats" }),
      el("p", { className: "pstats-intro", text: "Every practice answer you’ve given in this browser, counted as it happened. Use the filters to look at one class, subject area, topic or stretch of time." }),
    ];
    if (all.totals.answered === 0) {
      element.replaceChildren(...heading, el("p", { className: "pstats-empty", text: "No answers yet. Answer practice questions under Practise, and every answer is counted here: by class, topic, question type, level and idea." }), ...(devTools ? [devBox()] : []));
      return;
    }
    const samples = countSampleAnswers(bank);
    const top = [...(devTools ? [devBox()] : []), ...(samples ? [sampleNotice(samples)] : [])];
    // A topic page whose topic is gone (its answers removed) gives way to the main page.
    const pageTopic = filters.page && all.topics.find((topic) => topic.key === filters.page);
    if (filters.page && !pageTopic) {
      filters.page = "";
      onChange();
    }
    if (pageTopic) {
      element.replaceChildren(topicPage(bank, pageTopic, top));
      focusAfterDraw?.focus();
      return;
    }
    // A topic that no longer fits the class or subject area chosen is let go, so the menu and the numbers agree.
    if (filters.topic && !filterOptions(bank, filters).topics.some((topic) => topic.key === filters.topic)) filters.topic = "";
    if (filters.category && !filterOptions(bank, filters).categories.some((category) => category.key === filters.category)) filters.category = "";
    const numbers = practiceStats(bank, filters);
    const body = numbers.totals.answered === 0
      ? [el("div", { className: "pstats-none" }, [el("p", { text: "No answers match these filters." }), clearButton()])]
      : statsBody(numbers, true);
    element.replaceChildren(...heading, ...top, drawFilters(bank), showing(bank), ...body);
    focusAfterDraw?.focus();
    focusAfterDraw = null;
  }

  return { element, draw };
}
