import type { SectionEntry } from "@/content/sections";
import { ChapterNode } from "./ChapterNode";

export function SectionTrail({ section }: { section: SectionEntry }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 border-b border-[var(--gold)] pb-1 text-sm uppercase tracking-wide text-[var(--terracotta-deep)] [font-variant:small-caps]">
        <span>{section.numeral}</span>
        {" · "}
        <span>{section.titleLatin}</span>
      </h2>
      <div className="flex flex-col gap-5">
        {section.chapters.map((chapter, i) => (
          <ChapterNode
            key={chapter.id}
            id={chapter.id}
            numeral={chapter.numeral}
            side={i % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
    </section>
  );
}
