"use client";
import { useState } from "react";
import type { Chapter } from "@/content/types";
import { SceneLedReader } from "./SceneLedReader";
import { ImmersiveReader } from "./ImmersiveReader";

type Mode = "scene" | "immersive";

export function ReadingScreen({ chapter }: { chapter: Chapter | null }) {
  const [mode, setMode] = useState<Mode>("scene");

  if (!chapter) {
    return <div data-testid="reading-loading" className="min-h-[60vh] animate-pulse bg-amber-50" />;
  }

  return (
    <div>
      <div className="flex justify-end gap-2 p-2">
        <button aria-label="scene" onClick={() => setMode("scene")} className={mode === "scene" ? "opacity-100" : "opacity-40"}>📖</button>
        <button aria-label="immersive" onClick={() => setMode("immersive")} className={mode === "immersive" ? "opacity-100" : "opacity-40"}>🎬</button>
      </div>
      {mode === "scene" ? <SceneLedReader chapter={chapter} /> : <ImmersiveReader chapter={chapter} />}
    </div>
  );
}
