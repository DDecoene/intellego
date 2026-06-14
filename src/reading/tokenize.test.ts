import { describe, it, expect } from "vitest";
import { tokenizeLine } from "./tokenize";

describe("tokenizeLine", () => {
  it("splits words from spaces and punctuation and attaches reveals by lemma", () => {
    const reveals = { gaius: { picture: "g.png" } };
    const lemmaOf = (w: string) => w.toLowerCase();
    const line = tokenizeLine("Gaius est.", reveals, lemmaOf);
    expect(line.tokens.map((t) => t.text)).toEqual(["Gaius", " ", "est", "."]);
    const gaius = line.tokens[0];
    expect(gaius.kind).toBe("word");
    expect(gaius.kind === "word" && gaius.reveal).toEqual({ picture: "g.png" });
  });
  it("makes punctuation and spaces non-tappable text tokens", () => {
    const line = tokenizeLine("est.", {}, (w) => w);
    const dot = line.tokens.find((t) => t.text === ".");
    expect(dot?.kind).toBe("text");
  });
});
