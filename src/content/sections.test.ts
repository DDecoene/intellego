import { describe, it, expect } from "vitest";
import { getSections } from "./sections";

describe("getSections", () => {
  it("returns ordered sections each with a numeral and Latin title", () => {
    const sections = getSections();
    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(sections[0]).toMatchObject({ numeral: "I", titleLatin: "In Pistrīnā" });
    expect(sections[1]).toMatchObject({ numeral: "II", titleLatin: "In Forō" });
  });

  it("gives every chapter an id and a numeral", () => {
    const chapters = getSections().flatMap((s) => s.chapters);
    expect(chapters.length).toBeGreaterThan(0);
    for (const c of chapters) {
      expect(typeof c.id).toBe("string");
      expect(c.id.length).toBeGreaterThan(0);
      expect(typeof c.numeral).toBe("string");
      expect(c.numeral.length).toBeGreaterThan(0);
    }
  });

  it("has unique chapter ids and includes the authored ch6", () => {
    const ids = getSections().flatMap((s) => s.chapters.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("ch6");
  });
});
