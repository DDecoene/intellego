import type { Line, Token, WordReveal } from "@/content/types";

// Splits a Latin line into word tokens and non-word (space/punct) tokens.
// Word characters include Latin letters with macrons.
const WORD_RE = /[A-Za-zĀāĒēĪīŌōŪūȳ]+/gu;

export function tokenizeLine(
  text: string,
  reveals: Record<string, WordReveal>,
  lemmaOf: (word: string) => string,
): Line {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of text.matchAll(WORD_RE)) {
    const start = m.index ?? 0;
    if (start > last) tokens.push({ kind: "text", text: text.slice(last, start) });
    const w = m[0];
    const lemma = lemmaOf(w);
    tokens.push({ kind: "word", text: w, lemma, reveal: reveals[lemma] ?? {} });
    last = start + w.length;
  }
  if (last < text.length) tokens.push({ kind: "text", text: text.slice(last) });
  return { tokens };
}
