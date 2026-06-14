"use client";
import { useState } from "react";
import type { Chapter } from "@/content/types";
import { composeReveal } from "@/reading/composeReveal";
import { WordToken } from "./WordToken";
import { RevealCard } from "./RevealCard";

export function ImmersiveReader({ chapter }: { chapter: Chapter }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [selectedTi, setSelectedTi] = useState<number | null>(null);
  const line = chapter.lines[lineIdx];
  const atEnd = lineIdx >= chapter.lines.length - 1;
  const selectedTok = selectedTi !== null ? line.tokens[selectedTi] : null;

  return (
    <div
      className="relative flex min-h-[80vh] flex-col justify-end bg-cover p-6 text-amber-50"
      style={{ backgroundImage: `url(${chapter.scene})` }}
    >
      <p className="text-2xl drop-shadow-lg">
        {line.tokens.map((t, ti) => {
          if (t.kind !== "word") return <span key={ti}>{t.text}</span>;
          return (
            <WordToken key={ti} text={t.text} selected={selectedTi === ti} onSelect={() => setSelectedTi(ti)} />
          );
        })}
      </p>
      {selectedTok && selectedTok.kind === "word" && (
        <div className="mt-4">
          <RevealCard word={selectedTok.text} resolved={composeReveal(selectedTok.reveal)} />
        </div>
      )}
      {!atEnd && (
        <button
          aria-label="→"
          onClick={() => { setLineIdx((i) => i + 1); setSelectedTi(null); }}
          className="mt-6 self-end rounded-full bg-amber-50/20 px-5 py-2 text-2xl"
        >→</button>
      )}
    </div>
  );
}
