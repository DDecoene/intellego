# Curriculum Structure & Story World — Design

**Date:** 2026-06-14
**Status:** Approved (design phase)

## Purpose

Define the missing keystone of the Intellego platform: the curriculum spine and
the story world. Every other system — content generation, spaced repetition,
progress tracking, the AI tutor — reads from this structure. Without it,
"structured progression" and the "80% known vocabulary" rules have nothing to
operate on.

This design produces two repository documents (`CURRICULUM.md` and
`STORY_WORLD.md`) written in original, generic terms.

## Pedagogical alignment

The curriculum follows a natural / reading-first method: comprehensible input,
one new structure at a time, never introducing unstudied grammar, recurring
characters, and understanding without translation. These principles are already
captured in `CONTENT_RULES.md` and are honored here. The chapter count and
section organization are deliberately original and do **not** mirror any
existing course's structure.

## Story world

An original cast — a baker's family running a small bakery (*pistrīna*) in a
Roman town. The bakery setting is chosen because its vocabulary (bread, water,
fire, flour, oven, buy, sell, eat) is high-frequency and remains relevant in the
modern world, and because daily bakery life scales naturally from simple to
complex scenes.

Central cast:

- **Gaius** — the baker (*pater, pistor*)
- **Tullia** — the mother, runs the shop counter
- **Lucius** — the son, learning the trade
- **Aelia** — the daughter
- **Felix** — a young helper in the bakery
- **Argus** — the family dog (a concrete, recurring noun for early chapters)

All characters are original to this project.

## Structure: sections as story arc and proficiency tier

The curriculum is organized into **sections**. Each section simultaneously
advances the story and raises the learner's proficiency level — narrative
progress and level progress are the same axis.

Proposed shape: **6 sections**, each containing roughly 3–5 **chapters**, for
approximately **24 chapters** total.

| Section | Story arc | Level focus (grammar) |
|---|---|---|
| I — In the Bakery | Meet the family and the shop | Naming things: nouns, *est/sunt*, singular vs plural, here/there |
| II — The Morning Work | A day's baking begins | Actions: present-tense verbs, the object (accusative), counting |
| III — At the Counter | Customers and the market | People and questions, place (in/from/to), simple dialogue |
| IV — A Problem in the Shop | Something goes wrong | Describing (adjectives) and talking about what happened (past) |
| V — The Road for Grain | A journey out of town | Movement and time, new places, more connected narrative |
| VI — The Festival | The town celebrates | Longer passages, joining ideas (because/when), independent reading |

## Per-chapter data contract

`CURRICULUM.md` records, for each chapter:

- **Grammar concept** — exactly one new concept introduced (one-concept-per-lesson rule).
- **New vocabulary** — within the per-level caps from `CONTENT_RULES.md`.
- **Cumulative known set** — the full vocabulary a learner is assumed to know by
  the end of this chapter. This is the keystone: the spaced-repetition pool and
  the content generator both read from it.
- **Comprehension target** — the difficulty-scaling percentage from `CONTENT_RULES.md`.
- **Story beat** — what happens in the narrative this chapter.

## Deliverables

- **`CURRICULUM.md`** — the section/chapter spine with the per-chapter data above.
- **`STORY_WORLD.md`** — cast, setting, and tone, so generated passages stay
  coherent and recurring across chapters.

Both documents are written in original, generic terms. No source book is named
anywhere in the repository (docs, code, comments, or commit messages).

## Out of scope (this design)

- Application code, data models, or database schema.
- The content-generation pipeline implementation.
- Spaced-repetition algorithm implementation.
- Authentication, UI, deployment.

These consume the curriculum once it exists; they are separate future specs.
```
