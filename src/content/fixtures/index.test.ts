import { describe, it, expect } from "vitest";
import { getChapter } from "./index";

describe("getChapter", () => {
  it("returns ch6 by id", () => {
    expect(getChapter("ch6")?.id).toBe("ch6");
  });
  it("returns null for unknown id", () => {
    expect(getChapter("nope")).toBeNull();
  });
});
