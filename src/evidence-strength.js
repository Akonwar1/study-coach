// How strong is the evidence for each method? A fixed rubric of six questions, each scored 0, 1 or 2, with a one-line
// reason for every score. Each reason names the studies it rests on, and a test checks that every name appears in that
// method's source list, so a score cannot point at a study the page does not cite.
//
// Alongside the score, each method carries cautions (also tied to named studies) and, where one source gives it, how much
// the results vary between studies. These are shown but not scored, because they do not separate the methods: every
// technique Donoghue and Hattie measured had results that varied a great deal.
//
// The rating is about evidence that the method helps you LEARN. It is not the same as the size of the effect: a method
// can have a large measured effect from a few studies and still be rated thin.

export const CRITERIA = [
  {
    id: "direct",
    name: "Tested as taught here",
    question: "Has the method itself, as this app teaches it, been compared with a control group?",
    scale: { 2: "Several controlled experiments of the method found a benefit", 1: "A few, or only of its key ingredients or a close relative", 0: "Direct tests found no benefit, or none exist" },
  },
  {
    id: "pooled",
    name: "Pooled across studies",
    question: "Has a meta-analysis combined many studies of it?",
    scale: { 2: "A meta-analysis pooled many studies of the method itself", 1: "Only a part or a close relative was pooled", 0: "No pooled analysis" },
  },
  {
    id: "agree",
    name: "Independent reviews agree",
    question: "Do separate research teams reach the same conclusion?",
    scale: { 2: "Two or more independent reviews agree it helps", 1: "One review, or reviews that differ a lot in strength", 0: "None, or they disagree" },
  },
  {
    id: "material",
    name: "Works across material",
    question: "Does it help for different kinds of material and tasks?",
    scale: { 2: "Benefit found across several kinds, with no kind where it fails", 1: "Limited to one kind of material, or fails or is unclear for some", 0: "No benefit found" },
  },
  {
    id: "lasting",
    name: "Lasting learning",
    question: "Did the benefit show up on tests days or weeks later?",
    scale: { 2: "Benefit held on tests days or weeks later", 1: "Learning measured, but mostly soon after, mixed, or the delay is not shown", 0: "Only feelings or effort were measured" },
  },
  {
    id: "field",
    name: "Tested in real classes",
    question: "Has it been tested in real classrooms or courses, not only in lab sessions?",
    scale: { 2: "A pooled review or several experiments in real classes or courses found a benefit", 1: "One or a few such studies, or only lab sessions with students", 0: "No such study, or it found no benefit" },
  },
];

export const MAX_SCORE = CRITERIA.length * 2;

// Strong allows at most one missing point and needs full marks for "works across material" and "lasting learning".
export const RATING_RULES = [
  { rating: "Strong", rule: "11 or 12 points, with full marks for “works across material” and “lasting learning”" },
  { rating: "Moderate", rule: "7 to 10 points, or 11 or more with a gap in either of those two" },
  { rating: "Thin", rule: "6 points or fewer: on average one point or less per question" },
];

export function totalScore(scores) {
  return CRITERIA.reduce((sum, criterion) => sum + scores[criterion.id], 0);
}

export function ratingFor(scores) {
  const total = totalScore(scores);
  if (total >= 11 && scores.material === 2 && scores.lasting === 2) return "Strong";
  if (total <= 6) return "Thin";
  return "Moderate";
}

/** Every single one-point change to one score that would move the rating, e.g. { criterion, change: 1, becomes: "Strong" }. */
export function nearCutoffs(scores) {
  const rating = ratingFor(scores);
  const flips = [];
  for (const criterion of CRITERIA) {
    for (const change of [-1, 1]) {
      const value = scores[criterion.id] + change;
      if (value < 0 || value > 2) continue;
      const becomes = ratingFor({ ...scores, [criterion.id]: value });
      if (becomes !== rating) flips.push({ criterion: criterion.id, change, becomes });
    }
  }
  return flips;
}

const FIRST = { Strong: 3, Moderate: 2, Thin: 1 };

