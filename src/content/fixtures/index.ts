import type { Chapter } from "@/content/types";
import { ch6 } from "./ch6";

const chapters: Record<string, Chapter> = { ch6 };

export function getChapter(id: string): Chapter | null {
  return chapters[id] ?? null;
}
