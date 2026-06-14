# Reading Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the core Latin reading screen — a scene-led default mode and an immersive advanced mode, with a Latin-only word-tap reveal — on a fresh Next.js app.

**Architecture:** Next.js (App Router) + TypeScript + TailwindCSS. The screen consumes a typed, pre-authored `Chapter` content object (passage tokens + per-word reveal assets + cumulative vocabulary). Pure logic (tokenizing, reveal composition, content validation) is isolated from React components and unit-tested; components are tested with React Testing Library. The most important rule — **no English on the frontend** — is enforced both by design (reveals never carry English) and by a content validator that fails any tappable word lacking a wordless meaning channel.

**Tech Stack:** Next.js 15, TypeScript, TailwindCSS, Vitest, @testing-library/react, jsdom.

---

## Conventions (read before every task)

- **No English in learner-facing output.** Reveals carry only picture/audio/animation assets or a Latin paraphrase built from already-known words. UI chrome uses icons, not English words, where it faces the learner.
- All source under `src/`. Pure logic under `src/reading/` and `src/content/`; React components under `src/components/`.
- Run tests with `npm test` (Vitest, non-watch). Run a single file with `npm test -- <path>`.

## File Structure

- `src/content/types.ts` — the `Chapter` / `Line` / `Token` / `WordReveal` data contract.
- `src/content/fixtures/ch6.ts` — a real sample chapter (from `CURRICULUM.md` Ch. 6) for tests and dev.
- `src/content/validateChapter.ts` — `findUnresolvedWords` content guard.
- `src/reading/tokenize.ts` — `tokenizeLine` splits a Latin string into word/text tokens, attaching reveals.
- `src/reading/composeReveal.ts` — `composeReveal` picks which reveal channels to show.
- `src/components/RevealCard.tsx` — renders a composed reveal (image/audio/animation/paraphrase).
- `src/components/WordToken.tsx` — one tappable word.
- `src/components/SceneLedReader.tsx` — default mode.
- `src/components/ImmersiveReader.tsx` — advanced mode.
- `src/components/ReadingScreen.tsx` — mode toggle + loading state + container.
- `src/app/read/[chapterId]/page.tsx` — route that loads a chapter and renders `ReadingScreen`.

---

### Task 1: Scaffold the app and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `vitest.setup.ts`, Next.js scaffold, Tailwind config.

- [ ] **Step 1: Scaffold Next.js (TypeScript + Tailwind, App Router)**