/** A sentence about the closest cut-off, or null when no single point would move the rating. */
export function describeNearCutoffs(scores) {
  const flips = nearCutoffs(scores);
  if (!flips.length) return null;
  const name = (flip) => `“${CRITERIA.find((c) => c.id === flip.criterion).name.toLowerCase()}”`;
  const names = (list) => (list.length > 3 ? "any question" : list.map(name).join(" or "));
  const up = flips.filter((flip) => flip.change > 0 && FIRST[flip.becomes] > FIRST[ratingFor(scores)]);
  const down = flips.filter((flip) => flip.change < 0 && FIRST[flip.becomes] < FIRST[ratingFor(scores)]);
  const parts = [];
  if (up.length) parts.push(`one more point on ${names(up)} would make it ${up[0].becomes}`);
  if (down.length) parts.push(`one point less on ${names(down)} would drop it to ${down[0].becomes}`);
  return parts.length ? `Near a cut-off: ${parts.join(", and ")}.` : null;
}

// For each method: a score and a reason (with the studies it rests on) per question, cautions, how much results vary
// between studies (Donoghue & Hattie, 2021, Table 1, where it covers the technique), what the evidence supports, and the
// rating Dunlosky et al. (2013) gave the technique, as a check from outside this rubric.
export const EVIDENCE = {
  "active-recall": {
    supports: "Testing yourself leaves you remembering more, days and weeks later, than re-reading does.",
    dunlosky: "High",
    note: { text: "Reviews put the size of the effect anywhere from g = 0.50 to d = 0.74.", studies: ["Rowland", "Donoghue"] },
    variation: { percent: 86, technique: "practice testing" },
    cautions: [
      { text: "Reviews give different sizes for the same effect: g = 0.50 (Rowland), g = 0.499 (Yang et al.) and d = 0.74 (Donoghue & Hattie).", studies: ["Rowland", "Yang", "Donoghue"] },
      { text: "Published studies showed larger effects than unpublished ones, and lab research on testing has mostly used undergraduates (Rowland, 2014).", studies: ["Rowland"] },
    ],
    criteria: {
      direct: { score: 2, studies: ["Roediger", "Karpicke"], reason: "Roediger & Karpicke (2006) and Karpicke & Blunt (2011) compared testing with re-reading and with concept mapping in controlled experiments." },
      pooled: { score: 2, studies: ["Rowland"], reason: "Rowland (2014) pooled 159 comparisons from 61 studies and found g = 0.50." },
      agree: { score: 2, studies: ["Adesope", "Yang", "Dunlosky"], reason: "Adesope et al. and Yang et al. (2021) found medium effects too, and Dunlosky et al. (2013) rated practice testing “high utility”." },
      material: { score: 2, studies: ["Roediger", "Karpicke"], reason: "The benefit showed up for recalling ideas from passages and for questions that needed inferences. The one reversal, a test minutes away, is about timing, not material." },
      lasting: { score: 2, studies: ["Roediger", "Rowland"], reason: "Tests a week later showed the benefit (Roediger & Karpicke, 2006), and Rowland found testing effects emerge after retention intervals of days or weeks." },
      field: { score: 2, studies: ["Yang"], reason: "Yang et al. (2021) pooled 222 classroom studies with 48,478 students and found g = 0.499." },
    },
  },
  "distributed-practice": {
    supports: "Spreading the same study time over several sessions beats doing it all at once.",
    dunlosky: "High",
    note: { text: "Smaller in real classrooms (d = 0.54) than across all studies (d = 0.85).", studies: ["Mawson", "Donoghue"] },
    variation: { percent: 83, technique: "distributed practice" },
    cautions: [
      { text: "In real classrooms the average was d = 0.54 (Mawson & Kang, 2025), against 0.85 across all studies (Donoghue & Hattie, 2021).", studies: ["Mawson", "Donoghue"] },
      { text: "The classroom studies tested at most 42 days later, and their funnel plot was lopsided, which the authors put down to small studies (Mawson & Kang, 2025).", studies: ["Mawson"] },
    ],
    criteria: {
      direct: { score: 2, studies: ["Rohrer", "Bahrick", "Kornell"], reason: "Rohrer & Taylor (2007), Bahrick et al. (1993) and Kornell (2009) ran controlled experiments comparing spaced with massed practice." },
      pooled: { score: 2, studies: ["Cepeda", "Donovan", "Donoghue"], reason: "Cepeda et al. (2006) pooled 839 comparisons, Donovan & Radosevich (1999) 112 effect sizes and Donoghue & Hattie (2021) 150 comparisons." },
      agree: { score: 2, studies: ["Donovan", "Donoghue", "Dunlosky"], reason: "All of these reviews found that spacing helps, though the average effects differ (0.46 and 0.85), and Dunlosky et al. (2013) rated it “high utility”." },
      material: { score: 2, studies: ["Bahrick", "Rohrer", "Cepeda"], reason: "The benefit appeared for word pairs, trivia and mathematics problems. Most of the research is on facts and procedures, so this is the weakest part of the score." },
      lasting: { score: 2, studies: ["Bahrick", "Cepeda", "Rohrer"], reason: "Tests came a week (Rohrer & Taylor), up to a year (Cepeda et al.) and up to five years (Bahrick et al.) later." },
      field: { score: 2, studies: ["Mawson"], reason: "Mawson & Kang (2025) pooled 22 classroom reports with more than 3,000 students and found d = 0.54 (range 0.31 to 0.77)." },
    },
  },
  "spaced-repetition": {
    supports: "The idea behind it, spacing your reviews, is well supported. This app's exact box schedule is a stand-in that the studies did not test.",
    dunlosky: "High (for spacing, its core idea)",
    note: { text: "The idea is well supported, but this app’s box schedule was never tested.", studies: ["Cepeda"] },
    variation: { percent: 83, technique: "distributed practice, its core idea" },
    cautions: [
      { text: "The Leitner-box intervals (every day, every 3 days, every week) are this app’s stand-in; no study cited here tested them (Cepeda et al., 2008).", studies: ["Cepeda"] },
    ],
    criteria: {
      direct: { score: 1, studies: ["Cepeda"], reason: "Spacing has been tested directly (Cepeda et al., 2008), but not the Leitner-box schedule this app uses." },
      pooled: { score: 1, studies: ["Cepeda", "Latimier"], reason: "Cepeda et al. (2006) pooled 839 comparisons of spacing, and Latimier et al. (2021) pooled 29 studies of spaced retrieval practice, the closest match, but neither tested the box system." },
      agree: { score: 2, studies: ["Cepeda", "Dunlosky"], reason: "Cepeda et al. and Dunlosky et al. (2013, who rated distributed practice “high utility”) agree that spacing helps." },
      material: { score: 1, studies: ["Cepeda"], reason: "The studies behind this page measured memory for words, facts and trivia, and say little about understanding." },
      lasting: { score: 2, studies: ["Cepeda"], reason: "Cepeda et al. (2008) tested recall up to a year after study." },
      field: { score: 1, studies: ["Cepeda"], reason: "The spacing studies behind this page used online volunteers and lab sessions, and none tested flashcard boxes in a real course." },
    },
  },
  "elaborative-interrogation": {
    supports: "Asking “why is this true?” helps you remember facts, especially if you already know something about the topic.",
    dunlosky: "Moderate",
    note: { text: "Helps facts more than deep understanding, and no classroom tests are shown.", studies: ["Donoghue"] },
    variation: { percent: 78, technique: "elaborative interrogation" },
    cautions: [
      { text: "The one pooled analysis reports no check for publication bias (Donoghue & Hattie, 2021).", studies: ["Donoghue"] },
    ],
    criteria: {
      direct: { score: 2, studies: ["Pressley", "Woloshyn", "Donoghue"], reason: "Experiments from Pressley et al. (1987) and Woloshyn et al. (1992) onward are pooled in Donoghue & Hattie’s 254 comparisons." },
      pooled: { score: 2, studies: ["Donoghue"], reason: "Donoghue & Hattie (2021) pooled 254 comparisons and found d = 0.56." },
      agree: { score: 2, studies: ["Donoghue", "Dunlosky"], reason: "Donoghue & Hattie’s meta-analysis and Dunlosky et al.’s review (“moderate utility”) both find a real but middling benefit." },
      material: { score: 1, studies: ["Donoghue"], reason: "Donoghue & Hattie describe it as better suited to surface knowledge than to deep understanding, and the benefit was larger for learners who already knew more." },
      lasting: { score: 1, studies: ["Donoghue"], reason: "The authors warn that most pooled studies measured memory for facts, and this page does not show how long after study the tests came." },
      field: { score: 1, studies: ["Donoghue"], reason: "Nothing on this page shows tests in real classrooms or courses; the pooled studies are mostly short experiments with students." },
    },
  },
  "self-explanation": {
    supports: "Explaining each step to yourself helps you understand and use what you studied, across many tasks and ages.",
    dunlosky: "Moderate",
    note: { text: "Weaker evidence for classroom effects and for long-term retention.", studies: ["Rittle-Johnson"] },
    variation: { percent: 77, technique: "self-explanation" },
    cautions: [
      { text: "Bisra’s checks for missing studies were simple counts, and results varied between studies (I² = 65%).", studies: ["Bisra"] },
      { text: "A mathematics meta-analysis found the evidence for classroom effects and long-term retention weaker (Rittle-Johnson et al., 2017).", studies: ["Rittle-Johnson"] },
    ],
    criteria: {
      direct: { score: 2, studies: ["Chi", "Bisra"], reason: "Chi et al. (1994) prompted students to explain in a controlled experiment, and Bisra et al. pooled 69 such comparisons." },
      pooled: { score: 2, studies: ["Bisra", "Donoghue"], reason: "Bisra et al. (2018) pooled 69 comparisons and Donoghue & Hattie (2021) pooled 93." },
      agree: { score: 2, studies: ["Bisra", "Donoghue"], reason: "Two separate meta-analyses landed almost on top of each other (g = 0.55 and d = 0.54)." },
      material: { score: 2, studies: ["Bisra"], reason: "Bisra et al. coded 20 factors, including problem solving, worked examples, text, subject and level of education, and found it helped across a range of conditions." },
      lasting: { score: 1, studies: ["Rittle-Johnson", "Chi"], reason: "Chi et al. (1994) tested before and after studying, and Rittle-Johnson et al. (2017) report weaker evidence for long-term retention." },
      field: { score: 1, studies: ["Rittle-Johnson", "Chi"], reason: "Chi et al. tested eighth graders in a single experiment, and Rittle-Johnson et al. (2017) report weaker evidence for classroom effects." },
    },
  },
  interleaving: {
    supports: "Mixing problem types helps you tell them apart and choose the right method, mainly for maths-style problems and visual categories.",
    dunlosky: "Moderate",
    note: { text: "The average may be overstated (g = 0.42 falls to 0.29 after adjusting), and it reverses for words.", studies: ["Brunmair"] },
    variation: { percent: 88, technique: "interleaved practice" },
    cautions: [
      { text: "After adjusting for possibly missing studies, the average falls from g = 0.42 to 0.29, still positive (Brunmair & Richter, 2019).", studies: ["Brunmair"] },
    ],
    criteria: {
      direct: { score: 2, studies: ["Rohrer", "Kornell"], reason: "Rohrer & Taylor (2007), Kornell & Bjork (2008) and the Rohrer classroom experiments all compared mixed with blocked practice." },
      pooled: { score: 2, studies: ["Brunmair", "Donoghue"], reason: "Brunmair & Richter (2019) pooled 238 comparisons and Donoghue & Hattie (2021) pooled 104." },
      agree: { score: 2, studies: ["Brunmair", "Donoghue", "Dunlosky"], reason: "The two meta-analyses found similar averages (g = 0.42, d = 0.47), and Dunlosky et al. (2013) gave “moderate” support." },
      material: { score: 1, studies: ["Brunmair"], reason: "Strong for visual categories, small for mathematics, reversed for words (g = −0.39) and unclear for text and tastes." },
      lasting: { score: 2, studies: ["Rohrer"], reason: "Rohrer et al. (2015) tested seventh graders 30 days later and found a large benefit." },
      field: { score: 2, studies: ["Rohrer", "Samani"], reason: "Seventh-grade classroom experiments (Rohrer et al., 2014, 2015) and a university physics course (Samani & Pan, 2021) all favoured interleaving." },
    },
  },
  "dual-coding": {
    supports: "Pictures and diagrams alongside words can help, strongly for things with a shape. Drawing your own diagram of a whole topic has not been tested.",
    dunlosky: "Low (for imagery use, a close relative)",
    note: { text: "The strong results used expert-made graphics; drawing your own was not tested.", studies: ["Mayer", "Wammes"] },
    variation: { percent: 68, technique: "imagery use, a close relative" },
    cautions: [
      { text: "Mayer’s d = 1.35 is a median of 13 comparisons using graphics made by experts; the pooled figure for imagery use is d = 0.56 (Donoghue & Hattie).", studies: ["Mayer", "Donoghue"] },
    ],
    criteria: {
      direct: { score: 1, studies: ["Mayer", "Wammes"], reason: "Mayer’s comparisons used graphics made by experts, and Wammes et al. (2016) tested drawing single words, not whole topics." },
      pooled: { score: 1, studies: ["Mayer", "Donoghue"], reason: "Mayer summarised 13 comparisons, and Donoghue & Hattie pooled 135 for a related technique, imagery use for text." },
      agree: { score: 1, studies: ["Mayer", "Donoghue", "Dunlosky"], reason: "Mayer’s d = 1.35 and Donoghue & Hattie’s d = 0.56 point the same way but differ a lot, and Dunlosky et al. rated imagery use “low utility”." },
      material: { score: 1, studies: ["Dunlosky"], reason: "Dunlosky et al. note it is limited to material that is easy to picture; a list of abstract definitions may gain little." },
      lasting: { score: 1, studies: ["Wammes", "Mayer"], reason: "Wammes et al. tested recall after a short filler task and Mayer used a transfer test; this page does not show tests days later." },
      field: { score: 1, studies: ["Mayer", "Wammes"], reason: "The studies on this page were lab sessions with university students." },
    },
  },
  feynman: {
    supports: "The ingredients (expecting to teach, teaching, recalling from memory) have support. The four-step routine itself has not been tested as a package.",
    dunlosky: "Not reviewed",
    note: { text: "The four-step routine has never been tested, only its parts.", studies: ["Nestojko", "Kobayashi"] },
    variation: null,
    cautions: [
      { text: "The only pooled figures are for ingredients: d = 0.30 to 0.40 for preparing to teach and 0.5 to 0.6 for teaching (Kobayashi, via Fiorella).", studies: ["Kobayashi", "Fiorella"] },
    ],
    criteria: {
      direct: { score: 1, studies: ["Nestojko", "Fiorella", "Koh"], reason: "Pieces were tested (expecting to teach, teaching, recalling), but not the four-step routine together." },
      pooled: { score: 1, studies: ["Kobayashi"], reason: "Kobayashi (2019) pooled 28 studies of preparing to teach and 28 of teaching, which are ingredients, not the routine." },
      agree: { score: 1, studies: ["Kobayashi"], reason: "Only one pooled analysis, and Dunlosky et al. did not review the routine." },
      material: { score: 1, studies: ["Rozenblit"], reason: "Explaining reveals gaps most for things with visible mechanisms and less for facts and stories (Rozenblit & Keil, 2002)." },
      lasting: { score: 1, studies: ["Fiorella"], reason: "Mixed: one study found a benefit on an immediate test but not a delayed one, and another found it on both (Fiorella, 2023)." },
      field: { score: 1, studies: ["Nestojko", "Koh"], reason: "The studies on this page were lab sessions with students learning short lessons." },
    },
  },
  sq3r: {
    supports: "Its Recite step is the likely active ingredient, and that is testing yourself. Tests of SQ3R as a whole have found no edge over students' own methods.",
    dunlosky: "Not reviewed",
    note: { text: "Direct tests found no edge over students’ own study methods.", studies: ["Kasson", "Jairam"] },
    variation: null,
    cautions: [
      { text: "Both direct tests compared SQ3R with a rival system or students’ own methods, and one is a master’s thesis (Jairam et al., 2014; Kasson, 2012).", studies: ["Jairam", "Kasson"] },
    ],
    criteria: {
      direct: { score: 0, studies: ["Jairam", "Kasson"], reason: "Jairam et al. (2014) found a newer system beat SQ3R, and Kasson (2012) found no difference from students’ own methods." },
      pooled: { score: 1, studies: ["Rowland"], reason: "Only its Recite step has been pooled, as testing: Rowland (2014) found g = 0.50." },
      agree: { score: 1, studies: ["Rowland"], reason: "No review covers SQ3R as a package; reviews of testing, its Recite step, agree." },
      material: { score: 0, studies: ["Kasson"], reason: "Kasson (2012) found no benefit over students’ own methods on facts, relationships, concepts or skills." },
      lasting: { score: 1, studies: ["Kasson"], reason: "Kasson measured test scores, but this page does not show how long after study." },
      field: { score: 1, studies: ["Kasson", "Jairam"], reason: "Both direct tests used college students studying assigned material, not a real course’s own exams." },
    },
  },
  pomodoro: {
    supports: "A small, reliable lift in energy and less tiredness. No clear evidence that it makes you learn more.",
    dunlosky: "Not reviewed",
    note: { text: "Helps energy and tiredness, not clearly learning, and no study compared it with no breaks.", studies: ["Albulescu", "Biwer"] },
    variation: null,
    cautions: [
      { text: "Biwer’s study had no group that took no breaks, so it cannot show that scheduled breaks beat working straight through.", studies: ["Biwer"] },
    ],
    criteria: {
      direct: { score: 1, studies: ["Biwer"], reason: "Biwer et al. (2023) compared Pomodoro-style breaks with self-chosen breaks in 87 students for one day, with no group that took no breaks." },
      pooled: { score: 1, studies: ["Albulescu"], reason: "Albulescu et al. (2022) pooled 22 samples on micro-breaks of 10 minutes or less, a close relative." },
      agree: { score: 0, studies: ["Albulescu", "Helton", "Ariga"], reason: "Albulescu found small well-being gains but no clear effect on performance (d = 0.16), and Helton & Russell did not find the attention effect Ariga & Lleras reported." },
      material: { score: 1, studies: ["Albulescu"], reason: "Only tasks with lower thinking demands showed a gain in performance." },
      lasting: { score: 0, studies: ["Biwer", "Albulescu"], reason: "The studies measured mood, fatigue, effort and performance on the task at hand, not learning on a later test." },
      field: { score: 1, studies: ["Biwer"], reason: "Biwer et al. observed students in a day of online-guided self-study, the closest to real study, but only one day and 87 students." },
    },
  },
};

export const hasEvidenceRating = (methodId) => Object.hasOwn(EVIDENCE, methodId);

/** The scores and rating for one method, or null when there is no entry. */
export function evidenceFor(methodId) {
  if (!hasEvidenceRating(methodId)) return null;
  const entry = EVIDENCE[methodId];
  const scores = Object.fromEntries(CRITERIA.map((criterion) => [criterion.id, entry.criteria[criterion.id].score]));
  return { ...entry, scores, total: totalScore(scores), rating: ratingFor(scores), nearCutoff: describeNearCutoffs(scores) };
}

/** Method ids from best to least supported; ties keep the order of `methodIds`. */
export function rankByEvidence(methodIds) {
  return methodIds.filter(hasEvidenceRating).map((id, index) => ({ id, index, total: evidenceFor(id).total }))
    .sort((a, b) => b.total - a.total || a.index - b.index).map((item) => item.id);
}
