import { describe, it, expect } from "vitest";
import { findUnresolvedWords } from "./validateChapter";
import { ch6 } from "./fixtures/ch6";
import type { Chapter } from "./types";

describe("findUnresolvedWords", () => {
  it("passes the real Ch.6 fixture", () => {
    expect(findUnresolvedWords(ch6)).toEqual([]);
  });
  it("flags a word that has only audio (no meaning channel)", () => {
    const bad: Chapter = {
      id: "x", scene: "s.png", knownVocab: [],
      lines: [{ tokens: [{ kind: "word", text: "ignotum", lemma: "ignotus", reveal: { audio: "a.mp3" } }] }],
    };
    expect(findUnresolvedWords(bad)).toEqual(["ignotum"]);
  });
});
