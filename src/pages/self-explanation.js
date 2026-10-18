import { techniqueChart } from "./technique-chart.js";

export default {
  glance: [
    { kind: "effect", symbol: "g", value: 0.55, text: "average benefit of being prompted to self-explain, across 69 comparisons from 64 research reports", source: "Bisra et al., 2018" },
    { kind: "effect", symbol: "d", value: 0.54, text: "average effect across 93 comparisons and 804 learners in a separate meta-analysis", source: "Donoghue & Hattie, 2021" },
    { kind: "number", value: "14 vs 10", text: "eighth graders prompted to explain each line of a text, compared with a group that simply read it twice; the prompted group gained more", source: "Chi et al., 1994" },
    { kind: "badge", value: "High explainers", text: "every student who produced many self-explanations ended with the correct mental model of the circulatory system; many others did not", source: "Chi et al., 1994" },
  ],
  history: [
    { when: "1989", text: "Chi, Bassok, Lewis, Reimann and Glaser studied how students learn from worked examples in physics. They noticed that some students spontaneously explained the steps to themselves as they read, and that these students tended to do better when they later solved problems." },
    { when: "1994", text: "Chi, de Leeuw, Chiu and LaVancher turned the observation into an experiment: instead of waiting for students to explain, they prompted them to. Prompted students learned more from a passage on the human circulatory system than students who read it twice." },
    { when: "2013", text: "Dunlosky and colleagues rated self-explanation “moderate utility” in their review of ten study techniques." },
    { when: "2018", text: "Bisra, Liu, Nesbit, Salimi and Winne pooled 69 effect sizes from 64 research reports and found an average benefit of g = 0.55 for prompting self-explanation." },
    { when: "2021", text: "Donoghue and Hattie’s meta-analysis of all ten techniques found d = 0.54 for self-explanation across 93 comparisons." },
  ],
  how: [
    { heading: "What self-explanation is", text: "Self-explanation is explaining something to yourself so that you understand it: working out how a step follows from the one before, what it is for, or what causes what. Learners generate inferences about causal connections and relationships between ideas (Bisra et al., 2018)." },
    { heading: "The problem it targets", text: "Students often learn the steps of a procedure without understanding how each step relates to the others or what it contributes to the goal, and then cannot use the procedure when a problem looks different. Similarly, a student can read every sentence of a text without connecting it to anything (Bisra et al., 2018)." },
    { heading: "Noticing and repairing gaps", text: "The idea is that self-explanation helps you notice when you do not understand something and fix it. Bisra and colleagues describe it as a way of monitoring your understanding and repairing gaps, which a passive reader never does." },
    { heading: "Not the same as summarising or teaching", text: "Chi, whose work started this research, distinguishes self-explanation from summarising, from explaining to another person and from simply talking aloud. It is aimed at yourself, to make new information meaningful to you. That is how it differs from the Feynman Technique, where you explain to an imagined beginner." },
    { heading: "It works across tasks", text: "Bisra and colleagues coded 20 factors, including whether people solved problems, studied worked examples or read text, their subject and their level of education. They concluded that self-explanation prompts are a potentially powerful intervention across a range of conditions." },
  ],
  evidence: [
    {
      title: "Chi et al. (1994): prompting students to explain",
      text: "Fourteen eighth-grade students read a passage on the human circulatory system and were asked to read each sentence aloud and explain what it meant to them. Ten students in a control group read the same passage twice with no prompting. Both groups took a test before and after. The prompted group gained more from pretest to posttest. Students who produced many self-explanations understood the system more deeply on very complex questions; all of these “high explainers” reached the correct mental model, while many of the unprompted students and the low explainers did not.",
    },
    {
      title: "Bisra et al. (2018): combining 64 research reports",
      text: "This meta-analysis found 69 effect sizes that met its rules. The average benefit of prompting learners to self-explain while studying or solving problems was g = 0.55, with a random-effects model (which allows the true effect to differ between studies). Studies compared learners who got prompts with learners who did not, in areas from solving problems to studying text.",
    },
    {
      title: "Donoghue & Hattie (2021): the ten techniques side by side",
      text: "Their meta-analysis, of all ten techniques Dunlosky’s team reviewed, found d = 0.54 for self-explanation across 93 comparisons and 804 learners. They describe it as working across task areas and ages, though it may need some training and can take time. About 77% of the variation between studies was real difference, so the average hides large swings.",
      chart: techniqueChart("explanation"),
      afterText: "Read this as a rough ranking, not a precise one. The techniques were tested on different materials, and the authors warn that most pooled studies measured memory for facts.",
    },
  ],
  limits: [
    { heading: "It takes time and some practice", text: "Donoghue and Hattie note that self-explanation can take a while to do and may need training. Explaining every step of a problem is slower than reading it." },
    { heading: "Prompts matter", text: "Most studies used prompts written by the researchers. Bisra and colleagues point out that this is a limit of the research and suggest that future work look at prompts generated by computers. In a guided session, the prompts are the questions you ask yourself at each step." },
    { heading: "The early experiments were small", text: "The 1994 experiment compared 14 students with 10. Later syntheses found a medium benefit, but individual studies varied a lot." },
    { heading: "You need something to work with", text: "Explaining a step you have never seen explained, with no worked example or text to check, can lead you to the wrong idea. This is why the guided session works from a worked solution or source and has you compare with it." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Gather", "Chunk it", "Explain", "Fix stars", "Redo", "Try new"] },
    caption: "Illustration: the loop used in the guided Self-Explanation session.",
  },
  sources: [
    "Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. Educational Psychology Review, 30(3), 703–725.",
    "Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. Cognitive Science, 13, 145–182.",
    "Chi, M. T. H., de Leeuw, N., Chiu, M.-H., & LaVancher, C. (1994). Eliciting self-explanations improves understanding. Cognitive Science, 18, 439–477.",
    "Donoghue, G. M., & Hattie, J. A. C. (2021). A meta-analysis of ten learning techniques. Frontiers in Education, 6, Article 581216.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
  ],
};
