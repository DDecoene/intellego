# Learner Home (Chapter Map) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Next.js boilerplate home page with a Latin-only, mobile-first chapter map (winding journey path) that routes the learner into the existing `/read/[chapterId]` reading screen.

**Architecture:** A static, scaffolded section manifest (`getSections()`) drives nested presentational components — `HomeMap` → `SectionTrail` → `ChapterNode`. Pure data is isolated and unit-tested; components are tested with React Testing Library. Chapter nodes are Next.js `Link`s to `/read/<id>`. No state, no fetch, no auth.

**Tech Stack:** Next.js 15 (App Router), TypeScript, TailwindCSS (with project CSS vars `--parchment`, `--ink`, `--terracotta`, `--gold`), Vitest, @testing-library/react.

---

## Conventions (read before every task)

- **No English in learner-facing output.** Section headers are Latin + Roman numerals; chapters are Roman numerals; chrome uses the `INTELLEGŌ` wordmark. A denylist test enforces this on the home.
- Theme via existing CSS vars: `var(--parchment)`, `var(--parchment-deep)`, `var(--ink)`, `var(--terracotta)`, `var(--terracotta-deep)`, `var(--gold)`. Headings already use the display font globally.
- All source under `src/`. Pure data under `src/content/`; React components under `src/components/`.
- Run tests with `npm test` (Vitest, non-watch). Run a single file with `npm test -- <path>`.
- Follow existing patterns: see `src/content/fixtures/index.ts` (accessor style) and `src/components/WordToken.tsx` (component + CSS-var styling).

## File Structure

- `src/content/sections.ts` — `SectionEntry` / `ChapterRef` types, the seed manifest, and `getSections()`.
- `src/components/ChapterNode.tsx` — one tappable circular node: a `Link` to `/read/<id>` showing the chapter numeral.
- `src/components/SectionTrail.tsx` — one section: Latin header + winding column of `ChapterNode`s.
- `src/components/HomeMap.tsx` — wordmark + container; maps `getSections()` into `SectionTrail`s.
- `src/app/page.tsx` — replaces the boilerplate; renders `HomeMap`.

---

### Task 1: Section manifest + accessor

**Files:**
- Create: `src/content/sections.ts`
- Test: `src/content/sections.test.ts`

- [ ] **Step 1: Write the failing test**

`src/content/sections.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getSections } from "./sections";

describe("getSections", () => {
  it("returns ordered sections each with a numeral and Latin title", () => {
    const sections = getSections();
    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(sections[0]).toMatchObject({ numeral: "I", titleLatin: "In Pistrīnā" });
    expect(sections[1]).toMatchObject({ numeral: "II", titleLatin: "In Forō" });
  });

  it("gives every chapter an id and a numeral", () => {
    const chapters = getSections().flatMap((s) => s.chapters);
    expect(chapters.length).toBeGreaterThan(0);
    for (const c of chapters) {
      expect(typeof c.id).toBe("string");
      expect(c.id.length).toBeGreaterThan(0);
      expect(typeof c.numeral).toBe("string");
      expect(c.numeral.length).toBeGreaterThan(0);
    }
  });

  it("has unique chapter ids and includes the authored ch6", () => {
    const ids = getSections().flatMap((s) => s.chapters.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("ch6");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/content/sections.test.ts`
Expected: FAIL — cannot find module `./sections`.

- [ ] **Step 3: Implement the manifest**

`src/content/sections.ts`:
```ts
export type ChapterRef = {
  id: string;      // routes to /read/<id>
  numeral: string; // Roman numeral shown on the node
};

export type SectionEntry = {
  numeral: string;    // Roman numeral of the section
  titleLatin: string; // Latin-only section title
  chapters: ChapterRef[];
};

// Scaffolded seed. Sections I–II of the curriculum. Only ch6 is authored today;
// the other ids are valid routes that render the existing not-found state until
// their content is written. Grow this manifest as chapters are authored.
const sections: SectionEntry[] = [
  {
    numeral: "I",
    titleLatin: "In Pistrīnā",
    chapters: [
      { id: "ch1", numeral: "I" },
      { id: "ch2", numeral: "II" },
      { id: "ch3", numeral: "III" },
      { id: "ch4", numeral: "IV" },
      { id: "ch5", numeral: "V" },
    ],
  },
  {
    numeral: "II",
    titleLatin: "In Forō",
    chapters: [
      { id: "ch6", numeral: "VI" },
      { id: "ch7", numeral: "VII" },
      { id: "ch8", numeral: "VIII" },
    ],
  },
];

export function getSections(): SectionEntry[] {
  return sections;
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/content/sections.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/sections.ts src/content/sections.test.ts
git commit -m "Add scaffolded section manifest for learner home"
```

---

### Task 2: ChapterNode component

**Files:**
- Create: `src/components/ChapterNode.tsx`
- Test: `src/components/ChapterNode.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/ChapterNode.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/ChapterNode.test.tsx`
Expected: FAIL — cannot find module `./ChapterNode`.

- [ ] **Step 3: Implement**

`src/components/ChapterNode.tsx`:
```tsx
import Link from "next/link";

export function ChapterNode({
  id,
  numeral,
  side,
}: {
  id: string;
  numeral: string;
  side: "left" | "right";
}) {
  return (
    <Link
      href={`/read/${id}`}
      data-side={side}
      aria-label={numeral}
      className={
        "flex h-14 w-14 items-center justify-center rounded-full " +
        "border-[3px] border-[var(--gold)] bg-[var(--parchment-deep)] " +
        "text-xl text-[var(--terracotta-deep)] shadow-sm transition-all duration-200 " +
        "hover:bg-[var(--terracotta)] hover:text-[var(--parchment)] " +
        (side === "right" ? "self-end" : "self-start")
      }
    >
      {numeral}
    </Link>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/components/ChapterNode.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ChapterNode.tsx src/components/ChapterNode.test.tsx
git commit -m "Add ChapterNode component"
```

