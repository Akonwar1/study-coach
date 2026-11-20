export default {
  glance: [
    { kind: "number", value: "1946", text: "the year Francis Robinson set out SQ3R in his book Effective Study, after developing it for a World War II army program", source: "Robinson, 1946" },
    { kind: "compare", items: [{ name: "Relationships between ideas", value: 20, tone: "a" }, { name: "Facts", value: 14, tone: "a" }, { name: "Concepts", value: 13, tone: "a" }], max: 25, unit: "%", text: "more learned by students using the newer SOAR system than by students using SQ3R", source: "Jairam et al., 2014" },
    { kind: "badge", value: "No difference", text: "in test scores between SQ3R-trained students and students using their own study methods, in a study of 138 college students", source: "Kasson, 2012" },
    { kind: "effect", symbol: "g", value: 0.5, text: "average benefit of recalling material instead of restudying it, which is what the Recite step is", source: "Rowland, 2014" },
  ],
  history: [
    { when: "World War II", text: "Francis P. Robinson developed SQ3R as part of the Army Specialized Training Program, which aimed to help military personnel become better readers." },
    { when: "1946", text: "Robinson described SQ3R in his book Effective Study: Survey the chapter, turn headings into Questions, Read to answer them, Recite what you have learned, and Review. It became one of the best-known textbook study methods." },
    { when: "2013", text: "Dunlosky and colleagues reviewed ten study techniques but did not review SQ3R as a package. Practice testing, the idea behind its Recite step, was one of two techniques rated “high utility”." },
    { when: "2012–2014", text: "Jairam and colleagues reported what they described as the first direct comparison of SQ3R with a newer system called SOAR (Select, Organize, Associate, Regulate), published in 2014. A master’s thesis by Kasson (2012) compared them again." },
  ],
  how: [
    { heading: "A route through a chapter", text: "SQ3R is a structure for reading a dense chapter rather than a single memory trick. Surveying the headings gives you a map, the questions give you a purpose for reading, and the last two steps check what you took in." },
    { heading: "The strongest part is probably Recite", text: "Saying or writing what you remember without looking is retrieval practice, the testing effect described on the Active Recall page. In Rowland’s meta-analysis, testing beat restudying by an average of g = 0.50. If SQ3R helps, the Recite step is the most likely reason." },
    { heading: "Reading with a question in mind", text: "Turning each heading into a question means you read to find an answer, which asks more of you than reading to the end of a page. This step is the natural first move toward an explanation, so it also connects to Elaborative Interrogation." },
    { heading: "What the research has actually tested", text: "We found few direct tests of SQ3R as a whole. Jairam and colleagues describe it as “long popular” and note that few studies compare study systems with one another. What we found is a small number of direct comparisons, described below." },
  ],
  evidence: [
    {
      title: "Jairam et al. (2014): SOAR versus SQ3R",
      text: "College students were trained in either SQ3R or SOAR and given matching study materials. They used their system to study a text and were then tested on facts, relationships between ideas and concepts. Students who used SOAR outperformed those who used SQ3R. The authors attribute this to SOAR’s cognitive-processing advantages: it has learners select the key ideas, organise them, and associate them with each other and with what they already know.",
      chart: {
        title: "How much more SOAR users learned than SQ3R users",
        groups: [{ label: "", bars: [
          { label: "Relationships between ideas", value: 20, tone: "a" },
          { label: "Facts", value: 14, tone: "a" },
          { label: "Concepts", value: 13, tone: "a" },
        ] }],
        max: 25,
        unit: "%",
        source: "Jairam et al. (2014), abstract. SOAR is a different study system, not the same as SQ3R.",
      },
    },
    {
      title: "Kasson (2012): SQ3R, SOAR and students’ own methods",
      text: "In a master’s thesis, 138 college students were randomly assigned to be trained in SOAR, in SQ3R or to study the way they preferred, then studied educational measurement material and were tested on facts, relationships, concepts and skills. There were no differences in test scores among the SOAR, SQ3R and own-method groups. One difference did show up: students trained in SQ3R felt more prepared to study than the others.",
    },
    {
      title: "Rowland (2014): the Recite step",
      text: "Rowland’s meta-analysis of 159 comparisons from 61 studies found that testing beat restudying on later tests by g = 0.50 on average. SQ3R’s Recite step asks you to do exactly this after each section, and its Review step does it again at the end.",
    },
  ],
  limits: [
    { heading: "Little direct evidence", text: "Apart from two direct comparisons with SOAR, there is little experimental evidence on SQ3R as a package. The popularity of a method is not proof that it works." },
    { heading: "One study found no edge over students’ own methods", text: "In Kasson’s thesis, students trained in SQ3R did no better than students who used their own methods. They did feel better prepared, which may be worth something, since feeling prepared is not the same as being prepared." },
    { heading: "It takes longer than reading once", text: "SQ3R means surveying, questioning and recalling around each section, so it covers fewer pages in the same time. That is a trade, not a flaw: the guided session asks for 5 to 8 pages for this reason." },
    { heading: "Parts may matter more than the whole", text: "If the recall step is what helps, you can get much of the benefit by reading a section and recalling it, without the other steps. The survey and question steps may help you read with a purpose, but the experiments here do not show how much." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Survey", "Question", "Read", "Recite", "Review"] },
    caption: "Illustration: the five steps of the guided SQ3R session.",
  },
  sources: [
    "Jairam, D., Kiewra, K. A., Rogers-Kasson, S., Patterson-Hazley, M., & Marxhausen, K. (2014). SOAR versus SQ3R: A test of two study systems. Instructional Science, 42, 409–420. https://doi.org/10.1007/s11251-013-9295-0",
    "Kasson, S. C. (2012). Which study method works best? A comparison of SOAR and SQ3R for text learning (Master’s thesis). University of Nebraska–Lincoln.",
    "Robinson, F. P. (1946). Effective study. New York: Harper & Brothers.",
    "Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. Psychological Bulletin, 140(6), 1432–1463.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
  ],
};
