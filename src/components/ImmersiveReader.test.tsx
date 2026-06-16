import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImmersiveReader } from "./ImmersiveReader";
import type { Chapter } from "@/content/types";

const twoLines: Chapter = {
  id: "t", scene: "/s.png", knownVocab: [],
  lines: [
    { tokens: [{ kind: "word", text: "Prima", lemma: "primus", reveal: { picture: "/p.png" } }] },
    { tokens: [{ kind: "word", text: "Secunda", lemma: "secundus", reveal: { picture: "/s2.png" } }] },
  ],
};

describe("ImmersiveReader", () => {
  it("shows one line at a time and advances on tap", async () => {
    render(<ImmersiveReader chapter={twoLines} />);
    expect(screen.getByText("Prima")).toBeInTheDocument();
    expect(screen.queryByText("Secunda")).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("→"));
    expect(screen.getByText("Secunda")).toBeInTheDocument();
  });
});
