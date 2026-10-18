// In-depth pages for the study methods, shown from the library, the coach results and a guided session.
//
// Every number here was checked against the paper it is credited to (or, for a few counts, the publisher's
// record of that paper); if a figure cannot be sourced it is described in words instead. Add a method here
// and the app starts linking to its page; methods without an entry get no link.
//
// page = {
//   glance:   [{ value, label }]                  big numbers at the top, each tied to a study named in the label
//   history:  [{ when, text }]                    timeline, oldest first
//   how:      [{ heading, text }]                 how it works
//   evidence: [{ title, text, chart? }]           one entry per study; chart is for charts.js renderBarChart
//   limits:   [{ heading, text }]                 where it falls short
//   practice: { visual, caption }                 a diagram from visuals.js, labelled as an illustration
//   sources:  [string]                            full references
// }

const ACTIVE_RECALL = {
  glance: [
    { value: "61% vs 40%", label: "of a passage recalled a week later by students who practised recalling it, compared with students who re-read it (Roediger & Karpicke, 2006)" },
    { value: "3.4 vs 14.2", label: "times each group read the passage in that experiment: the group that read it far less remembered far more" },
    { value: "g = 0.50", label: "average size of the testing effect across 159 comparisons in 61 studies, a medium effect (Rowland, 2014)" },
    { value: "about 50% more", label: "learning after a week than students who made concept maps of the same text (Karpicke & Blunt, 2011)" },
  ],
  history: [
    { when: "1909–1939", text: "Early experiments by Abbott (1909), Gates (1917) and Spitzer (1939) already found that being tested on material helped people remember it later. Research on the effect grew a great deal in the decade before 2014 (Rowland, 2014)." },
    { when: "What it’s called", text: "Researchers use two names: the testing effect (a test makes you remember more) and retrieval practice (pulling something out of memory is itself practice). This app calls it Active Recall." },
    { when: "2006", text: "Roediger and Karpicke published the experiment on this page: students who practised recalling short passages remembered more after a week than students who re-read them, even though re-reading gave them every idea again." },
    { when: "2011", text: "Karpicke and Blunt reported in the journal Science that retrieval practice beat making concept maps, a popular way of studying that makes you think about how ideas connect." },
    { when: "2013", text: "Dunlosky and colleagues reviewed ten popular study techniques. Practice testing and distributed practice were the two rated “high utility”." },
    { when: "2014–2017", text: "Two large meta-analyses, Rowland (2014) and Adesope, Trevisan and Sundararajan (2017), combined many studies and found a reliable medium-to-large benefit of testing over restudying." },
  ],
  how: [
    { heading: "What happens when you recall", text: "Reading a page again feels productive because everything on it looks familiar. Recalling is different: you have to produce the answer yourself, with nothing in front of you. Researchers have found that this act of retrieval, and not just seeing the material again, is what makes the memory last." },
    { heading: "Why re-reading fools you", text: "In Roediger and Karpicke’s experiment, the students who re-read the passage four times were the most confident they would remember it in a week. They remembered the least. The students who tested themselves were less confident and remembered the most. Feeling that you know something is not a reliable sign that you will still know it later." },
    { heading: "Effort seems to matter", text: "Rowland’s meta-analysis found that tests where you have to produce the answer (recall) gave larger benefits than tests where you only pick an answer from a list (recognition). That fits the idea that the effort of retrieving is part of what helps." },
    { heading: "What nobody has fully explained yet", text: "Rowland also found limited support for the popular explanation that tests help because they make you think about the material more deeply, and concluded that existing theories do not yet give a complete account. Researchers agree that the effect is real and large; they do not yet agree on exactly why it happens." },
    { heading: "Checking your answers", text: "In Rowland’s analysis, testing followed by feedback (seeing the right answers) had an average effect of g = 0.73, compared with g = 0.39 when there was no feedback. Recalling first and then checking against your notes is better than recalling alone, which is why the guided session has a “Check against the source” step." },
  ],
  evidence: [
    {
      title: "Roediger & Karpicke (2006): tested students vs. re-readers",
      text: "180 university students studied short science passages (about 250 words, taken from a reading-comprehension test book). Each passage was learned one of three ways over four 5-minute periods: reading it four times (SSSS), reading it three times and taking one recall test (SSST), or reading it once and taking three recall tests (STTT). No answers were shown after the tests. Then they recalled as much as they could, either 5 minutes or 1 week later. Thirty students were in each of the six groups.",
      chart: {
        title: "Share of the passage’s ideas recalled",
        groups: [
          { label: "Final test 5 minutes later", bars: [
            { label: "Read 4 times", value: 83, tone: "c" },
            { label: "Read 3 times, tested once", value: 78, tone: "b" },
            { label: "Read once, tested 3 times", value: 71, tone: "a" },
          ] },
          { label: "Final test 1 week later", bars: [
            { label: "Read 4 times", value: 40, tone: "c" },
            { label: "Read 3 times, tested once", value: 56, tone: "b" },
            { label: "Read once, tested 3 times", value: 61, tone: "a" },
          ] },
        ],
        max: 100,
        unit: "%",
        source: "Roediger & Karpicke (2006), Experiment 2, Figure 2.",
      },
      afterText: "Over the week, the re-readers lost 52% of what they could recall at the 5-minute test. The group tested three times lost 14%.",
    },
    {
      title: "Karpicke & Blunt (2011): retrieval practice vs. concept mapping",
      text: "200 students studied science texts across two experiments. One group read the text and then tried to recall it; another made a concept map while looking at the text. Right after studying, both groups recalled about the same. A week later, the retrieval group had about 50% higher scores, on questions that needed inferences as well as on facts, and even when the final test was to draw a concept map. The authors did not say concept mapping is bad; it simply gave less than retrieving.",
    },
    {
      title: "Rowland (2014): combining the studies",
      text: "A meta-analysis pools many experiments to see what is true on average. This one combined 159 comparisons from 61 studies of testing versus restudying. The average effect, in a measure called Hedges’ g (the gap between the groups in units of how much people normally vary), was 0.50, with a plausible range of 0.42 to 0.58. By convention, 0.5 is a medium effect. Adesope and colleagues’ later meta-analysis of practice testing reported a similar medium-to-large effect (g = 0.61).",
      chart: {
        title: "Size of the testing effect (Hedges’ g; higher is a bigger advantage over restudying)",
        groups: [
          { label: "", bars: [
            { label: "All 159 comparisons", value: 0.5, tone: "a", valueText: "0.50" },
            { label: "When people saw the right answers afterwards", value: 0.73, tone: "a", valueText: "0.73" },
            { label: "When they did not", value: 0.39, tone: "b", valueText: "0.39" },
          ] },
        ],
        max: 1,
        source: "Rowland (2014), Psychological Bulletin.",
      },
    },
    {
      title: "Dunlosky et al. (2013): the ten-technique review",
      text: "This review judged each technique on how well it works across materials, students and tests. Practice testing was one of only two techniques rated “high utility”. Highlighting and re-reading, which many students rely on, were rated “low”.",
    },
  ],
  limits: [
    { heading: "It does not help if the test is minutes away", text: "At the 5-minute test, the re-readers did better: 81% vs 75% in Roediger and Karpicke’s first experiment and 83% vs 71% in the second. Recalling pays off over days and weeks, not for the next ten minutes." },
    { heading: "It feels worse while you do it", text: "The group that learned least was the most confident. Recall is harder than re-reading and can feel like it is going badly. Expect that, and judge by what you can recall afterwards." },
    { heading: "Without feedback, mistakes can stay", text: "Testing alone helped in the experiments above, but the meta-analysis found about twice the benefit when people saw the right answers afterwards (g = 0.73 vs 0.39)." },
    { heading: "You need something to recall", text: "Students in these experiments read the passage once before they were first tested. If you have not understood the material yet, recall will mostly show you that. Learn it first, with a method like Feynman or Self-Explanation, then test yourself." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Study once", "Close it", "Recall", "Check", "Re-test"] },
    caption: "Illustration: the loop used in the guided Active Recall session.",
  },
  sources: [
    "Abbott, E. E. (1909), Gates, A. I. (1917) and Spitzer, H. F. (1939): early testing-effect experiments, as cited in Rowland (2014).",
    "Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. Review of Educational Research, 87(3), 659–701.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
    "Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. Science, 331(6018), 772–775.",
    "Roediger, H. L., III, & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255.",
    "Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. Psychological Bulletin, 140(6), 1432–1463.",
  ],
};

const SPACED_REPETITION = {
  glance: [
    { value: "58% → 21%", label: "of his original effort that Ebbinghaus saved when relearning a list after 20 minutes, compared with after 31 days (1885)" },
    { value: "839", label: "comparisons from 317 experiments in 184 articles pooled in one review of distributed practice (Cepeda et al., 2006)" },
    { value: "+111%", label: "more facts recalled 70 days later with the best gap between two study sessions than with no gap, for the same total study time (Cepeda et al., 2008)" },
    { value: "3 days to 27 days", label: "the best gap before a review session when the test is 1 week away, compared with when it is about a year away (Cepeda et al., 2008)" },
  ],
  history: [
    { when: "1885", text: "Hermann Ebbinghaus memorised lists of nonsense syllables and measured how much faster he could relearn them after different delays. His results gave the first measured forgetting curve, and he also noticed that spreading repetitions out helped." },
    { when: "1967", text: "Language teacher and researcher Paul Pimsleur proposed “graduated-interval recall” in an article called “A memory schedule”: review each item after longer and longer gaps. His language courses were among the first to put it into practice." },
    { when: "1972", text: "Sebastian Leitner’s book So lernt man lernen (“How to learn to learn”) described the box system of paper flashcards that this app’s guided session uses: cards you get right move to a box reviewed less often, and misses go back to the first box." },
    { when: "Late 1980s", text: "Piotr Wozniak turned the idea into software, SuperMemo, which worked out each card’s next review date. Sources differ on exact years. Later free programs such as Anki (2006) use schedulers based on his work." },
    { when: "2006–2008", text: "Cepeda and colleagues pooled the spacing research in a meta-analysis (2006), then ran an experiment with 1,354 people to find how the best gap depends on how long you want to remember (2008)." },
    { when: "2013", text: "Dunlosky and colleagues rated distributed practice, the general principle behind spaced repetition, “high utility” in their review of ten study techniques." },
    { when: "2015", text: "Murre and Dros repeated Ebbinghaus’s experiment on one volunteer and got the same overall shape, with some differences, described below." },
  ],
  how: [
    { heading: "The forgetting curve", text: "Memories do not fade at a steady rate. Ebbinghaus found that most of the loss comes quickly, then it slows down. That curve is why a review that comes right after learning does little, and why a review after some forgetting does more." },
    { heading: "The spacing effect", text: "With the same total study time, splitting it into sessions with time between them beats doing it all at once. Cepeda and colleagues’ 2006 review pooled 839 comparisons from 317 experiments and found this pattern held up. Reviewing something you have partly forgotten means retrieving it with effort, which is the same ingredient that makes Active Recall work." },
    { heading: "The best gap depends on how long you want to remember", text: "The 2008 experiment found that the ideal gap between two sessions is not one fixed number. The authors put it simply: to know the best way to space your study, decide how long you want to remember. The longer the time until the test, the longer the best gap, though as a share of that time it gets smaller." },
    { heading: "Too long hurts less than too short", text: "In the same experiment, recall rose steeply as the gap grew and then fell off much more gradually. The authors note that using a gap longer than the best one costs much less than using one that is too short. When unsure, space reviews a little further apart." },
    { heading: "Why it works is still being debated", text: "The authors of the 2008 study could not make the models they tried match both patterns they found: the best gap growing with test delay, and its share of the delay shrinking. Researchers are confident the spacing effect is real; its explanation is less settled." },
    { heading: "How flashcard boxes put it into practice", text: "The Leitner box system schedules spacing for you. New cards start in the first box and are seen often. A card you get right moves up a box and comes back less often; a card you miss goes back to box 1. Cards you know well take almost no time, and your time goes to the ones that are slipping." },
  ],
  evidence: [
    {
      title: "Ebbinghaus (1885) and Murre & Dros (2015): how fast we forget",
      text: "Ebbinghaus memorised lists of nonsense syllables, then relearned each list after a delay. “Savings” is the share of the original learning time he saved when relearning. In 2015, Murre and Dros repeated the experiment with one volunteer, a 22-year-old man, using 70 lists of 104 nonsense syllables each, at similar delays.",
      chart: {
        title: "Share of the original learning effort saved when relearning",
        legend: [
          { tone: "a", label: "Ebbinghaus (1885)" },
          { tone: "b", label: "Murre & Dros replication (2015, one volunteer)" },
        ],
        groups: [
          { label: "After about 20 minutes", bars: [{ value: 58.2, tone: "a", series: "Ebbinghaus (1885)" }, { value: 47.2, tone: "b", series: "Replication (2015)" }] },
          { label: "After 1 hour", bars: [{ value: 44.2, tone: "a", series: "Ebbinghaus (1885)" }, { value: 37.3, tone: "b", series: "Replication (2015)" }] },
          { label: "After 9 hours", bars: [{ value: 35.8, tone: "a", series: "Ebbinghaus (1885)" }, { value: 27.6, tone: "b", series: "Replication (2015)" }] },
          { label: "After 1 day", bars: [{ value: 33.7, tone: "a", series: "Ebbinghaus (1885)" }, { value: 31.7, tone: "b", series: "Replication (2015)" }] },
          { label: "After 2 days", bars: [{ value: 27.8, tone: "a", series: "Ebbinghaus (1885)" }, { value: 23.0, tone: "b", series: "Replication (2015)" }] },
          { label: "After 6 days", bars: [{ value: 25.4, tone: "a", series: "Ebbinghaus (1885)" }, { value: 16.8, tone: "b", series: "Replication (2015)" }] },
          { label: "After 31 days", bars: [{ value: 21.1, tone: "a", series: "Ebbinghaus (1885)" }, { value: 4.1, tone: "b", series: "Replication (2015)" }] },
        ],
        max: 100,
        unit: "%",
        decimals: 1,
        source: "Murre & Dros (2015), Table 3. Ebbinghaus’s own intervals were slightly different from the rounded ones shown.",
      },
      afterText: "Both curves drop fast and then level off (the replication has a small bump at 1 day). The replication saved less at 31 days (4.1% vs 21.1%). With one learner and meaningless syllables, treat the exact percentages as an illustration of the shape, not as numbers that apply to your notes.",
    },
    {
      title: "Cepeda et al. (2006): the big review",
      text: "This paper pooled 839 comparisons of spaced versus massed study from 317 experiments in 184 articles, all on remembering verbal material such as word lists and facts. Across them, the best gap between sessions grew as the time until the test grew.",
    },
    {
      title: "Cepeda et al. (2008): finding the best gap",
      text: "1,354 people learned 32 obscure true trivia facts (for example, which European nation eats the most spicy Mexican food: Norway) until they had recalled each one correctly once. After a gap that ranged from none up to 3.5 months, they studied the facts again, and a final test came up to a year after that. 26 gap-and-delay combinations were tested, with the same study time in each.",
      chart: {
        title: "The best gap between sessions, as a share of the time until the test",
        groups: [
          { label: "Test 7 days later", bars: [{ value: 43, tone: "a", valueText: "about 3 days (43%)" }] },
          { label: "Test 35 days later", bars: [{ value: 23, tone: "a", valueText: "about 8 days (23%)" }] },
          { label: "Test 70 days later", bars: [{ value: 17, tone: "a", valueText: "about 12 days (17%)" }] },
          { label: "Test 350 days later", bars: [{ value: 8, tone: "a", valueText: "about 27 days (8%)" }] },
        ],
        max: 50,
        unit: "%",
        source: "Cepeda et al. (2008), estimated gaps for recall. The paper’s abstract summarises this as about 20–40% of a 1-week delay down to about 5–10% of a 1-year delay.",
      },
    },
    {
      title: "Cepeda et al. (2008): what the best gap was worth",
      text: "Compared with studying twice with no gap, using the best gap gave this much more recall. For a test only a week away, spacing was worth only a little. For tests further away, it was worth far more.",
      chart: {
        title: "Extra facts recalled with the best gap, compared with no gap",
        groups: [
          { label: "Test 7 days later", bars: [{ value: 10, tone: "b", valueText: "+10%" }] },
          { label: "Test 35 days later", bars: [{ value: 59, tone: "b", valueText: "+59%" }] },
          { label: "Test 70 days later", bars: [{ value: 111, tone: "b", valueText: "+111%" }] },
          { label: "Test 350 days later", bars: [{ value: 77, tone: "b", valueText: "+77%" }] },
        ],
        max: 120,
        unit: "%",
        source: "Cepeda et al. (2008). Study time was the same in every condition.",
      },
    },
    {
      title: "Dunlosky et al. (2013): the ten-technique review",
      text: "Distributed practice, the general idea behind spaced repetition, was rated “high utility”, one of only two techniques given that rating.",
    },
  ],
  limits: [
    { heading: "There is no single right schedule", text: "The best gap depends on how long you want to remember. This app’s Leitner boxes (every day, every 3 days, every week) are a simple stand-in, not a number the research gives." },
    { heading: "The numbers come from facts, not from understanding", text: "These studies mostly measured memory for words, facts and trivia. Spacing may help other kinds of learning too, but the evidence summarised here is about recall of facts." },
    { heading: "Ebbinghaus was one person with nonsense syllables", text: "The replication kept the shape of the curve but found less saved after a month. Real material that you understand is not forgotten like random syllables." },
    { heading: "For a test next week it matters less", text: "In the 2008 experiment, the best gap bought only 10% more recall for a test 7 days away, but 111% more for a test 70 days away. The further off the test, the more spacing is worth." },
  ],
  practice: {
    visual: { name: "leitner" },
    caption: "Illustration: the three boxes used in the guided Spaced Repetition session.",
  },
  sources: [
    "Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354–380.",
    "Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. Psychological Science, 19(11), 1095–1102.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
    "Ebbinghaus, H. (1885). Über das Gedächtnis. Leipzig: Duncker & Humblot.",
    "Leitner, S. (1972). So lernt man lernen. Freiburg: Herder.",
    "Murre, J. M. J., & Dros, J. (2015). Replication and analysis of Ebbinghaus’ forgetting curve. PLOS ONE, 10(7), e0120644.",
    "Pimsleur, P. (1967). A memory schedule. Modern Language Journal, 51(2), 73–75.",
  ],
};

export const METHOD_PAGES = {
  "active-recall": ACTIVE_RECALL,
  "spaced-repetition": SPACED_REPETITION,
};

export const hasMethodPage = (methodId) => Object.hasOwn(METHOD_PAGES, methodId);