---

### Task 3: SectionTrail component

**Files:**
- Create: `src/components/SectionTrail.tsx`
- Test: `src/components/SectionTrail.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/SectionTrail.test.tsx`:
```tsx
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
    expect(screen.getByText(/In Forō/)).toBeInTheDocument();
    expect(screen.getByText(/II/)).toBeInTheDocument();
  });

  it("renders one linked node per chapter", () => {
    render(<SectionTrail section={section} />);
    expect(screen.getByRole("link", { name: "VI" })).toHaveAttribute("href", "/read/ch6");
    expect(screen.getByRole("link", { name: "VII" })).toHaveAttribute("href", "/read/ch7");
  });

  it("alternates node sides starting on the left", () => {
    render(<SectionTrail section={section} />);
    expect(screen.getByRole("link", { name: "VI" })).toHaveAttribute("data-side", "left");
    expect(screen.getByRole("link", { name: "VII" })).toHaveAttribute("data-side", "right");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/SectionTrail.test.tsx`
Expected: FAIL — cannot find module `./SectionTrail`.

- [ ] **Step 3: Implement**

`src/components/SectionTrail.tsx`:
```tsx
import type { SectionEntry } from "@/content/sections";
import { ChapterNode } from "./ChapterNode";

export function SectionTrail({ section }: { section: SectionEntry }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 border-b border-[var(--gold)] pb-1 text-sm uppercase tracking-wide text-[var(--terracotta-deep)] [font-variant:small-caps]">
        {section.numeral} · {section.titleLatin}
      </h2>
      <div className="flex flex-col gap-5">
        {section.chapters.map((chapter, i) => (
          <ChapterNode
            key={chapter.id}
            id={chapter.id}
            numeral={chapter.numeral}
            side={i % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/components/SectionTrail.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionTrail.tsx src/components/SectionTrail.test.tsx
git commit -m "Add SectionTrail component"
```

---

### Task 4: HomeMap component

**Files:**
- Create: `src/components/HomeMap.tsx`
- Test: `src/components/HomeMap.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/HomeMap.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- src/components/HomeMap.test.tsx`
Expected: FAIL — cannot find module `./HomeMap`.

- [ ] **Step 3: Implement**

`src/components/HomeMap.tsx`:
```tsx
import { getSections } from "@/content/sections";
import { SectionTrail } from "./SectionTrail";

export function HomeMap() {
  const sections = getSections();
  return (
    <main className="mx-auto min-h-screen max-w-md bg-[var(--parchment)] px-6 py-8">
      <h1 className="mb-8 text-center text-3xl tracking-[0.3em] text-[var(--terracotta-deep)]">
        INTELLEGŌ
      </h1>
      {sections.map((section) => (
        <SectionTrail key={section.numeral} section={section} />
      ))}
    </main>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- src/components/HomeMap.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/HomeMap.tsx src/components/HomeMap.test.tsx
git commit -m "Add HomeMap component"
```

---

### Task 5: Replace the boilerplate home page

**Files:**
- Modify (overwrite): `src/app/page.tsx`

- [ ] **Step 1: Replace the page**

Overwrite `src/app/page.tsx` entirely with:
```tsx
import { HomeMap } from "@/components/HomeMap";

export default function Home() {
  return <HomeMap />;
}
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all tests pass (existing 22 + the new home tests).

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds; `/` and `/read/[chapterId]` both listed as routes.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "Replace boilerplate home with learner chapter map"
```

---

### Task 6: Manual verification

**Files:** none (verification only)

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`, then open `http://localhost:3000/`.
Expected: the parchment chapter map renders with the `INTELLEGŌ` wordmark, Latin section headers (*I · In Pistrīnā*, *II · In Forō*), and winding chapter nodes. No English appears anywhere.

- [ ] **Step 2: Verify navigation**

Tap node `VI`. Expected: navigates to `/read/ch6` and the authored chapter renders. Tap an unauthored node (e.g. `I` → `/read/ch1`). Expected: the existing not-found state renders (no crash).

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "Learner home verification fixes" --allow-empty
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** Winding path layout (B) — `SectionTrail` alternating sides (Task 3) ✓. Latin-only headers + Roman numerals + `INTELLEGŌ` wordmark + no-English denylist test (Task 4) ✓. Stateless/all-open — nodes are plain `Link`s, no progress state (Tasks 2–4) ✓. Scaffolded manifest seeding sections I–II with `ch6` authored and others routing to not-found (Task 1) ✓. Replace boilerplate `page.tsx`, fixing the rule violation (Task 5) ✓. Small testable components matching spec file list ✓. Edge cases (unauthored id → existing not-found) verified (Task 6) ✓.
- **Placeholder scan:** Every code step contains complete code; no TBD/TODO. Exact paths and commands throughout.
- **Type consistency:** `SectionEntry`/`ChapterRef` defined in Task 1 are imported and used identically in Tasks 3–4; `ChapterNode` prop shape (`id`, `numeral`, `side`) defined in Task 2 is consumed unchanged in Task 3; `getSections()` returns `SectionEntry[]` consumed by Tasks 3 (via prop) and 4.
- **Open items:** Chapter count per section is the chosen scaffold (5 + 3); curriculum may carry more, deliberately deferred to content-authoring (step b). `next/link` and `next/navigation` need no test mock here — RTL renders `Link` as a plain anchor with `href`, which the tests assert.
```
