import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChapterNotReady } from "./ChapterNotReady";

describe("ChapterNotReady", () => {
  it("shows a Latin not-ready message and a link home", () => {
    render(<ChapterNotReady />);
    expect(screen.getByText(/nōndum parātum/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ad tabulam" })).toHaveAttribute("href", "/");
  });

  it("shows no English to the learner", () => {
    const { container } = render(<ChapterNotReady />);
    const text = container.textContent ?? "";
    for (const word of ["chapter", "ready", "soon", "coming", "back", " the "]) {
      expect(text.toLowerCase()).not.toContain(word);
    }
  });
});
