"use client";
import type { ResolvedReveal } from "@/reading/composeReveal";

export function RevealCard({ word, resolved }: { word: string; resolved: ResolvedReveal }) {
  const play = () => { if (resolved.audio) new Audio(resolved.audio).play(); };
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center shadow-lg">
      {resolved.picture && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolved.picture} alt={word} className="mx-auto h-20 w-20 object-contain" />
      )}
      {resolved.animation && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolved.animation} alt={word} className="mx-auto h-20 w-20 object-contain" />
      )}
      <div className="mt-1 flex items-center justify-center gap-2 text-stone-800">
        <span className="font-semibold">{word}</span>
        {resolved.audio && (
          <button aria-label="🔊" onClick={play} className="text-stone-500">🔊</button>
        )}
      </div>
      {resolved.paraphrase && (
        <p className="mt-1 italic text-stone-600">{resolved.paraphrase}</p>
      )}
    </div>
  );
}
