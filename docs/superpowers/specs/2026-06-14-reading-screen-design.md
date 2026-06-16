# Reading Screen — Design

**Date:** 2026-06-14
**Status:** Approved (design phase)
**Scope:** The core reading screen and its word-tap reveal. Only this screen — home, vocabulary review/SRS, progress, and auth are separate specs.

## Purpose

The screen where a learner reads a Latin passage and acquires meaning through
comprehensible input. It is the defining Intellego experience and the place the
project's most important rule lives: **no English ever reaches the frontend.**
Meaning is conveyed by image, context, audio, and already-known Latin — never by
translation.

## Content source

The screen consumes pre-authored content; it does not generate it. For a given
chapter it receives, from the curriculum:

- The chapter's **Latin passage** (the reading text).
- The chapter's **cumulative vocabulary** — the set of words the learner is
  assumed to know. This drives which words are tappable and constrains what a
  Latin paraphrase reveal may use (only words already learned).
- Per-word **reveal assets**: an illustration and/or audio and/or a Latin
  paraphrase and/or a verb animation (see Word-tap reveal).

This corresponds to the existing `CURRICULUM.md` structure (per-chapter passage
+ cumulative vocabulary). Asset authoring/storage is out of scope here; this
spec assumes the assets exist and defines how the screen uses them.

## Two reading modes

The same chapter content renders in either mode; the learner can switch modes.

- **Default — Scene-led:** a scene illustration at the top, the full Latin
  passage below it. Standard reading surface. Mobile-first single column.
- **Advanced — Immersive:** a full-bleed illustrated scene with one Latin line
  overlaid at a time; tap to advance through the passage. A focus mode with less
  scaffolding for stronger readers.

Mode is a learner-controlled toggle on the screen. Default mode is Scene-led.

## Word-tap reveal (the immersion engine)

Tapping any word in the passage opens a small reveal anchored to that word. The
reveal never contains English. It composes from up to four channels:

- **Picture** — an illustration of the word's meaning. Always shown when a
  picture asset exists (concrete nouns).
- **Audio** — the word pronounced (classical), with a subtle syllable cue.
  Always available.
- **Latin paraphrase** — a short definition using only words already in the
  chapter's cumulative vocabulary. Shown when no picture can carry the meaning
  (abstract words).
- **Action animation** — a small looping animation for verbs.

Composition rule: **Picture + Audio are always present when their assets exist;
Latin paraphrase appears when there is no usable picture; animation appears for
verbs.** Every tappable word must resolve to at least one wordless meaning
channel (picture, animation, or — failing those — a Latin paraphrase that itself
uses only known words).

## UI principles (carried from project instructions)

Mobile-first, minimalist, fast, accessible, reading-focused. Latin-only on the
frontend without exception.

## States

- **Loading:** passage/asset fetch in progress — show a calm placeholder, no
  English copy.
- **Reveal open:** tapped word highlighted; reveal card anchored near it;
  tapping elsewhere or another word dismisses/replaces it.
- **Missing asset:** if a word has no picture and no animation, it must still
  have a Latin paraphrase; a tappable word with no resolvable wordless channel
  is a content error and must be caught before publish (it would force English
  or a dead tap).

## Open questions (to resolve during planning)

- Exact data contract/shape the screen receives per chapter (passage tokens,
  per-token asset references).
- Audio source (recorded vs. synthesized) — affects asset pipeline, not this
  screen's behavior.
- Whether the mode toggle persists per-learner or per-session.

## Out of scope

Content/asset generation, the SRS/vocabulary-review screen, home and navigation,
progress tracking, authentication, the AI tutor.
