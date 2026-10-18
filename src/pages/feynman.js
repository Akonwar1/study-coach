export default {
  glance: [
    { kind: "effect", symbol: "d", range: [0.3, 0.4], text: "average benefit of preparing to teach rather than preparing for a test, across 28 studies", source: "Kobayashi, 2019, as summarised by Fiorella, 2023" },
    { kind: "effect", symbol: "d", range: [0.5, 0.6], text: "average benefit when people both prepare to teach and actually teach, across 28 studies", source: "Kobayashi, 2019, as summarised by Fiorella, 2023" },
    { kind: "badge", value: "Retrieval", text: "students who taught from memory did better on a delayed test than students who taught with notes in front of them", source: "Koh et al., 2018" },
    { kind: "badge", value: "Not tested as a whole", text: "the routine itself has not, as far as the sources here show, been tested as a package; the evidence is for its ingredients", source: "This page’s review of the research" },
  ],
  history: [
    { when: "1918–1988", text: "Richard Feynman was an American physicist who shared the 1965 Nobel Prize in Physics, and he was famous as a teacher: his Feynman Lectures on Physics (1960s) are still read. At the time of his death in 1988, a blackboard at Caltech reportedly still carried the line “What I cannot create, I do not understand.”" },
    { when: "The routine", text: "The four-step study routine that carries his name (pick a concept, explain it simply, find where you stumble, go back to the source) is a modern label for his reputation for explaining ideas plainly. This app uses the name for that routine; we found no sign that he published it as a study method." },
    { when: "2002", text: "Rozenblit and Keil described the “illusion of explanatory depth”: people rate their understanding of everyday things such as a zipper highly until they have to explain how they work, and then rate it lower." },
    { when: "2013–2014", text: "Fiorella and Mayer, and Nestojko and colleagues, ran experiments on learning by teaching, including the effect of simply expecting to teach." },
    { when: "2018–2019", text: "Koh and colleagues showed that part of the benefit of teaching comes from retrieving the material from memory, and Kobayashi pooled 28 studies of learning by preparing to teach and by teaching." },
  ],
  how: [
    { heading: "Why “explain it simply” exposes gaps", text: "It is easy to feel you understand something because the words are familiar. Rozenblit and Keil found that people overrate how well they understand how everyday things work, and that their ratings drop once they try to explain. Explaining forces you to produce each link, so a missing one shows up as a pause, an awkward phrase or a hand-wave." },
    { heading: "Expecting to teach changes how you study", text: "Nestojko and colleagues found that students who expected to teach a passage to someone else recalled it in a more complete, better-organised way, and answered more questions correctly, especially on the main points, than students who expected a test. In reality, no one ended up teaching." },
    { heading: "Actually explaining helps more, and it works as recall", text: "In Fiorella and Mayer’s experiments, students who prepared to teach did about the same on an immediate test whether or not they went on to teach, but those who actually taught did best on a delayed test. Koh and colleagues found that this benefit is mostly about retrieval: students who taught from memory, or who simply recalled the material, beat students who taught with notes in front of them." },
    { heading: "How it differs from self-explanation", text: "Chi, who studies self-explanation, separates it from explaining to another person (Bisra et al., 2018). In the Feynman Technique you explain to an imagined beginner, which pushes you to use plain words and fill in steps you would skip when talking to yourself." },
  ],
  evidence: [
    {
      title: "Rozenblit & Keil (2002): the illusion of explanatory depth",
      text: "Participants rated how well they understood how things such as zippers work, wrote out explanations, and rated themselves again. Their later ratings were lower, a sign that they had overrated what they understood. The effect was strongest for things with visible, causal mechanisms and weaker for facts and stories. A later study by Silk-Eglit and Kurtz (2011) found that part of the drop depends on how people interpret the question: when asked to think about the physical mechanism rather than what the object does, they rated themselves more accurately.",
    },
    {
      title: "Nestojko et al. (2014): expecting to teach",
      text: "Students studied passages either to be tested or to teach another student, who would be tested. All were actually tested. Those who expected to teach recalled more completely and in a more organised way and did better on questions about the main points.",
    },
    {
      title: "Fiorella (2023) summarising Kobayashi (2019) and Fiorella & Mayer (2013)",
      text: "A meta-analysis by Kobayashi of 28 studies found a small-to-medium benefit (d = 0.30 to 0.40) of preparing to teach compared with preparing for a test. Across another set of 28 studies, learning that involved both preparing to teach and actually teaching had a medium average effect (d = 0.5 to 0.6). Fiorella and Mayer found that students who actually taught, by recording a video lecture for an imaginary student, did best on a delayed comprehension test.",
    },
    {
      title: "Koh et al. (2018): teaching as recall",
      text: "Students learned a lesson on the Doppler effect and then taught it on video either from memory or with notes available, while others only recalled it from memory. Those who retrieved from memory, by teaching or by recalling, outperformed those who taught with notes on a delayed comprehension test.",
    },
  ],
  limits: [
    { heading: "The routine is a package that has not been tested as one", text: "The studies above test pieces: expecting to teach, actually teaching, retrieving from memory, discovering what you do not understand. They do not show that the four steps together beat other methods." },
    { heading: "Preparing to teach can have limits", text: "Fiorella notes that the effect may be weaker when learners feel anxious about teaching, doubt their ability to explain well, or use poor strategies to prepare. One study found a benefit on an immediate test but not on a delayed comprehension test; another found a benefit on both." },
    { heading: "You can fool yourself", text: "If you explain with your notes open, or explain only the parts you know, you lose the benefit. Koh and colleagues found that teaching from notes did worse than teaching from memory. The guided session has you explain first and check afterwards." },
    { heading: "Better for things with mechanisms", text: "The illusion of explanatory depth was strongest for things with visible causes and steps and weaker for facts and stories, so a plain-language explanation tests understanding most when there is something to explain." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Name it", "Explain simply", "Find gaps", "Back to source", "Simplify"] },
    caption: "Illustration: the loop used in the guided Feynman Technique session.",
  },
  sources: [
    "Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. Educational Psychology Review, 30(3), 703–725.",
    "Fiorella, L. (2023). Learning by teaching. In C. E. Overson, C. M. Hakala, L. L. Kordonowy, & V. A. Benassi (Eds.), In their own words: What scholars and teachers want you to know about why and how to apply the science of learning in your academic setting. Society for the Teaching of Psychology, Division 2, American Psychological Association.",
    "Fiorella, L., & Mayer, R. E. (2013). The relative benefits of learning by teaching and teaching expectancy. Contemporary Educational Psychology, 38(4), 281–288.",
    "Kobayashi, K. (2019). Learning by preparing-to-teach and teaching: A meta-analysis. Japanese Psychological Research, 61(3), 192–203.",
    "Koh, A. W. L., Lee, S. C., & Lim, S. W. H. (2018). The learning benefits of teaching: A retrieval practice hypothesis. Applied Cognitive Psychology, 32(3), 401–410.",
    "Nestojko, J. F., Bui, D. C., Kornell, N., & Bjork, E. L. (2014). Expecting to teach enhances learning and organization of knowledge in free recall of text passages. Memory & Cognition, 42(7), 1038–1048.",
    "Rozenblit, L., & Keil, F. (2002). The misunderstood limits of folk science: An illusion of explanatory depth. Cognitive Science, 26, 521–562.",
    "Silk-Eglit, G., & Kurtz, K. J. (2011). Types of cognitive content and the role of relational processing in the illusion of explanatory depth. Proceedings of the Annual Meeting of the Cognitive Science Society, 33.",
  ],
};
