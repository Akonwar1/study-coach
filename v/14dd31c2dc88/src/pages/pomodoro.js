export default {
  glance: [
    { kind: "number", value: "24 + 6", unit: "minutes", text: "the Pomodoro-style schedule tested against students choosing their own breaks, with 87 university students over a day of study", source: "Biwer et al., 2023" },
    { kind: "compare", items: [{ name: "Energy (vigor)", value: 0.36, tone: "a" }, { name: "Less tiredness", value: 0.35, tone: "a" }], max: 1, decimals: 2, text: "average effect of breaks of 10 minutes or less, across 22 samples and 2,335 people (Cohen’s d; about 0.2 is small, 0.5 is medium)", source: "Albulescu et al., 2022" },
    { kind: "effect", symbol: "d", value: 0.16, text: "average effect of those breaks on task performance, which was too small to rule out chance", source: "Albulescu et al., 2022" },
    { kind: "number", value: "Late 1980s", text: "when Francesco Cirillo, then a university student, began timing his study with a tomato-shaped kitchen timer", source: "Cirillo" },
  ],
  history: [
    { when: "Late 1980s", text: "Francesco Cirillo, a university student struggling to stay focused on his studies, began timing short bursts of work with a tomato-shaped kitchen timer. “Pomodoro” is the Italian word for tomato." },
    { when: "2006", text: "Cirillo wrote the method up in a short book and shared it online, and it spread widely, first in the software community. The standard form is 25 minutes of work, a 5-minute break, and a longer break after four rounds." },
    { when: "2011", text: "Ariga and Lleras proposed that attention drifts on long tasks because the brain stops treating the goal as important, and that brief breaks reactivate it." },
    { when: "2012", text: "Helton and Russell tried a similar experiment with brief breaks and found support for no effect, in a paper titled “Brief mental breaks and content-free cues may not keep you focused”." },
    { when: "2022–2023", text: "Albulescu and colleagues pooled studies of micro-breaks (2022), and Biwer and colleagues compared a Pomodoro-style schedule with self-chosen breaks in real study sessions (2023)." },
  ],
  how: [
    { heading: "A timer instead of willpower", text: "Pomodoro does not change what you study; it changes how you hold your time. A fixed block with a clear end makes starting easier (“just 25 minutes”) and gives you a finish line. Dunlosky’s review of ten study techniques does not include time management, so the evidence is different in kind from the memory methods on the other pages." },
    { heading: "Why a short break might help", text: "Ariga and Lleras’s idea, called goal habituation, is that on a long, repetitive task your brain stops keeping the task’s goal active, so performance slides. In their experiment, people doing a long vigilance task who briefly switched to a different task did not show the usual decline in performance. A later attempt by Helton and Russell did not find the same effect, so the idea is not settled." },
    { heading: "Breaks you plan versus breaks you take", text: "In Biwer and colleagues’ study, students who chose their own breaks studied and rested for longer stretches, and reported more fatigue and distraction and less concentration and motivation than students on a fixed schedule. Task completion and mental effort did not differ, so the fixed schedule got the same work done in less time." },
    { heading: "What breaks do and do not do", text: "Albulescu and colleagues found that breaks of 10 minutes or less gave a small boost to energy and reduced tiredness. The effect on performance was small and not statistically significant overall; the benefit showed up for tasks that demand less thinking, and longer breaks helped more." },
  ],
  evidence: [
    {
      title: "Biwer et al. (2023): Pomodoro breaks versus self-chosen breaks",
      text: "Eighty-seven Dutch bachelor’s and master’s students did one day of online-guided self-study in one of three groups: 35 chose their own breaks, 25 studied for 24 minutes and then took a 6-minute break (the Pomodoro-style schedule), and 27 studied for 12 minutes and took a 3-minute break. The students who chose their own breaks studied and rested for longer and reported more fatigue and distractedness and less concentration and motivation. Mental effort and task completion did not differ among the groups. The authors concluded that fixed breaks improved mood and were more efficient. The study had no group that took no breaks.",
    },
    {
      title: "Albulescu et al. (2022): pooling micro-break studies",
      text: "This meta-analysis combined 22 samples from 19 records, with 2,335 people, on micro-breaks (breaks of about 10 minutes or less). The effects on well-being were small but reliable. The effect on performance was not statistically significant overall, and only tasks with lower cognitive demands showed a gain. Longer breaks gave bigger boosts, and the authors suggest that recovering from highly draining tasks may take more than 10 minutes.",
      chart: {
        title: "Average effect of micro-breaks (Cohen’s d)",
        groups: [{ label: "", bars: [
          { label: "Vigor (feeling energetic)", value: 0.36, tone: "a", valueText: "0.36" },
          { label: "Less fatigue", value: 0.35, tone: "a", valueText: "0.35" },
          { label: "Task performance (not statistically significant)", value: 0.16, tone: "c", valueText: "0.16" },
        ] }],
        max: 1,
        source: "Albulescu et al. (2022), abstract.",
      },
    },
    {
      title: "Ariga & Lleras (2011) and Helton & Russell (2012): do brief breaks protect attention?",
      text: "Ariga and Lleras had people do a long visual vigilance task while holding digits in memory. Performance fell steeply over time when people recalled the digits only at the end; it did not fall when they were asked to recall them occasionally during the task. They took this to show that a brief diversion reactivates the task goal. Helton and Russell later reported support for the null hypothesis with a related design, meaning their data favoured no benefit from brief breaks.",
    },
  ],
  limits: [
    { heading: "The effect on how well you perform is not shown", text: "Across the micro-break studies, short breaks lifted energy and reduced tiredness but did not clearly improve performance (d = 0.16, not significant). A better mood is a real benefit, but it is not the same as learning more." },
    { heading: "The 25/5 numbers are a convention", text: "The best-known schedule is Cirillo’s. Biwer’s study compared 24/6 and 12/3, and the other evidence is about breaks of 10 minutes or less in general. No study here shows that 25 minutes is the right length." },
    { heading: "The main study had no no-break group", text: "Biwer’s three groups all took breaks, so it shows fixed breaks beat self-chosen ones in that sample. It cannot say how fixed breaks compare with working straight through." },
    { heading: "Small, short and mixed evidence", text: "Biwer’s study followed 87 students for one day, and Helton and Russell did not find the effect Ariga and Lleras reported. Treat Pomodoro as a useful habit with moderate support, not a proven performance booster." },
  ],
  practice: {
    visual: { name: "pomodoro-cycle" },
    caption: "Illustration: the cycle used in the guided Pomodoro session.",
  },
  sources: [
    "Albulescu, P., Macsinga, I., Rusu, A., Sulea, C., Bodnaru, A., & Tulbure, B. T. (2022). “Give me a break!” A systematic review and meta-analysis on the efficacy of micro-breaks for increasing well-being and performance. PLOS ONE, 17(8), e0272460.",
    "Ariga, A., & Lleras, A. (2011). Brief and rare mental “breaks” keep you focused: Deactivation and reactivation of task goals preempt vigilance decrements. Cognition. https://doi.org/10.1016/j.cognition.2010.12.007",
    "Biwer, F., Wiradhany, W., oude Egbrink, M., & de Bruin, A. B. H. (2023). Understanding effort regulation: Comparing ‘Pomodoro’ breaks and self-regulated breaks. British Journal of Educational Psychology, 93, 353–367. https://doi.org/10.1111/bjep.12593",
    "Cirillo, F. (2018). The Pomodoro Technique: The life-changing time-management system. New York: Currency.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
    "Helton, W. S., & Russell, P. N. (2012). Brief mental breaks and content-free cues may not keep you focused. Experimental Brain Research.",
  ],
};
