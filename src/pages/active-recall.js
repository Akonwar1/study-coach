export default {
  glance: [
    { kind: "compare", items: [{ name: "Practised recalling", value: 61, tone: "a" }, { name: "Re-read it", value: 40, tone: "c" }], max: 100, unit: "%", text: "of a passage recalled a week later", source: "Roediger & Karpicke, 2006" },
    { kind: "compare", items: [{ name: "Group that tested itself", value: 3.4, tone: "a" }, { name: "Group that re-read", value: 14.2, tone: "c" }], max: 16, unit: "×", decimals: 1, text: "times each group read the passage, yet the group that read it far less remembered far more", source: "Roediger & Karpicke, 2006" },
    { kind: "effect", symbol: "g", value: 0.5, text: "average size of the testing effect across 159 comparisons in 61 studies", source: "Rowland, 2014" },
    { kind: "number", value: "About 50%", text: "more learning after a week than students who made concept maps of the same text", source: "Karpicke & Blunt, 2011" },
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
        title: "Size of the testing effect (Hedges’ g; higher is a bigger advantage over restudying, about 0.5 is medium)",
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
    {
      title: "Yang et al. (2021): quizzing in real classrooms",
      text: "Most testing experiments were run in labs, so Yang and colleagues pooled studies done in actual classrooms: 222 independent studies with 48,478 students and 573 effect sizes. Quizzing raised achievement by g = 0.499 on average, a medium effect. The size depended on things like what the control group did instead, whether students saw the right answers afterwards, and how many times they were tested. We read the abstract and the publisher’s record, not the full paper.",
    },
  ],
  limits: [
    { heading: "It does not help if the test is minutes away", text: "At the 5-minute test, the re-readers did better: 81% vs 75% in Roediger and Karpicke’s first experiment and 83% vs 71% in the second. Recalling pays off over days and weeks, not for the next ten minutes." },
    { heading: "It feels worse while you do it", text: "The group that learned least was the most confident. Recall is harder than re-reading and can feel like it is going badly. Expect that, and judge by what you can recall afterwards." },
    { heading: "Without feedback, mistakes can stay", text: "Testing alone helped in the experiments above, but the meta-analysis found about twice the benefit when people saw the right answers afterwards (g = 0.73 vs 0.39)." },
    { heading: "You need something to recall", text: "Students in these experiments read the passage once before they were first tested. If you have not understood the material yet, recall will mostly show you that. Learn it first, with a method like Feynman or Self-Explanation, then test yourself." },
    { heading: "Reviews differ on how big the effect is", text: "Rowland found g = 0.50, Yang and colleagues’ classroom review found g = 0.499 and Donoghue and Hattie found d = 0.74. All agree that testing helps, but the true size is uncertain. Rowland also found that published studies showed larger effects than unpublished ones (the unpublished ones were smaller but still reliable), which can be a sign that some null results never reach print, and noted that lab research on testing has almost always used undergraduate students." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Study once", "Close it", "Recall", "Check", "Re-test"] },
    caption: "Illustration: the loop used in the guided Active Recall session.",
  },
  sources: [
    "Abbott, E. E. (1909), Gates, A. I. (1917) and Spitzer, H. F. (1939): early testing-effect experiments, as cited in Rowland (2014).",
    "Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. Review of Educational Research, 87(3), 659–701.",
    "Donoghue, G. M., & Hattie, J. A. C. (2021). A meta-analysis of ten learning techniques. Frontiers in Education, 6, Article 581216.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
    "Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. Science, 331(6018), 772–775.",
    "Roediger, H. L., III, & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255.",
    "Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. Psychological Bulletin, 140(6), 1432–1463.",
    "Yang, C., Luo, L., Vadillo, M. A., Yu, R., & Shanks, D. R. (2021). Testing (quizzing) boosts classroom learning: A systematic and meta-analytic review. Psychological Bulletin, 147(4), 399–435.",
  ],
};
