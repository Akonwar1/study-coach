// Small line icons for the quiz questions, recommendation rows, plan previews, History tiles and the finish screen. The markup below is fixed text written here, never built from user input.

const PATHS = {
  struggle: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
  material: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
  task: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  horizon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  subject: '<path d="M12 3l2.2 5.3L20 9l-4.3 3.8L17 18.5 12 15.5 7 18.5l1.3-5.7L4 9l5.8-.7z"/>',
  time: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sessions: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
  week: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  streak: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  done: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
  plan: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h6a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6"/>',
  proven: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  course: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
  notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
  count: '<path d="M9 4L7 20M17 4l-2 16M4 9h16M3 15h16"/>',
  level: '<path d="M5 20v-5M12 20V10M19 20V4"/>',
  evidence: '<path d="M3.5 16a8.5 8.5 0 0 1 17 0"/><path d="M12 16l4.5-5.5"/><circle cx="12" cy="16" r="1.2"/><path d="M7 6.6l.9 1.4M3.9 11l1.5.7M17 6.6l-.9 1.4M20.1 11l-1.5.7"/>',
};

/** An icon for a row, tile or question: one of the keys above, hidden from screen readers. */
export function renderIcon(kind) {
  const node = document.createElement("span");
  node.className = "why-icon";
  node.setAttribute("aria-hidden", "true");
  node.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${PATHS[kind]}</svg>`;
  return node;
}
