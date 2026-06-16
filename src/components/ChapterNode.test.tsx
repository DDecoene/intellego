import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChapterNode } from "./ChapterNode";

describe("ChapterNode", () => {
  it("renders the numeral inside a link to the read route", () => {
    render(<ChapterNode id="ch6" numeral="VI" side="left" />);
    const link = screen.getByRole("link", { name: "VI" });
    expect(link).toHaveAttribute("href", "/read/ch6");
  });

  it("exposes its side for offset styling", () => {
    render(<ChapterNode id="ch6" numeral="VI" side="right" />);
    expect(screen.getByRole("link", { name: "VI" })).toHaveAttribute("data-side", "right");
  });
});
