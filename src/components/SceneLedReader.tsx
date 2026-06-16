"use client";
import { useState } from "react";
import type { Chapter } from "@/content/types";
import { composeReveal } from "@/reading/composeReveal";
import { WordToken } from "./WordToken";
import { RevealCard } from "./RevealCard";

export function SceneLedReader({ chapter }: { chapter: Chapter }) {
  const [selected, setSelected] = useState<{ key: string; text: string } | null>(null);

  return (
    <div className="mx-auto max-w-md px-5 pb-16">
      <div className="overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_-20px_rgba(58,47,34,0.55)] ring-1 ring-[var(--gold)]/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={chapter.scene} alt="scaena" className="aspect-[5/3] w-full object-cover" />
      </div>
      <div className="mt-7 font-display text-[1.7rem] leading-[1.85] tracking-wide text-[var(--ink)]">
        {chapter.lines.map((line, li) => (
          <p key={li}>
            {line.tokens.map((t, ti) => {
              const key = `${li}:${ti}`;
              if (t.kind !== "word") return <span key={key}>{t.text}</span>;
              return (
                <WordToken
                  key={key}
                  text={t.text}
                  selected={selected?.key === key}
                  onSelect={() => setSelected({ key, text: t.text })}
                />
              );
            })}
          </p>
        ))}
      </div>
      {selected && (() => {
        const [li, ti] = selected.key.split(":").map(Number);
        const tok = chapter.lines[li].tokens[ti];
        if (tok.kind !== "word") return null;
        return (
          <div className="mt-7">
            <RevealCard word={tok.text} resolved={composeReveal(tok.reveal)} />
          </div>
        );
      })()}
    </div>
  );
}
