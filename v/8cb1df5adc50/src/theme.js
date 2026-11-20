// Light or dark. Dark is the app's look for everyone (the student, 2026-11-19: "dark mode should be the default and we
// should leave light mode as a less important and sidelined choice"), so light is only a small switch at the foot of
// the page. The choice is saved like the app's other settings, and index.html applies a saved "light" before anything
// is drawn, so the page never flashes dark first. The colours are in styles.css (:root and :root[data-theme="light"]).
import { loadTheme, saveTheme } from "./storage.js";

/** Shows the app in `theme` ("light" or "dark"). */
function apply(theme) {
  if (theme === "light") document.documentElement.dataset.theme = "light";
  else delete document.documentElement.dataset.theme;
}

/** Makes `button` the switch: it offers the other look, and pressing it changes and remembers the choice. */
export function setUpThemeSwitch(button) {
  let theme = loadTheme();
  const label = () => {
    button.textContent = theme === "light" ? "☾ Dark mode" : "☀ Light mode";
    button.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  };
  apply(theme);
  label();
  button.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    apply(theme);
    saveTheme(theme);
    label();
  });
}
