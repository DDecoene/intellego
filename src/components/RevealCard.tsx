"use client";
import type { ResolvedReveal } from "@/reading/composeReveal";

export function RevealCard({ word, resolved }: { word: string; resolved: ResolvedReveal }) {
  const play = () => {
    if (resolved.audio) new Audio(resolved.audio).play().catch(() => {});
  };
  return (
    <div className="animate-rise mx-auto max-w-xs rounded-3xl border border-[var(--gold)] bg-[var(--parchment)] p-5 text-center shadow-[0_12px_40px_-12px_rgba(58,47,34,0.45)]">
      {(resolved.picture || resolved.animation) && (
        <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-2xl bg-[var(--parchment-deep)] ring-1 ring-[var(--gold)]/60">
          {resolved.picture && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolved.picture} alt={word} className="h-24 w-24 object-contain" />
          )}
          {resolved.animation && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolved.animation} alt={word} className="h-24 w-24 object-contain" />
          )}
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        <span className="font-display text-2xl font-semibold text-[var(--terracotta-deep)]">
          {word}
        </span>
        {resolved.audio && (
          <button
            aria-label="🔊"
            onClick={play}
            className="rounded-full px-1 text-lg text-[var(--stone)] transition-transform hover:scale-125"
          >
            🔊
          </button>
        )}
      </div>
      {resolved.paraphrase && (
        <p className="mt-1 font-display text-lg italic text-[var(--stone)]">
          {resolved.paraphrase}
        </p>
      )}
    </div>
  );
}
