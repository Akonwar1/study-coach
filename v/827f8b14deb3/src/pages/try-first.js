export default {
  glance: [
    { kind: "effect", symbol: "g", value: 0.54, text: "average boost for the material the guessed questions were about, across 97 comparisons", source: "St. Hilaire, Chan & Ahn, 2024" },
    { kind: "effect", symbol: "g", value: 0.04, text: "average effect on material that was not asked about, which is effectively no effect, across 91 comparisons", source: "St. Hilaire, Chan & Ahn, 2024" },
    { kind: "compare", items: [{ name: "Asked to guess", value: 0.7, tone: "a" }, { name: "Only read the questions", value: 0.22, tone: "c" }], max: 1, decimals: 2, text: "average boost (g) for the material asked about, depending on whether learners guessed first", source: "St. Hilaire, 2022 (dissertation version of the analysis)" },
    { kind: "compare", items: [{ name: "Tested after studying", value: 0.74, tone: "a" }, { name: "Tested before studying", value: 0.35, tone: "c" }], max: 1, decimals: 2, text: "size of the benefit (d) on a test a week later, in one experiment with the same amount of testing time", source: "Latimier et al., 2019" },
  ],
  history: [
    { when: "1960s–1980s", text: "Researchers studied what happened when readers got questions before a text. The idea went by many names, including adjunct questions, inserted questions and pre-passage questions, and interest ran high through the 1980s (St. Hilaire, 2022)." },
    { when: "Late 1990s", text: "Interest faded, then returned over the 15 years before 2022, alongside a wider interest in memory research that could be used in classrooms (St. Hilaire, 2022)." },
    { when: "2009", text: "Richland, Kornell and Kao, and Kornell, Hays and Bjork, published experiments asking whether unsuccessful attempts to answer a question before learning it help later learning. Their papers’ titles pose this as the pretesting effect and say such attempts enhance learning." },
    { when: "2018", text: "Carpenter, Rahman and Perkins tested prequestions in a classroom. As of St. Hilaire’s 2022 dissertation, it was the only known classroom study of the effect." },
    { when: "2019", text: "Latimier and colleagues compared testing before studying with testing after studying, with the same amount of testing time, and found testing after was the stronger of the two." },
    { when: "2024", text: "St. Hilaire, Chan and Ahn published a preregistered meta-analysis of the prequestion effect, separating the benefit for the questioned material from any benefit for everything else." },
  ],
  how: [
    { heading: "What you actually do", text: "Before studying a section, you write questions the section should answer and guess an answer to each. Then you study to find the real answers. Researchers call these prequestions when the answers are hidden inside a longer text, and pretests when the answers are shown directly with the questions (St. Hilaire, 2022)." },
    { heading: "Why it might work: attention", text: "The leading explanation is that a question you have already tried to answer directs your attention to the answer while you study. It is not mainly about slowing forgetting, which is how testing yourself after studying is thought to work (St. Hilaire, 2022). The moderator results gave this attention account moderate support." },
    { heading: "The guess matters", text: "In the dissertation version of the analysis, learners who were asked to guess gained g = 0.70 on the questioned material, while learners who only read the questions gained g = 0.22." },
    { heading: "It helps what you asked about, and nothing else", text: "The published meta-analysis found g = 0.54 for material the questions were about and g = 0.04 for other material from the same text. In practice the questions need to cover everything you want to learn, since the boost does not spread." },
    { heading: "Testing after studying is stronger", text: "In one experiment with a test a week later, testing after studying gave d = 0.74 and testing before gave d = 0.35, and only testing after helped on questions that had never been tested (Latimier et al., 2019). Try First works as a warm-up, not a replacement for testing yourself later." },
  ],
  evidence: [
    {
      title: "St. Hilaire, Chan & Ahn (2024): a preregistered meta-analysis",
      text: "The published analysis pooled 97 comparisons of guessing answers before studying: g = 0.54 for the questioned material and g = 0.04 for everything else. We read the author’s dissertation version of the same analysis (90 comparisons), which reports more detail. In it, 87% of the effects were positive, though results varied a lot between studies (I² = 80%). Published studies averaged g = 0.61 and unpublished ones g = 0.53. A funnel-plot test, an adjustment for missing studies (g = 0.54) and a p-curve test all found little sign of publication bias or p-hacking. Learners who were asked to guess gained more than those who only read the questions, adults gained more than grade-school children, and factual questions gained more than conceptual ones, though there were fewer studies of conceptual questions.",
      chart: {
        title: "Benefit for the material asked about (Hedges’ g; about 0.5 is medium)",
        groups: [
          { label: "What learners did", bars: [{ label: "Asked to guess", value: 0.7, tone: "a", valueText: "0.70" }, { label: "Only read the questions", value: 0.22, tone: "c", valueText: "0.22" }] },
          { label: "Who the learners were", bars: [{ label: "Adults", value: 0.65, tone: "a", valueText: "0.65" }, { label: "Grade-school children", value: 0.24, tone: "c", valueText: "0.24" }] },
          { label: "Kind of question", bars: [{ label: "Factual questions", value: 0.62, tone: "a", valueText: "0.62" }, { label: "Conceptual questions", value: 0.31, tone: "c", valueText: "0.31" }] },
        ],
        max: 1,
        source: "St. Hilaire (2022), dissertation version of the analysis. The adult-versus-children and factual-versus-conceptual gaps rest on fewer studies.",
      },
    },
    {
      title: "Latimier et al. (2019): before or after studying?",
      text: "One experiment compared testing before studying, testing after studying and extra reading, with a retention test 7 days later and the same amount of testing time. Both testing conditions beat extra reading: testing after studying by d = 0.74 and testing before by d = 0.35, and the difference between them was significant. Only testing after studying also helped on questions that had not been tested.",
      chart: {
        title: "Benefit over extra reading on a test 7 days later (Cohen’s d; about 0.5 is medium)",
        groups: [{ label: "", bars: [{ label: "Tested after studying", value: 0.74, tone: "a", valueText: "0.74" }, { label: "Tested before studying", value: 0.35, tone: "b", valueText: "0.35" }] }],
        max: 1,
        source: "Latimier et al. (2019), abstract. One experiment.",
      },
    },
  ],
  limits: [
    { heading: "Only the questions you wrote get the boost", text: "The meta-analysis found effectively no benefit for material that was not asked about (g = 0.04). If your questions miss an important idea, Try First will not help you learn it." },
    { heading: "Testing after studying did better", text: "In the one experiment that compared them directly, testing after studying beat testing before it, including on questions that were never tested. Use Try First before a section and Active Recall after it." },
    { heading: "Mostly lab studies with adults", text: "The aggregate research is mostly laboratory studies with adults, and the dissertation counted only one known classroom study of prequestions (Carpenter et al., 2018). A 2017 classroom paper by Geller and colleagues was titled “Prequestions do not enhance the benefits of retrieval in a STEM classroom”; we have not read it." },
    { heading: "Results vary a lot", text: "In the dissertation version, about 80% of the differences between studies were real, not chance, and 12 of 90 comparisons were negative. The average hides studies where it did little." },
    { heading: "The answers have to be findable", text: "The method assumes the text contains the answers to your questions and that you can tell when you have found one. For material you can’t yet follow at all, the guesses are close to random, and an overview or worked example may need to come first." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Skim", "Ask", "Guess", "Study", "Check"] },
    caption: "Illustration: the steps used in the guided Try First session.",
  },
  sources: [
    "Carpenter, S. K., Rahman, S., & Perkins, K. (2018). The effects of prequestions on classroom learning. Journal of Experimental Psychology: Applied, 24, 34–42.",
    "Geller, J., Carpenter, S. K., Lamm, M. H., Rahman, S., Armstrong, P. I., & Coffman, C. R. (2017). Prequestions do not enhance the benefits of retrieval in a STEM classroom. Cognitive Research: Principles and Implications, 2, Article 42.",
    "Kornell, N., Hays, M. J., & Bjork, R. A. (2009). Unsuccessful retrieval attempts enhance subsequent learning. Journal of Experimental Psychology: Learning, Memory, and Cognition, 35(4), 989–998.",
    "Latimier, A., Riegert, A., Peyre, H., Ly, S. T., Casati, R., & Ramus, F. (2019). Does pre-testing promote better retention than post-testing? npj Science of Learning, 4, Article 15.",
    "Richland, L. E., Kornell, N., & Kao, L. S. (2009). The pretesting effect: Do unsuccessful retrieval attempts enhance learning? Journal of Experimental Psychology: Applied, 15(3), 243–257.",
    "St. Hilaire, K. J. (2022). Guessing as a learning intervention: A meta-analytic review of the prequestion effect [Doctoral dissertation, Iowa State University].",
    "St. Hilaire, K. J., Chan, J. C. K., & Ahn, D. (2024). Guessing as a learning intervention: A meta-analytic review of the prequestion effect. Psychonomic Bulletin & Review, 31, 411–441.",
  ],
};
