import { techniqueChart } from "./technique-chart.js";

export default {
  glance: [
    { kind: "effect", symbol: "d", value: 0.85, text: "average effect of spreading practice out, the largest of the ten techniques, across 150 comparisons and 152,952 learners", source: "Donoghue & Hattie, 2021" },
    { kind: "compare", items: [{ name: "Spread over two sessions", value: 74, tone: "a" }, { name: "All in one sitting", value: 49, tone: "c" }], max: 100, unit: "%", text: "of test problems solved a week later, from the same practice problems", source: "Rohrer & Taylor, 2007" },
    { kind: "compare", items: [{ name: "13 sessions, 56 days apart", value: 57, tone: "a" }, { name: "26 sessions, 14 days apart", value: 56, tone: "c" }], max: 100, unit: "%", text: "of words recalled up to five years later: half the sessions, spaced further apart, gave about the same retention", source: "Bahrick et al., 1993" },
    { kind: "number", value: "90%", text: "of people learned more from spaced flashcard study than from cramming the same cards, though 72% believed cramming had been better after their first session", source: "Kornell, 2009" },
  ],
  history: [
    { when: "1885", text: "Ebbinghaus’s experiments on memorising nonsense syllables showed that repetitions spread over time worked better than repetitions packed together. The spacing effect has been one of the oldest topics in experimental psychology; by 1992 it had been the subject of more than 300 investigations (Bahrick et al., 1993)." },
    { when: "1993", text: "Bahrick and colleagues ran a 9-year study in which four people, all professional psychologists and the paper’s authors, learned and relearned 300 English–foreign language word pairs at gaps of 14, 28 or 56 days. They tested memory up to five years later." },
    { when: "1999", text: "Donovan and Radosevich pooled 63 studies with 112 effect sizes and found that spaced practice generally beat massed practice, with an average effect of 0.46." },
    { when: "2006–2008", text: "Cepeda and colleagues pooled 839 comparisons from 317 experiments (2006) and then found how the best gap between sessions depends on how long you want to remember (2008)." },
    { when: "2007–2009", text: "Rohrer and Taylor showed the effect with mathematics practice, and Kornell showed it with flashcards, including that most students believe cramming works better." },
    { when: "2013 and 2021", text: "Dunlosky and colleagues rated distributed practice “high utility” (2013), and Donoghue and Hattie’s meta-analysis of all ten techniques found it had the largest average effect (2021)." },
  ],
  how: [
    { heading: "Same hours, different calendar", text: "The finding is about timing, not total time. Splitting a fixed amount of study into sessions with gaps between them beats doing it all at once. Most students need three to four chances to learn something, and those chances work better spread over days or weeks than delivered in one sitting (Donoghue & Hattie, 2021)." },
    { heading: "The best gap depends on how long you want to remember", text: "Cepeda and colleagues found that there is no single best gap: it depends on how long you want to remember. For a test a week away, the best gap was around 3 days; for a test about a year away, it was around 27 days. As a share of the delay, the best gap shrank from about 43% to about 8%. Their abstract summarises this as 20–40% of a one-week delay down to 5–10% of a one-year delay." },
    { heading: "A schedule beats a good intention", text: "Spacing only happens if the sessions are on the calendar. In Rohrer and Taylor’s experiment, doing extra problems in the same sitting made no difference (49% vs 46%), while moving the same number of problems into two sessions a week apart did (74%). More practice at one time did not do what the same practice spread out did." },
    { heading: "It feels worse than it works", text: "Donoghue and Hattie note that students tend to rate their learning higher after massed practice. In Kornell’s flashcard studies, 72% of people thought cramming had been more effective after their first session, but 90% actually learned more with spacing. If a spaced session feels harder and less satisfying, that is expected." },
    { heading: "Spacing works with the other methods", text: "Practice testing works well even when it is massed but is even more effective when it is spread out (Donoghue & Hattie, 2021). A schedule of review sessions is the natural place for Active Recall and Spaced Repetition." },
  ],
  evidence: [
    {
      title: "Rohrer & Taylor (2007): spacing a maths skill",
      text: "Sixty-six undergraduates were taught to count the arrangements of letters in a sequence with repeated letters (for example, aabccc). “Spacers” worked two practice problems in each of two sessions a week apart. “Massers” worked the same four problems in one sitting, and “Light Massers” worked just two. All were tested a week after their last practice problem. During practice, all groups did equally well.",
      chart: {
        title: "Share of test problems solved a week later",
        groups: [{ label: "", bars: [
          { label: "Spaced: 2 problems, then 2 more a week later", value: 74, tone: "a" },
          { label: "Massed: 4 problems in one sitting", value: 49, tone: "c" },
          { label: "Light massed: 2 problems in one sitting", value: 46, tone: "c" },
        ] }],
        max: 100,
        unit: "%",
        source: "Rohrer & Taylor (2007), Experiment 1.",
      },
    },
    {
      title: "Bahrick et al. (1993): nine years of word pairs",
      text: "Four people learned 300 English–foreign word pairs and then relearned them in 13 or 26 review sessions, spaced 14, 28 or 56 days apart. Memory was tested 1, 2, 3 and 5 years after training. The longer gaps made learning slightly slower but retention much higher, and the benefit of extra sessions was separate from the benefit of spacing.",
      chart: {
        title: "Average share of words recalled, 1 to 5 years after training",
        groups: [
          { label: "13 review sessions", bars: [
            { label: "14 days apart", value: 43, tone: "c" },
            { label: "28 days apart", value: 50, tone: "b" },
            { label: "56 days apart", value: 57, tone: "a" },
          ] },
          { label: "26 review sessions", bars: [
            { label: "14 days apart", value: 56, tone: "c" },
            { label: "28 days apart", value: 68, tone: "b" },
            { label: "56 days apart", value: 76, tone: "a" },
          ] },
        ],
        max: 100,
        unit: "%",
        source: "Bahrick et al. (1993), Table 4. Only four people took part.",
      },
    },
    {
      title: "Cepeda et al. (2008): how far apart?",
      text: "In an experiment with 1,354 people learning trivia facts, the best gap between two study sessions depended on how long the facts had to be remembered. These are the estimated best gaps for recall, as a share of the time until the test.",
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
        source: "Cepeda et al. (2008). The facts were obscure trivia learned online, so treat the days as a starting point, not a rule.",
      },
    },
    {
      title: "Kornell (2009): flashcards",
      text: "In three experiments, people learned GRE-type vocabulary from flashcards using a web program. “Spacing” meant working through one big stack; “massing” meant working through four smaller stacks. Spacing beat massing for 90% of participants, and also beat cramming the cards on the last day before the test. After their first session, 72% of participants believed that massing had been more effective.",
    },
    {
      title: "Donoghue & Hattie (2021): the ten techniques side by side",
      text: "Across 150 comparisons and 152,952 learners, distributed practice had the largest average effect of the ten techniques, d = 0.85. The comparisons varied a lot (about 83% of the variation was real difference between studies), so the average hides big swings.",
      chart: techniqueChart("distributed"),
      afterText: "Read this as a rough ranking. The techniques were tested on different materials, and the authors warn that most pooled studies measured memory for facts.",
    },
    {
      title: "Cepeda et al. (2006) and Donovan & Radosevich (1999): the earlier reviews",
      text: "Cepeda and colleagues pooled 839 comparisons from 317 experiments in 184 articles, all on verbal recall. Donovan and Radosevich pooled 63 studies with 112 effect sizes and found an average effect of 0.46, which varied with the task and the length of the gaps. Both found that spacing generally helped.",
    },
    {
      title: "Mawson & Kang (2025): spacing in real classrooms",
      text: "Mawson and Kang pooled applied research from classrooms: 22 reports with 31 effect sizes and more than 3,000 students. Distributed practice beat massed practice by d = 0.54 (95% range 0.31 to 0.77). Results varied a lot between studies (I² = 92%), larger effects went with longer gaps before the test, and no study in the review tested more than 42 days later. A funnel-plot test showed asymmetry, which the authors put down to small studies rather than unpublished results.",
    },
  ],
  limits: [
    { heading: "There is no one right schedule", text: "The best gap depends on how long you need to remember something. The numbers above are for trivia facts and a particular set of delays; for your course, they are a starting point. The 2008 study also found that a gap that was too short cost much more than one that was too long." },
    { heading: "For a test next week, it is worth less", text: "In Cepeda’s 2008 experiment, the best gap bought about 10% more recall for a test a week away, compared with 111% more for a test 70 days away. The further off the test, the more it pays to start early." },
    { heading: "Small studies sit next to big ones", text: "Bahrick’s study had four people, and Rohrer and Taylor’s first experiment had 66 undergraduates. The large meta-analyses agree with them in direction, but the size of the benefit varied a lot between studies." },
    { heading: "Mostly facts and procedures", text: "Most of this research measured memory for facts, word pairs and practice problems. Spreading out study is a strong default, but these studies do not show how much it helps deep understanding." },
    { heading: "In real classrooms the average is lower", text: "Across all studies Donoghue and Hattie found d = 0.85. In the classroom studies Mawson and Kang pooled, the average was d = 0.54. The two analyses used different studies, so they are not strictly comparable, but for a real exam the lower figure is the safer one to expect." },
  ],
  practice: {
    visual: { name: "study-calendar", show: "sessions" },
    caption: "Illustration: spreading sessions across the weeks before a deadline, as in the guided Distributed Practice session.",
  },
  sources: [
    "Bahrick, H. P., Bahrick, L. E., Bahrick, A. S., & Bahrick, P. E. (1993). Maintenance of foreign language vocabulary and the spacing effect. Psychological Science, 4(5), 316–321.",
    "Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354–380.",
    "Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. Psychological Science, 19(11), 1095–1102.",
    "Donoghue, G. M., & Hattie, J. A. C. (2021). A meta-analysis of ten learning techniques. Frontiers in Education, 6, Article 581216.",
    "Donovan, J. J., & Radosevich, D. J. (1999). A meta-analytic review of the distribution of practice effect: Now you see it, now you don’t. Journal of Applied Psychology, 84(5), 795–805.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
    "Ebbinghaus, H. (1885). Über das Gedächtnis. Leipzig: Duncker & Humblot.",
    "Kornell, N. (2009). Optimising learning using flashcards: Spacing is more effective than cramming. Applied Cognitive Psychology, 23(9), 1297–1317.",
    "Mawson, R. D., & Kang, S. H. K. (2025). The distributed practice effect on classroom learning: A meta-analytic review of applied research. Behavioral Sciences, 15(6), 771.",
    "Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. Instructional Science, 35, 481–498.",
  ],
};
