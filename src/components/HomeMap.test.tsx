import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeMap } from "./HomeMap";
import { getSections } from "@/content/sections";

describe("HomeMap", () => {
  it("renders the wordmark", () => {
    render(<HomeMap />);
    expect(screen.getByText("INTELLEGŌ")).toBeInTheDocument();
  });

  it("renders every section header and one node per chapter", () => {
    render(<HomeMap />);
    const sections = getSections();
    for (const s of sections) {
      expect(screen.getByText(new RegExp(s.titleLatin))).toBeInTheDocument();
    }
    const total = sections.reduce((n, s) => n + s.chapters.length, 0);
    expect(screen.getAllByRole("link").length).toBe(total);
  });

  it("links every node into the read route", () => {
    render(<HomeMap />);
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).toMatch(/^\/read\//);
    }
  });

  it("shows no English to the learner", () => {
    const { container } = render(<HomeMap />);
    const text = container.textContent ?? "";
    for (const word of ["home", "chapter", "section", "start", "continue", " the "]) {
      expect(text.toLowerCase()).not.toContain(word);
    }
  });
});
