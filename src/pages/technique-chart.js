// A bar chart comparing the ten study techniques, with one highlighted, for the pages of the methods
// that Donoghue and Hattie (2021) measured directly. Their Table 1 gives each technique's average effect
// size across all the studies they pooled (242 studies, 1,619 effects).

const TECHNIQUES = [
  { id: "distributed", label: "Distributed practice", value: 0.85 },
  { id: "testing", label: "Practice testing", value: 0.74 },
  { id: "elaborative", label: "Elaborative interrogation", value: 0.56 },
  { id: "imagery", label: "Imagery use for text learning", value: 0.56 },
  { id: "explanation", label: "Self-explanation", value: 0.54 },
  { id: "mnemonic", label: "Keyword mnemonic", value: 0.5 },
  { id: "rereading", label: "Re-reading", value: 0.47 },
  { id: "interleaved", label: "Interleaved practice", value: 0.47 },
  { id: "underlining", label: "Underlining", value: 0.44 },
  { id: "summarization", label: "Summarization", value: 0.44 },
];

/** `highlightId` is one of the ids above; that technique's bar is drawn in the accent colour. */
export function techniqueChart(highlightId) {
  return {
    title: "Average effect size of ten techniques in one large meta-analysis (Cohen’s d; higher is a bigger advantage, about 0.5 is medium)",
    groups: [{
      label: "",
      bars: TECHNIQUES.map((technique) => ({
        label: technique.label,
        value: technique.value,
        tone: technique.id === highlightId ? "a" : "c",
        valueText: technique.value.toFixed(2),
      })),
    }],
    max: 1,
    source: "Donoghue & Hattie (2021), Table 1. Most of the pooled studies measured memory for facts, so the numbers say less about deeper understanding.",
  };
}
