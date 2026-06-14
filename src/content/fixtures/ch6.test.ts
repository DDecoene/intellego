import { describe, it, expect } from "vitest";
import { ch6 } from "./ch6";

describe("ch6 fixture", () => {
  it("has an id and cumulative vocab", () => {
    expect(ch6.id).toBe("ch6");
    expect(ch6.knownVocab).toContain("fornax");
  });
  it("every word token carries a reveal object", () => {
    const words = ch6.lines.flatMap((l) =>
      l.tokens.filter((t) => t.kind === "word"),
    );
    expect(words.length).toBeGreaterThan(0);
    for (const w of words) {
      expect(w.kind === "word" && typeof w.reveal === "object").toBe(true);
    }
  });
});
