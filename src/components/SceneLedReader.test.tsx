import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SceneLedReader } from "./SceneLedReader";
import { ch6 } from "@/content/fixtures/ch6";

describe("SceneLedReader", () => {
  it("renders the scene image and the passage words", () => {
    render(<SceneLedReader chapter={ch6} />);
    expect(screen.getByAltText("scaena")).toHaveAttribute("src", ch6.scene);
    expect(screen.getByText("fornāce")).toBeInTheDocument();
  });
  it("opens a reveal when a word is tapped", async () => {
    render(<SceneLedReader chapter={ch6} />);
    await userEvent.click(screen.getByText("fornāce"));
    expect(screen.getByAltText("fornāce")).toBeInTheDocument(); // picture reveal
  });
});
