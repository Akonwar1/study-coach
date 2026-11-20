import { techniqueChart } from "./technique-chart.js";

export default {
  glance: [
    { kind: "effect", symbol: "d", value: 0.56, text: "average effect of asking “why is this true?” across 254 comparisons and 2,138 learners", source: "Donoghue & Hattie, 2021" },
    { kind: "badge", value: "Moderate utility", text: "the rating: below practice testing and distributed practice, but well above highlighting and re-reading", source: "Dunlosky et al., 2013" },
    { kind: "badge", value: "Precise beats vague", text: "explanations that are specific, and that you come up with yourself instead of reading, helped more", source: "Donoghue & Hattie, 2021" },
    { kind: "badge", value: "Knowing more helps", text: "the benefit is larger for learners who already know more about the topic", source: "Donoghue & Hattie, 2021" },
  ],
  history: [
    { when: "The idea", text: "Elaborative interrogation means asking “Why does this make sense?” or “Why is this true?” about a fact and answering it with what you already know. “Elaboration” is the psychologists’ word for adding detail and connections to something you are learning." },
    { when: "1987", text: "Pressley, McDaniel, Turnure, Wood and Ahmad published “Generation and precision of elaboration”, a study of two things that turned out to matter: whether the learner makes up the explanation, and how precise it is." },
    { when: "1992", text: "Woloshyn, Pressley and Schneider studied how much a learner already knows about a topic changes the benefit, in a paper titled “Elaborative-interrogation and prior-knowledge effects on learning of facts”." },
    { when: "2013", text: "Dunlosky and colleagues rated elaborative interrogation “moderate utility” in their review of ten study techniques." },
    { when: "2021", text: "Donoghue and Hattie pooled 254 comparisons of elaborative interrogation in a meta-analysis of all ten techniques and found an average effect of d = 0.56." },
  ],
  how: [
    { heading: "What you actually do", text: "While you study, stop at a fact and ask why it is true. Then answer from your own knowledge, before looking anything up. Dunlosky’s own example is a student reading that plants turn carbon dioxide and water into sugar: she reasons that it must be true because everything alive needs some kind of food, and sugar is something people eat." },
    { heading: "Why it is meant to work", text: "The purpose is to connect new information to what you already know (Donoghue & Hattie, 2021). A fact you can explain is attached to other facts, and attached knowledge is easier to find again than a loose sentence." },
    { heading: "Your explanation does not have to be right", text: "Dunlosky notes that trying to explain why a fact may be true can still help understanding and memory even when the explanation is not exactly on the mark. That is why the guided session has you answer first and check the source afterwards." },
    { heading: "Precision, effort and knowledge", text: "In the pooled studies the effect was higher when the explanations were precise rather than vague, when they were self-generated rather than provided, and when learners had more prior knowledge (Donoghue & Hattie, 2021)." },
    { heading: "Better for facts than for deep understanding", text: "Donoghue and Hattie describe the method as more applicable to surface knowledge than to deep understanding. For deeper material, Feynman and Self-Explanation ask more of you." },
  ],
  evidence: [
    {
      title: "Donoghue & Hattie (2021): the ten techniques side by side",
      text: "This meta-analysis pooled 242 studies, 1,619 effects and 169,179 learners across the ten techniques Dunlosky’s team had reviewed. For elaborative interrogation it found d = 0.56 across 254 comparisons and 2,138 learners. The studies disagreed with each other a lot: about 78% of the variation between them was real difference, not chance, which means the average hides large swings depending on the material and the learners.",
      chart: techniqueChart("elaborative"),
      afterText: "Read this as a rough ranking, not a precise one. The techniques were tested on different materials, and the authors warn that most pooled studies measured memory for facts.",
    },
    {
      title: "Dunlosky et al. (2013): the rating",
      text: "In the ten-technique review, elaborative interrogation, self-explanation and interleaved practice each received “moderate” support. Practice testing and distributed practice received “high” support; summarising, highlighting, the keyword mnemonic, imagery use and re-reading received “low”.",
    },
  ],
  limits: [
    { heading: "Facts more than understanding", text: "The method is better suited to surface knowledge, such as why a fact holds, than to deep, connected understanding (Donoghue & Hattie, 2021). If you cannot yet explain the basics, try Feynman or Self-Explanation first." },
    { heading: "You need something to connect to", text: "The effect was larger for learners with more prior knowledge. With no background in a topic, there is little to attach a “because” to, and answers tend to be guesses." },
    { heading: "Vague answers help less", text: "Precise explanations beat imprecise ones. “Because it’s important” is not an explanation. The guided session asks you to compare your answer with the source for that reason." },
    { heading: "The average hides a wide range", text: "Studies of this technique disagreed a lot with each other, so a medium average effect does not guarantee a medium benefit for any one student or subject." },
    { heading: "Not every experiment finds a benefit", text: "In a 2019 experiment with 96 university students, being prompted to ask why did not improve free recall or problem solving compared with a control group (Kühl & Bertrams, 2019). It is one small study, but it is a reminder that an average across studies includes experiments that find nothing." },
    { heading: "What Dunlosky’s review could not say", text: "Dunlosky and colleagues found firm evidence for elaborative interrogation on tests of memory after short delays, across a broad range of factual topics. They rated the evidence insufficient on whether it helps comprehension, whether the benefit lasts across longer delays and whether it works in representative educational settings, and had concerns about material lengthier or more complex than lists of facts." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Pick a fact", "Ask why", "Answer it", "Check source"] },
    caption: "Illustration: the loop used in the guided Elaborative Interrogation session.",
  },
  sources: [
    "Donoghue, G. M., & Hattie, J. A. C. (2021). A meta-analysis of ten learning techniques. Frontiers in Education, 6, Article 581216.",
    "Dunlosky, J. (2013). Strengthening the student toolbox: Study strategies to boost learning. American Educator, Fall 2013.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
    "Kühl, T., & Bertrams, A. (2019). Is learning with elaborative interrogation less desirable when learners are depleted? Frontiers in Psychology, 10, Article 707.",
    "Pressley, M., McDaniel, M. A., Turnure, J. E., Wood, E., & Ahmad, M. (1987). Generation and precision of elaboration: Effects on intentional and incidental learning. Journal of Experimental Psychology: Learning, Memory, and Cognition, 13, 291–300.",
    "Woloshyn, V. E., Pressley, M., & Schneider, W. (1992). Elaborative-interrogation and prior-knowledge effects on learning of facts. Journal of Educational Psychology, 84(1), 115–124.",
  ],
};
