import type { Chapter } from "@/content/types";

// A tappable word MUST resolve to a wordless meaning channel:
// picture, animation, or a Latin paraphrase. Audio alone is pronunciation,
// not meaning. Any word failing this would force English or a dead tap.
export function findUnresolvedWords(chapter: Chapter): string[] {
  const bad: string[] = [];
  for (const line of chapter.lines) {
    for (const t of line.tokens) {
      if (t.kind !== "word") continue;
      const { picture, animation, paraphrase } = t.reveal;
      if (!picture && !animation && !paraphrase) bad.push(t.text);
    }
  }
  return bad;
}
