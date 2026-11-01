// Every method's tailoring rules, by method id. To add rules for a method:
//   1. Make sure each of its steps in src/methods.js has an `id` (every method's steps already do).
//   2. Write src/adapt/<method-id>.js with a list of rules, using the pieces in src/adapt-kit.js.
//      The wording is the method's own: its reasons and summaries must not repeat another method's.
//   3. Add it below. methods.js attaches it to the method as `adapt`.
//   4. Open plans.html to read every rule's before and after, and tests.html to run the checks. They fail on rules that
//      point at a missing step, use a picture that doesn't exist, change nothing, or reuse another method's wording.
//   5. Add a test for what each rule is meant to do (see "plans: the answers reshape the steps" in tests.html).
import { ACTIVE_RECALL_ADAPT } from "./active-recall.js";

export const ADAPT = {
  "active-recall": ACTIVE_RECALL_ADAPT,
};
