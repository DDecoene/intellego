import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadingScreen } from "./ReadingScreen";
import { ch6 } from "@/content/fixtures/ch6";

describe("ReadingScreen", () => {
  it("shows a loading placeholder when chapter is null", () => {
    render(<ReadingScreen chapter={null} />);
    expect(screen.getByTestId("reading-loading")).toBeInTheDocument();
  });
  it("defaults to scene-led mode and can switch to immersive", async () => {
    render(<ReadingScreen chapter={ch6} />);
    expect(screen.getByAltText("scaena")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("immersive"));
    expect(screen.queryByAltText("scaena")).not.toBeInTheDocument();
  });
});
