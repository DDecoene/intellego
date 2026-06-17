import { getSections } from "@/content/sections";
import { SectionTrail } from "./SectionTrail";

export function HomeMap() {
  const sections = getSections();
  return (
    <main className="mx-auto min-h-screen max-w-md bg-[var(--parchment)] px-6 py-8">
      <h1 className="mb-8 text-center text-3xl tracking-[0.3em] text-[var(--terracotta-deep)]">
        INTELLEGŌ
      </h1>
      {sections.map((section) => (
        <SectionTrail key={section.numeral} section={section} />
      ))}
    </main>
  );
}