Run from the repo root (it already contains the markdown docs — scaffold in place):
```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-npm --yes
```
Expected: creates `package.json`, `src/app/`, `tailwind.config.ts`, etc. If it refuses due to existing files, allow it to keep the existing `*.md` files (they don't conflict).

- [ ] **Step 2: Add Vitest + RTL**

Run:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Add the test script to `package.json`**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run"
```

- [ ] **Step 6: Add a smoke test**

Create `src/reading/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("harness", () => {
  it("runs", () => { expect(1 + 1).toBe(2); });
});
```

- [ ] **Step 7: Run tests**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "Scaffold Next.js app with Vitest + RTL harness"
```

---

### Task 2: Content data contract + sample chapter

**Files:**
- Create: `src/content/types.ts`, `src/content/fixtures/ch6.ts`
- Test: `src/content/fixtures/ch6.test.ts`

- [ ] **Step 1: Write the failing test**

`src/content/fixtures/ch6.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { ch6 } from "./ch6";

describe("ch6 fixture", () => {
  it("has an id and cumulative vocab", () => {
    expect(ch6.id).toBe("ch6");
    expect(ch6.knownVocab).toContain("fornax");
  });
  it("every word token carries a reveal object", () => {
    const words = ch6.lines.flatMap((l) =>
      l.tokens.filter((t) => t.kind === "word"),
    );
    expect(words.length).toBeGreaterThan(0);
    for (const w of words) {
      expect(w.kind === "word" && typeof w.reveal === "object").toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/content/fixtures/ch6.test.ts`
Expected: FAIL — cannot find module `./ch6`.

- [ ] **Step 3: Create the types**

`src/content/types.ts`:
```ts
export type WordReveal = {
  picture?: string;     // image asset path
  audio?: string;       // audio asset path (pronunciation)
  animation?: string;   // looping animation asset path (verbs)
  paraphrase?: string;  // Latin-only definition using already-known words
};

export type Token =
  | { kind: "word"; text: string; lemma: string; isVerb?: boolean; reveal: WordReveal }
  | { kind: "text"; text: string }; // spaces/punctuation; not tappable

export type Line = { tokens: Token[] };

export type Chapter = {
  id: string;
  lines: Line[];
  knownVocab: string[]; // cumulative vocabulary, as lemmas
  scene: string;        // scene illustration asset path
};
```

- [ ] **Step 4: Create the fixture (real Ch. 6 content)**

`src/content/fixtures/ch6.ts`:
```ts
import type { Chapter, Token } from "@/content/types";

const word = (
  text: string,
  lemma: string,
  reveal: Token extends { kind: "word" } ? never : never | object,
  isVerb = false,
): Token => ({ kind: "word", text, lemma, isVerb, reveal });

const sp: Token = { kind: "text", text: " " };
const dot: Token = { kind: "text", text: "." };

export const ch6: Chapter = {
  id: "ch6",
  scene: "/assets/scenes/ch6.png",
  knownVocab: [
    "gaius", "panis", "in", "fornax", "coquit", "calida", "est", "hic",
    "farina", "bona",
  ],
  lines: [
    {
      tokens: [
        { kind: "word", text: "Gaius", lemma: "gaius", reveal: { picture: "/assets/words/gaius.png", audio: "/assets/audio/gaius.mp3" } },
        sp,
        { kind: "word", text: "pānem", lemma: "panis", reveal: { picture: "/assets/words/panis.png", audio: "/assets/audio/panis.mp3" } },
        sp,
        { kind: "word", text: "in", lemma: "in", reveal: { paraphrase: "intus", audio: "/assets/audio/in.mp3" } },
        sp,
        { kind: "word", text: "fornāce", lemma: "fornax", reveal: { picture: "/assets/words/fornax.png", audio: "/assets/audio/fornax.mp3" } },
        sp,
        { kind: "word", text: "coquit", lemma: "coquit", isVerb: true, reveal: { animation: "/assets/words/coquit.gif", audio: "/assets/audio/coquit.mp3" } },
        dot,
      ],
    },
  ],
};
```
(Note: the `word` helper above is illustrative; the fixture is written out explicitly. Remove the unused `word`/`sp`-only helpers if your linter complains — keep `sp` and `dot`.)

- [ ] **Step 5: Run the test**

Run: `npm test -- src/content/fixtures/ch6.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content && git commit -m "Add Chapter content contract and Ch.6 fixture"
```

---

### Task 3: Reveal composition logic

**Files:**
- Create: `src/reading/composeReveal.ts`
- Test: `src/reading/composeReveal.test.ts`

- [ ] **Step 1: Write the failing test**

`src/reading/composeReveal.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { composeReveal } from "./composeReveal";

describe("composeReveal", () => {
  it("keeps picture and audio when both present", () => {
    const r = composeReveal({ picture: "p.png", audio: "a.mp3" });
    expect(r).toEqual({ picture: "p.png", audio: "a.mp3" });
  });
  it("shows paraphrase only when there is no picture", () => {
    expect(composeReveal({ paraphrase: "intus" })).toEqual({ paraphrase: "intus" });
    expect(composeReveal({ picture: "p.png", paraphrase: "intus" })).toEqual({ picture: "p.png" });
  });
  it("includes animation for verbs", () => {
    const r = composeReveal({ animation: "v.gif", audio: "a.mp3" });
    expect(r).toEqual({ animation: "v.gif", audio: "a.mp3" });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/reading/composeReveal.test.ts`
Expected: FAIL — cannot find module `./composeReveal`.

- [ ] **Step 3: Implement**

`src/reading/composeReveal.ts`:
```ts
import type { WordReveal } from "@/content/types";

export type ResolvedReveal = {
  picture?: string;
  audio?: string;
  animation?: string;
  paraphrase?: string;
};

// Picture + audio + animation always show when present.
// Paraphrase shows only when there is no picture (picture carries meaning better).
export function composeReveal(reveal: WordReveal): ResolvedReveal {
  const r: ResolvedReveal = {};
  if (reveal.picture) r.picture = reveal.picture;
  if (reveal.audio) r.audio = reveal.audio;
  if (reveal.animation) r.animation = reveal.animation;
  if (!reveal.picture && reveal.paraphrase) r.paraphrase = reveal.paraphrase;
  return r;
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/reading/composeReveal.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/reading/composeReveal.ts src/reading/composeReveal.test.ts && git commit -m "Add reveal composition logic"
```

---

### Task 4: Content guard — no word without a wordless channel

**Files:**
- Create: `src/content/validateChapter.ts`
- Test: `src/content/validateChapter.test.ts`

- [ ] **Step 1: Write the failing test**

`src/content/validateChapter.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { findUnresolvedWords } from "./validateChapter";
import { ch6 } from "./fixtures/ch6";
import type { Chapter } from "./types";

describe("findUnresolvedWords", () => {
  it("passes the real Ch.6 fixture", () => {
    expect(findUnresolvedWords(ch6)).toEqual([]);
  });
  it("flags a word that has only audio (no meaning channel)", () => {
    const bad: Chapter = {
      id: "x", scene: "s.png", knownVocab: [],
      lines: [{ tokens: [{ kind: "word", text: "ignotum", lemma: "ignotus", reveal: { audio: "a.mp3" } }] }],
    };
    expect(findUnresolvedWords(bad)).toEqual(["ignotum"]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/content/validateChapter.test.ts`
Expected: FAIL — cannot find module `./validateChapter`.

- [ ] **Step 3: Implement**

`src/content/validateChapter.ts`:
```ts
import type { Chapter } from "@/content/types";

// A tappable word MUST resolve to a wordless meaning channel:
// picture, animation, or a Latin paraphrase. Audio alone is pronunciation,
// not meaning. Any word failing this would force English or a dead tap.
export function findUnresolvedWords(chapter: Chapter): string[] {
  const bad: string[] = [];
  for (const line of chapter.lines) {
    for (const t of line.tokens) {
      if (t.kind !== "word") continue;
      const { picture, animation, paraphrase } = t.reveal;
      if (!picture && !animation && !paraphrase) bad.push(t.text);
    }
  }
  return bad;
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/content/validateChapter.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/validateChapter.ts src/content/validateChapter.test.ts && git commit -m "Add content guard for unresolved words"
```

---

### Task 5: Tokenizer

**Files:**
- Create: `src/reading/tokenize.ts`
- Test: `src/reading/tokenize.test.ts`

- [ ] **Step 1: Write the failing test**

`src/reading/tokenize.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { tokenizeLine } from "./tokenize";

describe("tokenizeLine", () => {
  it("splits words from spaces and punctuation and attaches reveals by lemma", () => {
    const reveals = { gaius: { picture: "g.png" } };
    const lemmaOf = (w: string) => w.toLowerCase();
    const line = tokenizeLine("Gaius est.", reveals, lemmaOf);
    expect(line.tokens.map((t) => t.text)).toEqual(["Gaius", " ", "est", "."]);
    const gaius = line.tokens[0];
    expect(gaius.kind).toBe("word");
    expect(gaius.kind === "word" && gaius.reveal).toEqual({ picture: "g.png" });
  });
  it("makes punctuation and spaces non-tappable text tokens", () => {
    const line = tokenizeLine("est.", {}, (w) => w);
    const dot = line.tokens.find((t) => t.text === ".");
    expect(dot?.kind).toBe("text");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/reading/tokenize.test.ts`
Expected: FAIL — cannot find module `./tokenize`.

- [ ] **Step 3: Implement**

`src/reading/tokenize.ts`:
```ts
import type { Line, Token, WordReveal } from "@/content/types";

// Splits a Latin line into word tokens and non-word (space/punct) tokens.
// Word characters include Latin letters with macrons.
const WORD_RE = /[A-Za-zĀāĒēĪīŌōŪūȳ]+/gu;

export function tokenizeLine(
  text: string,
  reveals: Record<string, WordReveal>,
  lemmaOf: (word: string) => string,
): Line {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of text.matchAll(WORD_RE)) {
    const start = m.index ?? 0;
    if (start > last) tokens.push({ kind: "text", text: text.slice(last, start) });
    const w = m[0];
    const lemma = lemmaOf(w);
    tokens.push({ kind: "word", text: w, lemma, reveal: reveals[lemma] ?? {} });
    last = start + w.length;
  }
  if (last < text.length) tokens.push({ kind: "text", text: text.slice(last) });
  return { tokens };
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/reading/tokenize.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/reading/tokenize.ts src/reading/tokenize.test.ts && git commit -m "Add Latin line tokenizer"
```

---

### Task 6: RevealCard component

**Files:**
- Create: `src/components/RevealCard.tsx`
- Test: `src/components/RevealCard.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/RevealCard.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/RevealCard.test.tsx`
Expected: FAIL — cannot find module `./RevealCard`.

- [ ] **Step 3: Implement**

`src/components/RevealCard.tsx`:
```tsx
"use client";
import type { ResolvedReveal } from "@/reading/composeReveal";

export function RevealCard({ word, resolved }: { word: string; resolved: ResolvedReveal }) {
  const play = () => { if (resolved.audio) new Audio(resolved.audio).play(); };
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center shadow-lg">
      {resolved.picture && (
        <img src={resolved.picture} alt={word} className="mx-auto h-20 w-20 object-contain" />
      )}
      {resolved.animation && (
        <img src={resolved.animation} alt={word} className="mx-auto h-20 w-20 object-contain" />
      )}
      <div className="mt-1 flex items-center justify-center gap-2 text-stone-800">
        <span className="font-semibold">{word}</span>
        {resolved.audio && (
          <button aria-label="🔊" onClick={play} className="text-stone-500">🔊</button>
        )}
      </div>
      {resolved.paraphrase && (
        <p className="mt-1 italic text-stone-600">{resolved.paraphrase}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/components/RevealCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/RevealCard.tsx src/components/RevealCard.test.tsx && git commit -m "Add RevealCard component"
```

---

### Task 7: WordToken component

**Files:**
- Create: `src/components/WordToken.tsx`
- Test: `src/components/WordToken.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/WordToken.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/WordToken.test.tsx`
Expected: FAIL — cannot find module `./WordToken`.

- [ ] **Step 3: Implement**

`src/components/WordToken.tsx`:
```tsx
"use client";

export function WordToken({
  text, selected, onSelect,
}: { text: string; selected: boolean; onSelect: (text: string) => void }) {
  return (
    <button
      type="button"
      data-selected={selected}
      onClick={() => onSelect(text)}
      className={
        "rounded px-0.5 transition-colors " +
        (selected ? "bg-amber-700 text-amber-50" : "hover:bg-amber-100")
      }
    >
      {text}
    </button>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/components/WordToken.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/WordToken.tsx src/components/WordToken.test.tsx && git commit -m "Add WordToken component"
```

---

### Task 8: SceneLedReader (default mode)

**Files:**
- Create: `src/components/SceneLedReader.tsx`
- Test: `src/components/SceneLedReader.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/SceneLedReader.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/SceneLedReader.test.tsx`
Expected: FAIL — cannot find module `./SceneLedReader`.

- [ ] **Step 3: Implement**

`src/components/SceneLedReader.tsx`:
```tsx
"use client";
import { useState } from "react";
import type { Chapter } from "@/content/types";
import { composeReveal } from "@/reading/composeReveal";
import { WordToken } from "./WordToken";
import { RevealCard } from "./RevealCard";

export function SceneLedReader({ chapter }: { chapter: Chapter }) {
  const [selected, setSelected] = useState<{ key: string; text: string } | null>(null);

  return (
    <div className="mx-auto max-w-md p-4">
      <img src={chapter.scene} alt="scaena" className="mb-4 w-full rounded-2xl object-cover" />
      <div className="text-lg leading-relaxed text-stone-800">
        {chapter.lines.map((line, li) => (
          <p key={li}>
            {line.tokens.map((t, ti) => {
              const key = `${li}:${ti}`;
              if (t.kind !== "word") return <span key={key}>{t.text}</span>;
              return (
                <WordToken
                  key={key}
                  text={t.text}
                  selected={selected?.key === key}
                  onSelect={() => setSelected({ key, text: t.text })}
                />
              );
            })}
          </p>
        ))}
      </div>
      {selected && (() => {
        const [li, ti] = selected.key.split(":").map(Number);
        const tok = chapter.lines[li].tokens[ti];
        if (tok.kind !== "word") return null;
        return (
          <div className="mt-4">
            <RevealCard word={tok.text} resolved={composeReveal(tok.reveal)} />
          </div>
        );
      })()}
    </div>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/components/SceneLedReader.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SceneLedReader.tsx src/components/SceneLedReader.test.tsx && git commit -m "Add SceneLedReader (default mode)"
```

---

### Task 9: ImmersiveReader (advanced mode)

**Files:**
- Create: `src/components/ImmersiveReader.tsx`
- Test: `src/components/ImmersiveReader.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/ImmersiveReader.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/ImmersiveReader.test.tsx`
Expected: FAIL — cannot find module `./ImmersiveReader`.

- [ ] **Step 3: Implement**

`src/components/ImmersiveReader.tsx`:
```tsx
"use client";
import { useState } from "react";
import type { Chapter } from "@/content/types";
import { composeReveal } from "@/reading/composeReveal";
import { WordToken } from "./WordToken";
import { RevealCard } from "./RevealCard";

export function ImmersiveReader({ chapter }: { chapter: Chapter }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [selectedTi, setSelectedTi] = useState<number | null>(null);
  const line = chapter.lines[lineIdx];
  const atEnd = lineIdx >= chapter.lines.length - 1;

  return (
    <div
      className="relative flex min-h-[80vh] flex-col justify-end bg-cover p-6 text-amber-50"
      style={{ backgroundImage: `url(${chapter.scene})` }}
    >
      <p className="text-2xl drop-shadow-lg">
        {line.tokens.map((t, ti) => {
          if (t.kind !== "word") return <span key={ti}>{t.text}</span>;
          return (
            <WordToken key={ti} text={t.text} selected={selectedTi === ti} onSelect={() => setSelectedTi(ti)} />
          );
        })}
      </p>
      {selectedTi !== null && line.tokens[selectedTi].kind === "word" && (
        <div className="mt-4">
          <RevealCard
            word={(line.tokens[selectedTi] as { text: string }).text}
            resolved={composeReveal((line.tokens[selectedTi] as { reveal: import("@/content/types").WordReveal }).reveal)}
          />
        </div>
      )}
      {!atEnd && (
        <button
          aria-label="→"
          onClick={() => { setLineIdx((i) => i + 1); setSelectedTi(null); }}
          className="mt-6 self-end rounded-full bg-amber-50/20 px-5 py-2 text-2xl"
        >→</button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/components/ImmersiveReader.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ImmersiveReader.tsx src/components/ImmersiveReader.test.tsx && git commit -m "Add ImmersiveReader (advanced mode)"
```

---

### Task 10: ReadingScreen (mode toggle + loading)

**Files:**
- Create: `src/components/ReadingScreen.tsx`
- Test: `src/components/ReadingScreen.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/ReadingScreen.test.tsx`:
```tsx
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
    expect(screen.getByAltText("scaena")).toBeInTheDocument(); // scene-led shows <img alt=scaena>
    await userEvent.click(screen.getByLabelText("immersive"));
    expect(screen.queryByAltText("scaena")).not.toBeInTheDocument(); // immersive uses bg image, no <img>
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/ReadingScreen.test.tsx`
Expected: FAIL — cannot find module `./ReadingScreen`.

- [ ] **Step 3: Implement**

`src/components/ReadingScreen.tsx`:
```tsx
"use client";
import { useState } from "react";
import type { Chapter } from "@/content/types";
import { SceneLedReader } from "./SceneLedReader";
import { ImmersiveReader } from "./ImmersiveReader";

type Mode = "scene" | "immersive";

export function ReadingScreen({ chapter }: { chapter: Chapter | null }) {
  const [mode, setMode] = useState<Mode>("scene");

  if (!chapter) {
    return <div data-testid="reading-loading" className="min-h-[60vh] animate-pulse bg-amber-50" />;
  }

  return (
    <div>
      <div className="flex justify-end gap-2 p-2">
        <button aria-label="scene" onClick={() => setMode("scene")} className={mode === "scene" ? "opacity-100" : "opacity-40"}>📖</button>
        <button aria-label="immersive" onClick={() => setMode("immersive")} className={mode === "immersive" ? "opacity-100" : "opacity-40"}>🎬</button>
      </div>
      {mode === "scene" ? <SceneLedReader chapter={chapter} /> : <ImmersiveReader chapter={chapter} />}
    </div>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/components/ReadingScreen.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ReadingScreen.tsx src/components/ReadingScreen.test.tsx && git commit -m "Add ReadingScreen with mode toggle and loading state"
```

---

### Task 11: Route wiring

**Files:**
- Create: `src/app/read/[chapterId]/page.tsx`
- Modify: `src/content/fixtures/index.ts` (create) — chapter lookup by id.

- [ ] **Step 1: Write the failing test**

Create `src/content/fixtures/index.test.ts`:
```ts
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/content/fixtures/index.test.ts`
Expected: FAIL — cannot find module `./index`.

- [ ] **Step 3: Implement the lookup**

`src/content/fixtures/index.ts`:
```ts
import type { Chapter } from "@/content/types";
import { ch6 } from "./ch6";

const chapters: Record<string, Chapter> = { ch6 };

export function getChapter(id: string): Chapter | null {
  return chapters[id] ?? null;
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/content/fixtures/index.test.ts`
Expected: PASS.

- [ ] **Step 5: Add the route page**

`src/app/read/[chapterId]/page.tsx`:
```tsx
import { getChapter } from "@/content/fixtures";
import { ReadingScreen } from "@/components/ReadingScreen";

export default async function ReadPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  return <ReadingScreen chapter={chapter} />;
}
```

- [ ] **Step 6: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with the `/read/[chapterId]` route listed.

- [ ] **Step 7: Commit**

```bash
git add src/content/fixtures/index.ts src/content/fixtures/index.test.ts src/app/read && git commit -m "Wire /read/[chapterId] route to ReadingScreen"
```

---

### Task 12: Full suite + manual verification

**Files:** none (verification only)

- [ ] **Step 1: Run the whole test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Run the dev server and view the screen**

Run: `npm run dev`, then open `http://localhost:3000/read/ch6`.
Expected: scene-led mode shows the Ch.6 passage; tapping `fornāce` opens a picture reveal; the 🎬 toggle switches to immersive mode; no English appears anywhere on screen.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "Reading screen verification fixes" --allow-empty
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** Two modes — SceneLedReader (Task 8) + ImmersiveReader (Task 9), toggle in ReadingScreen (Task 10) ✓. Word-tap reveal composition (picture+audio always, paraphrase when no picture, animation for verbs) — `composeReveal` (Task 3) + RevealCard (Task 6) ✓. Content source contract (Task 2) ✓. No-English guard — `findUnresolvedWords` (Task 4) + RevealCard test asserts no English (Task 6) ✓. Loading state (Task 10) ✓. Mobile-first/minimalist via Tailwind ✓. Route/content load (Task 11) ✓.
- **Placeholder scan:** Every code step contains full code. The `word` helper in the Ch.6 fixture is noted as illustrative and the fixture is written out explicitly; no other TBDs.
- **Type consistency:** `Chapter`/`Line`/`Token`/`WordReveal` (Task 2) used identically in Tasks 3–11; `ResolvedReveal` from `composeReveal` (Task 3) consumed by RevealCard (Task 6) and both readers (Tasks 8–9); `getChapter` (Task 11) returns `Chapter | null` matching `ReadingScreen`'s prop (Task 10).
- **Open spec questions** (data contract specifics, audio source, toggle persistence) are deliberately deferred and do not block this screen; defaults chosen: in-memory fixture lookup, asset paths as strings, mode state per-session.
```
