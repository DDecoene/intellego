import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionTrail } from "./SectionTrail";
import type { SectionEntry } from "@/content/sections";

const section: SectionEntry = {
  numeral: "II",
  titleLatin: "In Forō",
  chapters: [
    { id: "ch6", numeral: "VI" },
    { id: "ch7", numeral: "VII" },
  ],
};

describe("SectionTrail", () => {
  it("renders the Latin header with numeral and title", () => {
    render(<SectionTrail section={section} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("II");
    expect(heading).toHaveTextContent("In Forō");
  });

  it("renders one linked node per chapter", () => {
    render(<SectionTrail section={section} />);
    expect(screen.getByRole("link", { name: "Capitulum VI" })).toHaveAttribute("href", "/read/ch6");
    expect(screen.getByRole("link", { name: "Capitulum VII" })).toHaveAttribute("href", "/read/ch7");
  });

  it("alternates node sides starting on the left", () => {
    render(<SectionTrail section={section} />);
    expect(screen.getByRole("link", { name: "Capitulum VI" })).toHaveAttribute("data-side", "left");
    expect(screen.getByRole("link", { name: "Capitulum VII" })).toHaveAttribute("data-side", "right");
  });
});
