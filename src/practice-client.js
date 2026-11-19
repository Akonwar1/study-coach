// Asks the practice server (worker/practice-server.js) for a set of practice questions, or for feedback on written
// answers. The server holds the Gemini key; the app only ever talks to the server.
import { validateFeedback, validateGroups, validatePracticeSet } from "./practice.js";

const LOCAL_SERVER = "http://127.0.0.1:8787"; // `npm run practice-server`
// The deployed server's address, filled in once it is on Cloudflare (step 4 of the practice plan in PLAN.md).
const LIVE_SERVER = null;
// The server waits up to 40 s for the main model and 90 s for the backup, so give it a little longer than both.
const TIMEOUT_MS = 140_000;

const isLocal = ({ hostname }) => hostname === "localhost" || hostname === "127.0.0.1";

/** The practice server for a page at `where` (window.location): this computer's while building, else the live one or null. */
export function practiceServerUrl(where) {
  return isLocal(where) ? LOCAL_SERVER : LIVE_SERVER;
}

/**
 * POSTs `request` to `path` on the practice server. Resolves to { body } on success or { error, message }, never
 * throwing, so a screen only has to show one or the other. `failed` is the message when the server gives no reason.
 */
async function post(path, request, failed) {
  const server = practiceServerUrl(location);
  if (!server) return { error: "not-set-up", message: "AI practice isn’t switched on in this copy of the app yet." };
  let response;
  try {
    response = await fetch(`${server}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (error?.name === "TimeoutError") return { error: "timeout", message: "The AI took too long to answer. Try again in a moment." };
    const how = isLocal(location)
      ? "On this computer, start it with npm run practice-server, then try again."
      : "Check your internet connection and try again.";
    return { error: "unreachable", message: `Couldn’t reach the practice server. ${how}` };
  }
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (!response.ok) return { error: body?.error ?? "server-error", message: body?.message ?? failed };
  return { body };
}

/** Asks for a set of questions (request already passed cleanPracticeRequest). Resolves to { set } or { error, message }. */
export async function requestPracticeSet(request) {
  const { body, error, message } = await post("/practice", request, "The practice server couldn’t make questions. Try again in a moment.");
  if (error) return { error, message };
  // The server checks the set too; checking here as well means a mistake on either side never shows a broken question.
  const checked = validatePracticeSet(body?.set, request);
  if (!checked.ok) return { error: "bad-set", message: "The AI’s questions couldn’t be used. Try again, or change the topic a little." };
  return { set: checked.set };
}

/**
 * Asks the AI to read written answers (request already passed cleanFeedbackRequest). Resolves to { feedback }, one
 * entry or null per answer in the same order, or { error, message }.
 */
export async function requestFeedback(request) {
  const { body, error, message } = await post("/feedback", request, "The practice server couldn’t read your answers. Try again in a moment.");
  if (error) return { error, message };
  const checked = validateFeedback(body, request);
  if (!checked.ok) return { error: "bad-feedback", message: "The AI’s feedback couldn’t be used. Try again in a moment." };
  return { feedback: checked.feedback };
}

/**
 * Asks the AI to sort older ideas into broader categories (request already passed cleanGroupRequest). Resolves to
 * { groups: [{ idea, category }] } or { error, message }.
 */
export async function requestGrouping(request) {
  const { body, error, message } = await post("/group", request, "The practice server couldn’t group your ideas. Try again in a moment.");
  if (error) return { error, message };
  const checked = validateGroups(body, request);
  if (!checked.ok) return { error: "bad-groups", message: "The AI’s grouping couldn’t be used. Try again in a moment." };
  return { groups: checked.groups };
}
