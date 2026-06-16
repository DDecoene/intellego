import type { WordReveal } from "@/content/types";

export type ResolvedReveal = {
  picture?: string;
  audio?: string;
  animation?: string;
  paraphrase?: string;
};

// Picture + audio + animation always show when present.
// Paraphrase shows only when there is no picture (picture carries meaning better).
export function composeReveal(reveal: WordReveal): ResolvedReveal {
  const r: ResolvedReveal = {};
  if (reveal.picture) r.picture = reveal.picture;
  if (reveal.audio) r.audio = reveal.audio;
  if (reveal.animation) r.animation = reveal.animation;
  if (!reveal.picture && reveal.paraphrase) r.paraphrase = reveal.paraphrase;
  return r;
}
