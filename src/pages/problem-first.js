export default {
  glance: [
    { kind: "effect", symbol: "g", value: 0.36, text: "average benefit of trying problems before instruction, on conceptual knowledge and transfer, across 53 studies and 166 comparisons", source: "Sinha & Kapur, 2021" },
    { kind: "number", value: "No gain", unit: "for procedures", text: "on procedural knowledge, the same designs did no better than instruction first (g = −0.03, range −0.20 to 0.15)", source: "Sinha & Kapur, 2021" },
    { kind: "compare", items: [{ name: "Teaching built on students’ attempts", value: 0.56, tone: "a" }, { name: "Teaching that did not", value: 0.2, tone: "c" }], max: 1, decimals: 2, text: "average benefit (g) when the instruction after the attempts built on what students had produced", source: "Sinha & Kapur, 2021" },
    { kind: "badge", value: "Not for young children", text: "for second to fifth graders the results leaned towards instruction first, and the same was true for general skills such as controlling variables", source: "Sinha & Kapur, 2021" },
  ],
  history: [
    { when: "1998", text: "Schwartz and Bransford’s “A time for telling” described how activities before instruction can prepare students to learn from it. Sinha and Kapur call this the broader idea of preparation for future learning." },
    { when: "2006", text: "Kirschner, Sweller and Clark argued that minimal guidance during instruction does not work, a leading case for instruction first." },
    { when: "2008", text: "Kapur introduced productive failure: students attempt problems built on concepts they have not been taught, usually failing, and a teacher then builds on their attempts." },
    { when: "2012", text: "Kapur and Bielaczyc set out design principles for productive failure, which later work uses to judge how closely a study follows the method." },
    { when: "2017–2018", text: "Loibl, Roll and Rummel proposed a theory of when and how problem solving before instruction helps, and Darabi and colleagues pooled 12 studies, finding g = 0.43 (as described by Sinha & Kapur)." },
    { when: "2021", text: "Sinha and Kapur pooled 53 studies with 166 comparisons, and separated conceptual understanding and transfer from procedural skill." },
  ],
  how: [
    { heading: "What you actually do", text: "You attempt a new kind of problem before being taught how to solve it, then you are taught the idea, building on your attempts. The researchers call this problem solving followed by instruction, or PS-I, against instruction followed by problem solving, or I-PS. Productive failure is the version in which the first problem is designed so that students usually fail it (Sinha & Kapur, 2021)." },
    { heading: "Why it might work", text: "The argument is that attempting the problem first lets you notice and encode the important features on your own, and that producing several rough solutions activates what you already know, so the instruction that follows has something to attach to (Sinha & Kapur, 2021)." },
    { heading: "The case against", text: "The instruction-first side argues that students who lack prior knowledge waste time searching through possible solutions, which can overload working memory, and that they are better served by studying worked examples first (Sinha & Kapur, 2021, describing Kirschner et al., 2006). This is why Problem First and Worked Examples are different answers to the same problem." },
    { heading: "Several attempts, then teaching that builds on them", text: "Comparisons did better when students produced several solution attempts (g = 0.47 against 0.16 without evidence of them), when the teaching built on the students’ own solutions (0.56 against 0.20) and when the teaching was dialogue-led (0.55 against 0.24). Only some of these differences were statistically clear, so treat them as leads, not rules." },
    { heading: "It builds understanding, not procedural speed", text: "Across 51 comparisons of procedural knowledge the pooled effect was g = −0.03, so you still need deliberate practice of the method afterwards. That is why the guided session ends with practice." },
  ],
  evidence: [
    {
      title: "Sinha & Kapur (2021): a meta-analysis of 53 studies",
      text: "The authors compared problem solving followed by instruction with instruction followed by problem solving in 53 studies with 166 comparisons, mostly in mathematics and physics. For conceptual knowledge and transfer the average benefit was g = 0.36 (95% range 0.20 to 0.51), with moderate variation between comparisons (I² = 42%). For procedural knowledge there was no benefit (g = −0.03). The sample was 45% sixth to tenth graders and 37% undergraduates. Tests for lopsided results found no sign of small-study bias, and the p-curve showed evidential value. The authors’ own estimate after accounting for publication bias was larger (g = 0.87), but that comes from a method that assumes a particular pattern of reporting, so we do not rely on it. We read the full paper.",
      chart: {
        title: "Average benefit on conceptual knowledge and transfer, by study feature (Hedges’ g; about 0.5 is medium)",
        groups: [
          { label: "How the teaching phase worked", bars: [
            { label: "Built on students’ own solutions", value: 0.56, tone: "a", valueText: "0.56" },
            { label: "Did not build on them", value: 0.2, tone: "c", valueText: "0.20" },
          ] },
          { label: "Whether students worked in groups", bars: [
            { label: "Group work", value: 0.49, tone: "a", valueText: "0.49" },
            { label: "No group work", value: 0.19, tone: "c", valueText: "0.19" },
          ] },
          { label: "Students’ grade level", bars: [
            { label: "Sixth to tenth graders", value: 0.5, tone: "a", valueText: "0.50" },
            { label: "Undergraduates", value: 0.28, tone: "b", valueText: "0.28" },
            { label: "Second to fifth graders (instruction first did better)", value: 0.09, tone: "d", valueText: "−0.09" },
          ] },
        ],
        max: 1,
        source: "Sinha & Kapur (2021), subgroup analyses. The red bar is a negative effect, shown at its size.",
      },
    },
    {
      title: "Darabi et al. (2018): an earlier, smaller review",
      text: "Sinha and Kapur describe an earlier meta-analysis by Darabi and colleagues that pooled 12 articles and reported an average benefit of g = 0.43 in favour of attempting first. They point out its small size and that it averaged different kinds of outcome together, which their own analysis avoids.",
    },
  ],
  limits: [
    { heading: "No benefit for procedural skill", text: "The benefit was for conceptual knowledge and transfer. For procedural knowledge the pooled effect was g = −0.03. If your goal is speed at running a method, Worked Examples or practice problems fit better." },
    { heading: "Most of the research used classrooms with groups and designed problems", text: "Studies that used group work did better (g = 0.49) than those that did not (0.19), and the problems were usually designed so that several approaches were possible. Working alone on whatever problem you have is closer to the weaker end of the range." },
    { heading: "Younger children and general skills did worse", text: "For second to fifth graders the results leaned towards instruction first (g = −0.09), and so did the results for domain-general skills such as controlling variables. About 75% of the comparisons were mathematics or physics concepts." },
    { heading: "Complexity may matter", text: "The authors note that one recent study suggests the advantage of trying first may shrink as material becomes more complex, and that evidence outside mathematics and science is thin." },
    { heading: "Failure rates were rarely reported", text: "Most studies did not report how often students actually failed at the problem, so the idea that failure itself helps rests on a weak proxy, the number of different solutions produced." },
  ],
  practice: {
    visual: { name: "flow", labels: ["Pick", "Attempt", "Note gaps", "Learn", "Compare", "Practise"] },
    caption: "Illustration: the steps used in the guided Problem First session.",
  },
  sources: [
    "Darabi, A., Arrington, T. L., & Sayilir, E. (2018). Learning from failure: A meta-analysis of the empirical studies. Educational Technology Research and Development, 66(5), 1101–1118.",
    "Kapur, M. (2008). Productive failure. Cognition and Instruction, 26(3), 379–424.",
    "Kapur, M., & Bielaczyc, K. (2012). Designing for productive failure. Journal of the Learning Sciences, 21(1), 45–83.",
    "Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). Why minimal guidance during instruction does not work: An analysis of the failure of constructivist, discovery, problem-based, experiential, and inquiry-based teaching. Educational Psychologist, 41(2), 75–86.",
    "Loibl, K., Roll, I., & Rummel, N. (2017). Towards a theory of when and how problem solving followed by instruction supports learning. Educational Psychology Review, 29(4), 693–715.",
    "Schwartz, D. L., & Bransford, J. D. (1998). A time for telling. Cognition and Instruction, 16(4), 475–522.",
    "Sinha, T., & Kapur, M. (2021). When problem solving followed by instruction works: Evidence for productive failure. Review of Educational Research, 91(5), 761–798.",
  ],
};
