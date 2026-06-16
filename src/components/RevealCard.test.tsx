import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RevealCard } from "./RevealCard";

describe("RevealCard", () => {
  it("renders a picture when present", () => {
    render(<RevealCard word="fornāx" resolved={{ picture: "/f.png", audio: "/f.mp3" }} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/f.png");
  });
  it("renders the Latin paraphrase and never English", () => {
    render(<RevealCard word="in" resolved={{ paraphrase: "intus" }} />);
    expect(screen.getByText("intus")).toBeInTheDocument();
    expect(screen.queryByText(/inside|the|is/i)).not.toBeInTheDocument();
  });
  it("shows an audio control when audio is present", () => {
    render(<RevealCard word="gaius" resolved={{ audio: "/g.mp3", picture: "/g.png" }} />);
    expect(screen.getByRole("button", { name: /🔊/ })).toBeInTheDocument();
  });
});
