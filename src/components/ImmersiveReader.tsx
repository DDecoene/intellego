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
      className="relative flex min-h-[88vh] flex-col justify-end bg-cover bg-center p-7"
      style={{ backgroundImage: `url(${chapter.scene})` }}
    >
      {/* darkening scrim so overlaid Latin stays legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241a0f]/85 via-[#241a0f]/25 to-transparent" />
      <div className="relative">
        <p className="font-display text-4xl leading-snug tracking-wide text-[var(--parchment)] [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          {line.tokens.map((t, ti) => {
            if (t.kind !== "word") return <span key={ti}>{t.text}</span>;
            return (
              <WordToken key={ti} text={t.text} selected={selectedTi === ti} onSelect={() => setSelectedTi(ti)} />
            );
          })}
        </p>
        {selectedTok && selectedTok.kind === "word" && (
          <div className="mt-5">
            <RevealCard word={selectedTok.text} resolved={composeReveal(selectedTok.reveal)} />
          </div>
        )}
        {!atEnd && (
          <button
            aria-label="→"
            onClick={() => { setLineIdx((i) => i + 1); setSelectedTi(null); }}
            className="mt-8 flex h-12 w-12 items-center justify-center self-end rounded-full bg-[var(--parchment)]/15 text-2xl text-[var(--parchment)] backdrop-blur-sm ring-1 ring-[var(--parchment)]/40 transition-colors hover:bg-[var(--parchment)]/30 ml-auto"
          >→</button>
        )}
      </div>
    </div>
  );
}
