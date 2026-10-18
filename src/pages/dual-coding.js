export default {
  glance: [
    { kind: "effect", symbol: "d", value: 1.35, text: "median advantage on a transfer test of learning from words plus graphics rather than words alone, across 13 comparisons", source: "Mayer, 2021" },
    { kind: "dots", filled: 26, total: 30, text: "people who remembered more words they had drawn than words they had written out", source: "Wammes et al., 2016" },
    { kind: "number", value: "7", unit: "experiments", text: "in one paper found that drawing helped memory more than writing, and that imagery or picture superiority alone did not explain it", source: "Wammes et al., 2016" },
    { kind: "badge", value: "Low utility", text: "Dunlosky et al.’s rating for imagery use, which includes picturing or sketching simple images of what you read; the evidence is mixed", source: "Dunlosky et al., 2013" },
  ],
  history: [
    { when: "1967", text: "Roger Shepard published “Recognition memory for words, sentences, and pictures”. People were better at recognising pictures they had seen than words, a finding now called the picture superiority effect." },
    { when: "1971 and 1986", text: "Allan Paivio proposed dual-coding theory in his book Imagery and Verbal Processes and developed it in Mental Representations: A Dual Coding Approach. The mind, he argued, has two linked systems, one for language and one for images, and an idea stored in both has two routes back to it." },
    { when: "1990s onward", text: "Richard Mayer’s experiments on learning from words and pictures, such as how well students understood a tire pump after hearing an explanation with or without an animation (Mayer & Anderson, 1991), built up a large body of evidence for combining words with pictures." },
    { when: "2013", text: "Dunlosky and colleagues rated imagery use for learning text “low utility” in their review of ten study techniques." },
    { when: "2016", text: "Wammes, Meade and Fernandes ran seven experiments on the “drawing effect” and found drawing beat writing for memory, and that picture superiority and imagery alone could not explain it." },
    { when: "2023", text: "Mayer summarised 13 experimental comparisons in which students learned more from words and graphics than from words alone, with a median effect of d = 1.35." },
  ],
  how: [
    { heading: "Two routes to the same idea", text: "Dual-coding theory says that you store verbal information (words, explanations) and visual information (pictures, layouts) in two linked systems. If you study an idea both ways, you have two ways to get back to it, and each can help recover the other." },
    { heading: "Why drawing adds something", text: "Making a diagram is more than looking at one. You decide what the parts are, how they connect and what to leave out. Mayer’s account of multimedia learning says people learn best when they select the important information, organise it and integrate it with what they already know, and building your own diagram makes you do all three." },
    { heading: "What researchers still don’t know", text: "Wammes and colleagues tested whether drawing helps only because it makes you think harder, because it creates mental images or because pictures are simply more memorable. Their experiments ruled out each of these as a complete explanation. They proposed that drawing helps by combining meaning, visual detail and hand movement into a single memory." },
    { heading: "Making a picture is not the same as picturing", text: "Dunlosky’s review put imagery use, in which you imagine or draw simple pictures of what you read, in the low-utility group, and Donoghue and Hattie note that it works best with material that is easy to picture. The drawing experiments described here used easy-to-draw words. A diagram that shows real relationships is different from a decorative sketch." },
  ],
  evidence: [
    {
      title: "Mayer (2021, 2023): words and graphics versus words alone",
      text: "Over 13 experimental comparisons, Mayer and colleagues found that students did much better on a transfer test, meaning questions that needed them to apply what they had learned to new problems, after learning from words and graphics than from words alone (for example, narration with an animation compared with narration alone, or text with illustrations compared with text alone). The median effect size was d = 1.35. In one example, students answered more troubleshooting questions about a tire pump after a narrated animation than after hearing the narration alone. In these comparisons the graphics were given to the learners, not drawn by them.",
    },
    {
      title: "Wammes, Meade & Fernandes (2016): the drawing effect",
      text: "In the first experiment, people saw a list of 15 easy-to-draw words, such as “apple”, and for each one either drew it or wrote it out. After a filler task they recalled as many words as they could. In two versions of that experiment, with 30 and 25 people, drawn words were recalled better than written ones (d = 1.51 and d = 0.96); 26 of the 30 people in the first version remembered more drawn than written words. Further experiments found the benefit with shorter drawing time and longer lists, and even when drawing and writing were done in separate lists by different people.",
      chart: {
        title: "Size of the advantage from learning with pictures (Cohen’s d)",
        groups: [{ label: "", bars: [
          { label: "Words and graphics vs. words alone (median of 13 comparisons)", value: 1.35, tone: "a", valueText: "1.35" },
          { label: "Drawing vs. writing words, first experiment (30 people)", value: 1.51, tone: "a", valueText: "1.51" },
          { label: "Drawing vs. writing words, repeat (25 people)", value: 0.96, tone: "a", valueText: "0.96" },
          { label: "Imagery use for learning text, all studies pooled", value: 0.56, tone: "c", valueText: "0.56" },
        ] }],
        max: 2,
        source: "Mayer (2023); Wammes et al. (2016); Donoghue & Hattie (2021). The four results measure different tasks, so read them as separate findings, not a ranking.",
      },
    },
    {
      title: "Donoghue & Hattie (2021) and Dunlosky et al. (2013): imagery use",
      text: "In a meta-analysis of the ten techniques from Dunlosky’s review, imagery use for learning text had an average effect of d = 0.56 across 135 comparisons and 1,052 learners. Dunlosky’s review rated it low utility, noting that it is limited to material that is easy to picture and to what memory can hold.",
    },
  ],
  limits: [
    { heading: "It suits some material better than others", text: "The strong results are for things with a shape: how a pump works, easy-to-draw words, relationships between parts. For a list of dates or abstract definitions, a drawing may add little." },
    { heading: "Drawing takes time", text: "Making a good diagram is slower than rereading. In Wammes’s experiments, the benefit held with less drawing time, but the tasks were simple words, not whole topics." },
    { heading: "Most of the multimedia research used ready-made graphics", text: "Mayer’s large effect compares learning from words with learning from words plus a graphic made by experts. It does not by itself show that drawing your own diagram works as well." },
    { heading: "The theory is still debated", text: "Wammes and colleagues found that the benefit of drawing could not be explained by imagery, depth of processing or picture superiority alone. Dual-coding theory is a useful picture of why diagrams might help, not a settled account." },
  ],
  practice: {
    visual: { name: "diagram-types" },
    caption: "Illustration: kinds of diagram used in the guided Dual Coding session.",
  },
  sources: [
    "Donoghue, G. M., & Hattie, J. A. C. (2021). A meta-analysis of ten learning techniques. Frontiers in Education, 6, Article 581216.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
    "Mayer, R. E. (2023). Research-based principles for designing multimedia instruction. In C. E. Overson, C. M. Hakala, L. L. Kordonowy, & V. A. Benassi (Eds.), In their own words: What scholars and teachers want you to know about why and how to apply the science of learning in your academic setting. Society for the Teaching of Psychology, Division 2, American Psychological Association.",
    "Mayer, R. E., & Anderson, R. B. (1991). Animations need narrations: An experimental test of a dual-coding hypothesis. Journal of Educational Psychology, 83(4), 484–490.",
    "Paivio, A. (1971). Imagery and verbal processes. New York: Holt, Rinehart and Winston.",
    "Paivio, A. (1986). Mental representations: A dual coding approach. New York: Oxford University Press.",
    "Shepard, R. N. (1967). Recognition memory for words, sentences, and pictures. Journal of Verbal Learning and Verbal Behavior, 6, 156–163.",
    "Wammes, J. D., Meade, M. E., & Fernandes, M. A. (2016). The drawing effect: Evidence for reliable and robust memory benefits in free recall. Quarterly Journal of Experimental Psychology. https://doi.org/10.1080/17470218.2015.1094494",
  ],
};
