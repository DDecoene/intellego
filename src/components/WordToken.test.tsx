import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WordToken } from "./WordToken";

describe("WordToken", () => {
  it("calls onSelect with the word text when clicked", async () => {
    const onSelect = vi.fn();
    render(<WordToken text="fornāx" selected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByText("fornāx"));
    expect(onSelect).toHaveBeenCalledWith("fornāx");
  });
  it("marks itself selected for styling", () => {
    render(<WordToken text="fornāx" selected={true} onSelect={() => {}} />);
    expect(screen.getByText("fornāx")).toHaveAttribute("data-selected", "true");
  });
});
