import { describe, it, expect } from "vitest";
import { composeReveal } from "./composeReveal";

describe("composeReveal", () => {
  it("keeps picture and audio when both present", () => {
    const r = composeReveal({ picture: "p.png", audio: "a.mp3" });
    expect(r).toEqual({ picture: "p.png", audio: "a.mp3" });
  });
  it("shows paraphrase only when there is no picture", () => {
    expect(composeReveal({ paraphrase: "intus" })).toEqual({ paraphrase: "intus" });
    expect(composeReveal({ picture: "p.png", paraphrase: "intus" })).toEqual({ picture: "p.png" });
  });
  it("includes animation for verbs", () => {
    const r = composeReveal({ animation: "v.gif", audio: "a.mp3" });
    expect(r).toEqual({ animation: "v.gif", audio: "a.mp3" });
  });
});
