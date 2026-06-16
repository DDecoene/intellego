"use client";
import { useState } from "react";
import type { Chapter } from "@/content/types";
import { SceneLedReader } from "./SceneLedReader";
import { ImmersiveReader } from "./ImmersiveReader";

type Mode = "scene" | "immersive";

export function ReadingScreen({ chapter }: { chapter: Chapter | null }) {
  const [mode, setMode] = useState<Mode>("scene");

  if (!chapter) {
    return (
      <div
        data-testid="reading-loading"
        className="mx-auto mt-10 min-h-[60vh] w-full max-w-md animate-pulse rounded-[1.75rem] bg-[var(--parchment-deep)]"
      />
    );
  }

  const toggle = (m: Mode, label: string, glyph: string) => (
    <button
      aria-label={label}
      onClick={() => setMode(m)}
      className={
        "flex h-9 w-9 items-center justify-center rounded-full text-lg transition-all " +
        (mode === m
          ? "bg-[var(--terracotta)]/15 ring-1 ring-[var(--terracotta)]/40 opacity-100"
          : "opacity-40 hover:opacity-70")
      }
    >
      {glyph}
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <span className="font-display text-xl tracking-[0.25em] text-[var(--terracotta-deep)] uppercase">
          Intellego
        </span>
        <div className="flex gap-1.5">
          {toggle("scene", "scene", "📖")}
          {toggle("immersive", "immersive", "🎬")}
        </div>
      </header>
      {mode === "scene" ? <SceneLedReader chapter={chapter} /> : <ImmersiveReader chapter={chapter} />}
    </div>
  );
}
