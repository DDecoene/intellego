import type { Chapter, Token } from "@/content/types";

const sp: Token = { kind: "text", text: " " };
const dot: Token = { kind: "text", text: "." };

export const ch6: Chapter = {
  id: "ch6",
  scene: "/assets/scenes/ch6.svg",
  knownVocab: [
    "gaius", "panis", "in", "fornax", "coquit", "calida", "est", "hic",
    "farina", "bona",
  ],
  lines: [
    {
      tokens: [
        { kind: "word", text: "Gaius", lemma: "gaius", reveal: { picture: "/assets/words/gaius.svg", audio: "/assets/audio/gaius.mp3" } },
        sp,
        { kind: "word", text: "pānem", lemma: "panis", reveal: { picture: "/assets/words/panis.svg", audio: "/assets/audio/panis.mp3" } },
        sp,
        { kind: "word", text: "in", lemma: "in", reveal: { paraphrase: "intus", audio: "/assets/audio/in.mp3" } },
        sp,
        { kind: "word", text: "fornāce", lemma: "fornax", reveal: { picture: "/assets/words/fornax.svg", audio: "/assets/audio/fornax.mp3" } },
        sp,
        { kind: "word", text: "coquit", lemma: "coquit", isVerb: true, reveal: { animation: "/assets/words/coquit.svg", audio: "/assets/audio/coquit.mp3" } },
        dot,
      ],
    },
  ],
};
