# Learner Home (Chapter Map) — Design

**Date:** 2026-06-16
**Status:** Approved

## Goal

Replace the Next.js boilerplate home page with the app's real entry point: a
Latin-only, mobile-first map of the story that lets a learner pick a chapter and
drop into the existing `/read/[chapterId]` reading screen.

This also fixes the current **no-English-on-frontend rule violation** — `src/app/page.tsx`
ships the default `create-next-app` template (English copy, Next/Vercel logos).

## Scope & decisions

- **Learner home, not marketing.** No hero/marketing page, no auth, no onboarding.
  The app opens straight onto the chapter map.
- **Stateless, all chapters open.** No progress tracking yet. Every node is
  tappable. Layout leaves room for a future "continue" affordance, but none is
  built now.
- **Scaffolded manifest.** Seed the first sections of the curriculum so the path
  renders meaningfully. `ch6` (the only authored chapter) links to real content;
  other nodes route to `/read/[id]` and hit the existing "chapter not found"
  path until authored. The manifest grows as content is written.
- **Layout: winding journey path (option B).** A single vertical trail of
  chapter nodes per section, alternating left/right, matching the single
  continuous narrative and the parchment theme of the reading screen.

## No-English rule

Nothing learner-facing is English:
- Section headers are Latin (e.g. *In Pistrīnā*, *In Forō*) + Roman numerals.
- Chapters are shown as Roman numerals.
- App chrome uses the wordmark `INTELLEGŌ` and icons, never English UI words.

A test asserts the rendered home contains no English from a small denylist
(e.g. `home`, `chapter`, `start`, `the`).

## Architecture

The home reads a static section manifest and renders nested trail components.
Pure data is isolated from React and unit-tested; components are RTL-tested.

### Files

- `src/content/sections.ts` — the manifest + `getSections()` accessor.
  - Types: `SectionEntry = { numeral: string; titleLatin: string; chapters: ChapterRef[] }`
    and `ChapterRef = { id: string; numeral: string }`.
  - `getSections(): SectionEntry[]` returns the ordered manifest.
- `src/components/ChapterNode.tsx` — one tappable circular node. Renders an
  anchor/Link to `/read/<id>` containing the chapter's Roman numeral.
- `src/components/SectionTrail.tsx` — renders one section: Latin small-caps
  header (`numeral · titleLatin`) and its chapters as a winding column of
  `ChapterNode`s (alternating offset).
- `src/components/HomeMap.tsx` — maps `getSections()` into `SectionTrail`s inside
  the parchment container.
- `src/app/page.tsx` — replaces boilerplate; renders `HomeMap`.

### Seed data (scaffold)

Sections I and II from `CURRICULUM.md`, with Latin section titles:

- **I · In Pistrīnā** — chapters I–V (ids `ch1`–`ch5`).
- **II · In Forō** — chapters VI–… including `ch6` (authored), then placeholders.

Only `ch6` resolves to real content today; the rest are valid routes that render
the existing not-found state until authored. Exact chapter count per section
follows the curriculum and can be trimmed during implementation to a sensible
scaffold size (roughly the first two sections).

## Data flow

`page.tsx` → `HomeMap` calls `getSections()` → renders a `SectionTrail` per
section → each renders `ChapterNode`s linking to `/read/<id>`. Tapping a node is
a normal client navigation into the existing reading route. No state, no fetch.

## Error / edge handling

- Unauthored chapter id → existing `/read/[chapterId]` not-found rendering
  (already handled by `getChapter` returning `null` and `ReadingScreen`).
- Empty manifest → `HomeMap` renders the container with no trails (defensive,
  but the seed is never empty).

## Testing

- `sections.test.ts` — `getSections()` returns ordered sections; each chapter has
  an `id` and `numeral`; ids are unique; `ch6` is present.
- `ChapterNode.test.tsx` — renders the numeral; links to `/read/<id>`.
- `SectionTrail.test.tsx` — renders the Latin header and one node per chapter.
- `HomeMap.test.tsx` — renders all section headers; total node count matches the
  manifest; contains no English denylist words; nodes point at `/read/...`.

## Out of scope

- Progress tracking / "continue reading" (needs persistence — later).
- Authoring the remaining chapters' content (separate effort — step "b").
- Auth, settings, profile.
