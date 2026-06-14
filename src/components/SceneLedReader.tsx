"use client";
import { useState } from "react";
import type { Chapter } from "@/content/types";
import { composeReveal } from "@/reading/composeReveal";
import { WordToken } from "./WordToken";
import { RevealCard } from "./RevealCard";

export function SceneLedReader({ chapter }: { chapter: Chapter }) {
  const [selected, setSelected] = useState<{ key: string; text: string } | null>(null);

  return (
    <div className="mx-auto max-w-md p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={chapter.scene} alt="scaena" className="mb-4 w-full rounded-2xl object-cover" />
      <div className="text-lg leading-relaxed text-stone-800">
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
          <div className="mt-4">
            <RevealCard word={tok.text} resolved={composeReveal(tok.reveal)} />
          </div>
        );
      })()}
    </div>
  );
}
