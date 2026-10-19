import { techniqueChart } from "./technique-chart.js";

export default {
  glance: [
    { kind: "compare", items: [{ name: "Mixed practice", value: 63, tone: "a" }, { name: "Blocked practice", value: 20, tone: "c" }], max: 100, unit: "%", text: "of test problems solved a week later, even though blocked practice looked better during practice", source: "Rohrer & Taylor, 2007" },
    { kind: "compare", items: [{ name: "Interleaved practice", value: 74, tone: "a" }, { name: "Blocked practice", value: 42, tone: "c" }], max: 100, unit: "%", text: "on a test 30 days later for seventh graders", source: "Rohrer, Dedrick & Stershic, 2015" },
    { kind: "compare", items: [{ name: "Paintings mixed", value: 61, tone: "a" }, { name: "Each artist’s in a row", value: 35, tone: "c" }], max: 100, unit: "%", text: "of new paintings matched to the right artist", source: "Kornell & Bjork, 2008" },
    { kind: "effect", symbol: "g", value: 0.42, text: "average benefit across 59 studies and 238 comparisons; it varied a lot with the type of material", source: "Brunmair & Richter, 2019" },
  ],
  history: [
    { when: "The idea", text: "Researchers contrast blocked practice (all problems of one type, then all of the next) with interleaved or mixed practice (types shuffled together). Textbooks mostly block: a lesson on one kind of problem is followed by a set of that kind of problem." },
    { when: "2007", text: "Rohrer and Taylor tested college students on mathematics and found that mixing problem types gave far better results a week later, in a paper titled “The shuffling of mathematics problems improves learning”." },
    { when: "2008", text: "Kornell and Bjork expected mixing to hurt when people learn a category, such as an artist’s style, because it makes what examples have in common less obvious. It helped instead." },
    { when: "2013", text: "Dunlosky and colleagues gave interleaved practice “moderate” support, noting that it had been explored much less than practice testing or distributed practice." },
    { when: "2014–2015", text: "Rohrer and colleagues ran classroom experiments with seventh-grade mathematics students over nine weeks and three months, and found large benefits on later tests." },
    { when: "2019", text: "Brunmair and Richter pooled 59 studies and found the benefit depends on the material: strong for paintings and other visual categories, small for mathematics, and reversed for words." },
  ],
  how: [
    { heading: "What is different about mixing", text: "With blocked practice, you know which strategy a problem needs before you read it, because it is the same as the last one. In an exam or later course the problems arrive mixed, so you must choose the strategy from the problem itself (Rohrer et al., 2014). Mixing makes you practise the choosing." },
    { heading: "Two helpers in one", text: "Rohrer and colleagues conclude that mixing helps in two ways: it improves your ability to tell different kinds of problems apart, and it strengthens the link between each kind of problem and its strategy. It also spreads out the repeats of each type, which is the spacing effect." },
    { heading: "It feels worse while you do it", text: "In Rohrer and Taylor’s experiment, mixed practice produced lower practice scores (60% vs 89%) and higher test scores. Kornell and Bjork’s participants did better with mixed study, yet 78% of them said mass study was as good or better. The method that feels smoother is not the one that works." },
    { heading: "When it helps most", text: "Brunmair and Richter’s analysis found stronger benefits when the categories look more similar to each other, when examples within a category look less alike, and when the material is more complex. That fits an idea called the sequential attention account: mixing draws your eye to what differs between categories." },
  ],
  evidence: [
    {
      title: "Rohrer & Taylor (2007): learning to find volumes",
      text: "Eighteen college students were taught to calculate the volume of four unusual solids (a wedge, for example). None of 25 other students from the same pool could solve a single one of these problems beforehand. Both groups did the same practice problems in two sessions a week apart. One group practised each solid in a block; the other had the solids mixed. They were tested a week after the second session.",
      chart: {
        title: "Share of problems solved",
        groups: [
          { label: "During practice", bars: [
            { label: "Blocked practice", value: 89, tone: "c" },
            { label: "Mixed practice", value: 60, tone: "a" },
          ] },
          { label: "On the test a week later", bars: [
            { label: "Blocked practice", value: 20, tone: "c" },
            { label: "Mixed practice", value: 63, tone: "a" },
          ] },
        ],
        max: 100,
        unit: "%",
        source: "Rohrer & Taylor (2007), Experiment 2. The sample was small (18 students).",
      },
    },
    {
      title: "Kornell & Bjork (2008): learning painters’ styles",
      text: "Undergraduates studied six paintings by each of 12 artists, seen for three seconds each. For some artists the six paintings were shown in a row; for others they were mixed in with other artists’ paintings. Then they were shown new paintings and had to pick the right artist. In Experiment 1a (120 students, each seeing both ways) and Experiment 1b (72 students, each seeing one way), mixing won in both. After the test, 78% of the students in the first experiment said mass study was as good as or better than mixing, although 78% had actually done better with mixing.",
      chart: {
        title: "Share of new paintings matched to the right artist (first test block)",
        groups: [
          { label: "Experiment 1a, 120 students", bars: [
            { label: "Each artist’s paintings in a row", value: 35, tone: "c" },
            { label: "Paintings mixed", value: 61, tone: "a" },
          ] },
          { label: "Experiment 1b, 72 students", bars: [
            { label: "Each artist’s paintings in a row", value: 36, tone: "c" },
            { label: "Paintings mixed", value: 59, tone: "a" },
          ] },
        ],
        max: 100,
        unit: "%",
        source: "Kornell & Bjork (2008), Experiments 1a and 1b.",
      },
    },
    {
      title: "Rohrer et al. (2014, 2015): in real classrooms",
      text: "In 2015, 126 seventh graders got the same practice problems over three months, arranged either as usual (blocked) or interleaved, and were given an unannounced test 1 or 30 days after a review. In 2014, 140 seventh graders got blocked or interleaved practice over nine weeks and were tested two weeks later. The effect size was d = 0.42 at one day and d = 0.79 at 30 days in 2015, and d = 1.05 in 2014.",
      chart: {
        title: "Mean test score",
        groups: [
          { label: "2015 study, test 1 day later", bars: [
            { label: "Blocked practice", value: 64, tone: "c" },
            { label: "Interleaved practice", value: 80, tone: "a" },
          ] },
          { label: "2015 study, test 30 days later", bars: [
            { label: "Blocked practice", value: 42, tone: "c" },
            { label: "Interleaved practice", value: 74, tone: "a" },
          ] },
          { label: "2014 study, test 2 weeks after nine weeks of practice", bars: [
            { label: "Blocked practice", value: 38, tone: "c" },
            { label: "Interleaved practice", value: 72, tone: "a" },
          ] },
        ],
        max: 100,
        unit: "%",
        source: "Rohrer, Dedrick & Stershic (2015); Rohrer, Dedrick & Burgess (2014).",
      },
    },
    {
      title: "Brunmair & Richter (2019): what the whole literature says",
      text: "This meta-analysis combined 59 studies with 238 comparisons. The overall benefit was moderate (Hedges’ g = 0.42). It differed a lot by material, and for words blocking did better than mixing. For expository text and tastes, the results were not clearly different from zero. A check for missing studies suggested some may be absent: adjusting for them lowered the average to g = 0.29, still clearly positive. A separate test found no sign of p-hacking.",
      chart: {
        title: "Benefit of interleaving by type of material (Hedges’ g; about 0.5 is medium, below 0 means mixing did worse)",
        groups: [{ label: "", bars: [
          { label: "All studies", value: 0.42, tone: "a", valueText: "0.42" },
          { label: "Paintings and other visual categories", value: 0.67, tone: "a", valueText: "0.67" },
          { label: "Mathematics tasks", value: 0.34, tone: "a", valueText: "0.34" },
          { label: "Words (blocking did better)", value: 0.39, tone: "d", valueText: "−0.39" },
        ] }],
        max: 1,
        source: "Brunmair & Richter (2019), abstract. The red bar is a negative effect, shown at its size.",
      },
    },
    {
      title: "Donoghue & Hattie (2021): the ten techniques side by side",
      text: "Pooling 104 comparisons of interleaved practice, they found d = 0.47, and noted that the evidence base is still fairly small.",
      chart: techniqueChart("interleaved"),
    },
    {
      title: "Samani & Pan (2021): a university physics course",
      text: "Students in two sections of an introductory physics course did homework for eight weeks, with problems either interleaved or grouped by topic. On two surprise tests of new, harder problems, the interleaved group recalled more relevant information and solved more problems correctly, even though students found interleaving harder and believed they had learned less from it. We read the abstract only.",
    },
  ],
  limits: [
    { heading: "It can backfire with words", text: "For studies of word learning, blocking did better than mixing (g = −0.39), and for expository text and tastes the results were unclear (Brunmair & Richter, 2019). In one study, college students learning French vocabulary did just as well when words were grouped by category as when mixed; in another, mixing did not help high school students learn comma rules (Dunlosky, 2013)." },
    { heading: "Most of the strong results are about problem types", text: "The clearest benefits are for telling kinds of problem or category apart: mathematics, painters, categories of pictures. Do not expect the same for memorising a list of definitions." },
    { heading: "The first experiments were small and narrow", text: "Rohrer and Taylor had 18 college students in their second experiment, tested on the same kinds of problems they practised, with procedures, not concepts. The authors say it is not known whether the benefit holds for transfer to new problems or for conceptual tasks. The later classroom studies address part of this." },
    { heading: "It slows you down at first", text: "Mixed practice gave lower scores during practice in these studies. If you judge your studying by how well the practice session goes, mixing will look like a mistake." },
    { heading: "Some studies may be missing", text: "Brunmair and Richter’s check for unpublished results suggested 23 studies were missing, and adjusting for them lowered the average from g = 0.42 to 0.29. The benefit stayed clearly positive, but the first figure is probably a little generous. Results also varied a lot between studies (I² = 77%)." },
  ],
  practice: {
    visual: { name: "blocked-versus-mixed" },
    caption: "Illustration: blocked practice compared with mixed practice, as shown in the guided Interleaving session.",
  },
  sources: [
    "Brunmair, M., & Richter, T. (2019). Similarity matters: A meta-analysis of interleaved learning and its moderators. Psychological Bulletin. https://doi.org/10.1037/bul0000209",
    "Donoghue, G. M., & Hattie, J. A. C. (2021). A meta-analysis of ten learning techniques. Frontiers in Education, 6, Article 581216.",
    "Dunlosky, J. (2013). Strengthening the student toolbox: Study strategies to boost learning. American Educator, Fall 2013.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
    "Kornell, N., & Bjork, R. A. (2008). Learning concepts and categories: Is spacing the “enemy of induction”? Psychological Science, 19(6), 585–592.",
    "Rohrer, D., Dedrick, R. F., & Burgess, K. (2014). The benefit of interleaved mathematics practice is not limited to superficially similar kinds of problems. Psychonomic Bulletin & Review, 21(5), 1323–1330.",
    "Rohrer, D., Dedrick, R. F., & Stershic, S. (2015). Interleaved practice improves mathematics learning. Journal of Educational Psychology, 107(3), 900–908.",
    "Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. Instructional Science, 35, 481–498.",
    "Samani, J., & Pan, S. C. (2021). Interleaved practice enhances memory and problem-solving ability in undergraduate physics. npj Science of Learning, 6, Article 32.",
  ],
};
