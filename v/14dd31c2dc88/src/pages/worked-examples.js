export default {
  glance: [
    { kind: "effect", symbol: "g", value: 0.48, text: "average benefit of studying worked examples on mathematics performance, across 181 effects from 55 studies", source: "Barbieri et al., 2023" },
    { kind: "number", value: "139 of 181", text: "effects favoured worked examples; 38 favoured the comparison group and 4 were exactly zero", source: "Barbieri et al., 2023" },
    { kind: "effect", symbol: "g", value: 0.44, text: "the average after adjusting for signs of missing studies, still clearly positive", source: "Barbieri et al., 2023" },
    { kind: "badge", value: "Correct examples win", text: "examples with correct solutions had larger effects than examples that contained errors, alone or mixed with correct ones", source: "Barbieri et al., 2023" },
  ],
  history: [
    { when: "1985", text: "Sweller and Cooper published a classic study on using worked examples as a substitute for problem solving in learning algebra. It started what Barbieri and colleagues call the worked examples effect: studying solved problems can teach more than solving problems does (Barbieri et al., 2023)." },
    { when: "1985–2022", text: "Thousands of studies followed, testing variations such as correct, incorrect and faded examples, using examples for first learning or for practice, and different formats and subjects (Barbieri et al., 2023)." },
    { when: "2007", text: "An Institute of Education Sciences practice guide (Pashler et al.) concluded there was moderate evidence that alternating worked examples with problem solving helps learning (as described by Barbieri et al., 2023)." },
    { when: "2014", text: "Renkl published a thorough overview of the theory of example-based learning, which Barbieri and colleagues cite." },
    { when: "2023", text: "Barbieri and colleagues published what they describe as the first meta-analysis of the worked examples effect on mathematics performance, despite thousands of earlier studies." },
  ],
  how: [
    { heading: "What you actually do", text: "You study a fully worked solution, then solve a similar problem, and over time you get less of the solution to look at. The comparison groups in the research solved problems without examples, or carried on as usual (Barbieri et al., 2023)." },
    { heading: "Why it might work", text: "Cognitive load theory says that when you are new to a type of problem, searching for what to do next uses up your limited working memory, leaving little for learning how the solution is built. A solved example removes the search (Barbieri et al., 2023)." },
    { heading: "It worked for first learning and for practice", text: "The effect was medium whether examples were used when first learning a skill or for practice after instruction. In the pooled studies, 99 effects used examples for first learning and 82 for practice." },
    { heading: "Correct examples did best", text: "Examples with correct solutions produced larger effects than examples with errors, whether the errors were alone or mixed with correct ones. Most effects (139 of 181) came from correct examples." },
    { heading: "Prompts to explain each step did not help", text: "Pairing examples with self-explanation prompts did worse than examples without prompts (the moderator effect was β = −0.24). The authors suggest that adding prompts may not be a useful change to the method. This differs from the Self-Explanation page, whose evidence mostly compares prompts with no prompts." },
  ],
  evidence: [
    {
      title: "Barbieri et al. (2023): a meta-analysis of 55 studies",
      text: "The authors screened 8,033 abstracts and kept 43 articles reporting 55 studies and 181 effect sizes, from published and unpublished work, covering students from elementary school to college. Studies compared worked examples with a comparison group without them and measured mathematics performance, such as accuracy or errors. The average effect was g = 0.48 (95% range 0.36 to 0.60). Results varied enormously between studies (I² = 94%). A test for lopsided results suggested some studies were missing, but adjusting for that still left a positive effect (g = 0.44), and the authors calculated that 13,915 unseen studies would be needed to reverse the result. We read the full paper.",
      chart: {
        title: "Average benefit of worked examples on mathematics performance (Hedges’ g; about 0.5 is medium)",
        groups: [{ label: "", bars: [
          { label: "All studies", value: 0.48, tone: "a", valueText: "0.48" },
          { label: "After adjusting for missing studies", value: 0.44, tone: "b", valueText: "0.44" },
        ] }],
        max: 1,
        source: "Barbieri et al. (2023). 55 studies, 181 effect sizes.",
      },
    },
  ],
  limits: [
    { heading: "Almost all the evidence is mathematics", text: "About 60% of the studies were on algebra or geometry, and the authors say their findings are specific to mathematics. Engineering and computer science studies exist but were too few to pool, so for coding or science problems the benefit is less certain." },
    { heading: "Studies disagreed enormously", text: "About 94% of the differences between studies were real, not chance, and 38 of 181 effects were negative. The average hides a wide range." },
    { heading: "Whether it helps less as you get skilled is unclear", text: "Cognitive load theory predicts examples help beginners most. In the pooled studies the picture was mixed: some found larger benefits for learners who already knew more and others for those who knew less. Only a minority of effects came from studies that measured prior knowledge." },
    { heading: "Mostly short and mostly English-language", text: "Those studies that reported a dose gave low doses, often one class period, and about half the studies were from the United States. The authors only included studies written in English." },
    { heading: "Solutions have to be correct", text: "Examples that contained errors did worse than correct ones. Use solutions from a source you trust, and check them against another example if something looks off." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Collect", "Study", "Solve a twin", "Check", "Fade"] },
    caption: "Illustration: the steps used in the guided Worked Examples session.",
  },
  sources: [
    "Barbieri, C. A., Miller-Cotto, D., Clerjuste, S. N., & Chawla, K. (2023). A meta-analysis of the worked examples effect on mathematics performance. Educational Psychology Review, 35, Article 11.",
    "Pashler, H., Bain, P. M., Bottge, B. A., Graesser, A., Koedinger, K., McDaniel, M., & Metcalfe, J. (2007). Organizing instruction and study to improve student learning. IES Practice Guide. National Center for Education Research.",
    "Renkl, A. (2014). Toward an instructionally oriented theory of example-based learning. Cognitive Science, 38(1), 1–37.",
    "Sweller, J., & Cooper, G. A. (1985). The use of worked examples as a substitute for problem solving in learning algebra. Cognition and Instruction, 2(1), 59–89.",
  ],
};
