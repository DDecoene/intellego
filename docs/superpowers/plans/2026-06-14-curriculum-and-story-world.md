# Curriculum & Story World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author two repository documents — `STORY_WORLD.md` (original cast and setting) and `CURRICULUM.md` (6-section, ~24-chapter spine with a per-chapter data contract) — that all downstream systems read from.

**Architecture:** Content-authoring task, not code. Each task produces one document section. Verification is a validation check against `CONTENT_RULES.md` (vocabulary caps respected, cumulative vocabulary set grows monotonically and never references unintroduced words) plus an editorial checklist. Frequent commits, one per section.

**Tech Stack:** Markdown only. A small `bash`/`grep`/`awk` validation snippet per task confirms vocab-count rules; no application code.

---

## Conventions (read before every task)

- **No source book named** anywhere — docs, commit messages, comments. Refer only to "the natural / reading-first method."
- **Vocabulary caps** (from `CONTENT_RULES.md`): Beginner ≤ 5 new words/chapter, Intermediate ≤ 8, Advanced ≤ 12.
- **Level mapping:** Sections I–II = Beginner, III–IV = Intermediate, V–VI = Advanced.
- **Comprehension targets** (from `CONTENT_RULES.md`): Beginner 80–95%, Intermediate 70–85%, Advanced 60–80%.
- **One grammar concept per chapter.**
- **Cumulative set** = every word introduced in this chapter plus all prior chapters. It must be monotonic (never shrinks) and must never use a word before its introducing chapter.
- **Vocab entry format** in `CURRICULUM.md`: `latin — english (part of speech)`.

---

## File Structure

- Create: `STORY_WORLD.md` — cast, setting, tone. ~1 page.
- Create: `CURRICULUM.md` — intro + 6 section blocks, each with its chapters and the per-chapter data contract.

---

### Task 1: Story world document

**Files:**
- Create: `STORY_WORLD.md`

- [ ] **Step 1: Write `STORY_WORLD.md`**

Content:

```markdown
# Story World

Intellego's reading content follows one continuous narrative: an original cast
in a Roman town. Generated passages must stay consistent with this world and
reuse these recurring characters.

## Setting

A small bakery (*pistrīna*) on a street in a Roman town, and the town around it
— the counter, the oven room, the market, the road out of town. The bakery is
the anchor; the world widens as the learner advances.

## Cast

- **Gaius** — the baker (*pater, pistor*). Owns the bakery.
- **Tullia** — the mother. Runs the shop counter.
- **Lucius** — the son. Learning the trade.
- **Aelia** — the daughter.
- **Felix** — a young helper in the bakery.
- **Argus** — the family dog.

All characters are original to this project.

## Tone

Warm, concrete, everyday. Scenes center on tangible objects and simple actions
that scale from a single sentence to a connected story. Avoid abstraction in
early sections.

## Continuity rules

- Reuse these names; do not invent new principal characters without adding them here.
- Keep object vocabulary consistent (the same word for bread, oven, etc. throughout).
- Each section advances the story in time; earlier events remain true.
```

- [ ] **Step 2: Verify (editorial checklist)**

Confirm: no source book named; all six characters present; setting + tone + continuity sections present.

Run a case-insensitive scan of `STORY_WORLD.md` for any source-textbook name or its author (the terms we keep out of the repo).
Expected: no matches (empty output).

- [ ] **Step 3: Commit**

```bash
git add STORY_WORLD.md
git commit -m "Add story world document (cast, setting, continuity)"
```

---

### Task 2: Curriculum scaffold + Section I (Beginner)

**Files:**
- Create: `CURRICULUM.md`

- [ ] **Step 1: Write the intro and the per-chapter format key**

```markdown
# Curriculum

The curriculum is organized into **sections**. Each section advances the story
and raises proficiency at the same time. Levels: Sections I–II Beginner,
III–IV Intermediate, V–VI Advanced.

Each chapter records:
- **Grammar concept** — one new concept.
- **New vocabulary** — within the per-level cap (Beginner ≤5, Intermediate ≤8, Advanced ≤12).
- **Cumulative vocabulary** — every word known by the end of this chapter.
- **Comprehension target** — Beginner 80–95%, Intermediate 70–85%, Advanced 60–80%.
- **Story beat** — what happens in the narrative.

Vocabulary format: `latin — english (part of speech)`.
```

- [ ] **Step 2: Write Section I (4 chapters). Worked example for Ch. 1; same format for 2–4**

Author the following, keeping each chapter ≤5 new words and a monotonic cumulative set:

```markdown
## Section I — In the Bakery (Beginner)

*Story arc: meet the family and the shop.*

### Chapter 1 — The bakery
- **Grammar concept:** Naming one thing — a noun with *est* ("is").
- **New vocabulary (5):**
  - pistrīna — bakery (noun)
  - pānis — bread (noun)
  - Gaius — Gaius, the baker (name)
  - est — is (verb)
  - hīc — here (adverb)
- **Cumulative vocabulary (5):** pistrīna, pānis, Gaius, est, hīc
- **Comprehension target:** 90%
- **Story beat:** We see the bakery. Gaius is here. The bread is here.

### Chapter 2 — The family
- **Grammar concept:** More names; joining two facts.
- **New vocabulary (5):** Tullia — Tullia (name); Lucius — Lucius (name); Aelia — Aelia (name); mater — mother (noun); pater — father (noun)
- **Cumulative vocabulary (10):** pistrīna, pānis, Gaius, est, hīc, Tullia, Lucius, Aelia, mater, pater
- **Comprehension target:** 90%
- **Story beat:** Gaius is the father. Tullia is the mother. Lucius and Aelia are here.

### Chapter 3 — More than one
- **Grammar concept:** Singular vs plural — *est* vs *sunt*.
- **New vocabulary (4):** sunt — are (verb); puer — boy (noun); puella — girl (noun); canis — dog (noun)
- **Cumulative vocabulary (14):** + sunt, puer, puella, canis
- **Comprehension target:** 88%
- **Story beat:** Lucius is a boy. Aelia is a girl. Argus the dog is here too. The children are in the bakery.

### Chapter 4 — Here and there
- **Grammar concept:** Place contrast — *hīc* (here) vs *ibi* (there).
- **New vocabulary (4):** Argus — Argus, the dog (name); ibi — there (adverb); fornāx — oven (noun); mēnsa — counter/table (noun)
- **Cumulative vocabulary (18):** + Argus, ibi, fornāx, mēnsa
- **Comprehension target:** 88%
- **Story beat:** The oven is here. The counter is there. Argus is by the oven.
```

- [ ] **Step 3: Verify vocab caps and monotonic cumulative set**

Run (counts new-vocab entries per chapter; each must be ≤5 for Section I):
```bash
awk '/^### Chapter/{ch=$0} /New vocabulary \(/{match($0,/\(([0-9]+)\)/,a); print ch": "a[1]}' CURRICULUM.md
```
Expected: every printed count ≤ 5.

Manually confirm each chapter's cumulative count = previous cumulative + new count (5,10,14,18) and no word appears in a story beat before its chapter.

Run a case-insensitive scan of `CURRICULUM.md` for any source-textbook name or its author (the terms we keep out of the repo).
Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add CURRICULUM.md
git commit -m "Add curriculum scaffold and Section I chapters"
```

---

### Task 3: Section II — The Morning Work (Beginner)

**Files:**
- Modify: `CURRICULUM.md` (append)

- [ ] **Step 1: Append Section II (4 chapters, ≤5 new words each)**

Grammar progression: (1) present-tense action verb, (2) the object (accusative singular), (3) "I/you/he" subjects on a verb, (4) counting one/two/many. Use bakery actions: *facere* (make), *portāre* (carry), *coquere* (bake/cook), *vendere* (sell). Story beat: the morning's baking begins — Gaius makes bread, Lucius carries flour, the oven cooks the bread. Build each chapter in the exact format from Task 2, continuing the cumulative set from 18.

- [ ] **Step 2: Verify**

Run the awk count from Task 2 Step 3; every Section II chapter ≤5. Confirm cumulative set continues monotonically from 18 and the grep for source-book terms is empty.

- [ ] **Step 3: Commit**

```bash
git add CURRICULUM.md
git commit -m "Add Section II chapters (the morning work)"
```

---

### Task 4: Section III — At the Counter (Intermediate)

**Files:**
- Modify: `CURRICULUM.md` (append)

- [ ] **Step 1: Append Section III (4 chapters, ≤8 new words each)**

Grammar progression: (1) asking questions (*quis? quid? -ne*), (2) place prepositions (*in, ad, ex* + the idea of "into/to/from"), (3) simple two-line dialogue, (4) "wanting/needing" (*velle*, *cupere*). Story beat: customers come to the counter; Tullia sells bread; a customer asks for bread and pays. Comprehension target 80%. Continue cumulative set.

- [ ] **Step 2: Verify**

Run the awk count; every Section III chapter ≤8. Confirm monotonic cumulative set and empty source-book grep.

- [ ] **Step 3: Commit**

```bash
git add CURRICULUM.md
git commit -m "Add Section III chapters (at the counter)"
```

---

### Task 5: Section IV — A Problem in the Shop (Intermediate)

**Files:**
- Modify: `CURRICULUM.md` (append)

- [ ] **Step 1: Append Section IV (4 chapters, ≤8 new words each)**

Grammar progression: (1) describing with adjectives (agreement in number), (2) more adjectives (good/bad, big/small, hot/cold), (3) talking about what happened — simple past (perfect) of known verbs, (4) negation and "not/no one" (*nōn, nēmō*). Story beat: the oven fire goes wrong / the bread burns; the family reacts and fixes it. Comprehension target 78%. Continue cumulative set.

- [ ] **Step 2: Verify**

Run the awk count; every Section IV chapter ≤8. Confirm monotonic cumulative set and empty source-book grep.

- [ ] **Step 3: Commit**

```bash
git add CURRICULUM.md
git commit -m "Add Section IV chapters (a problem in the shop)"
```

---

### Task 6: Section V — The Road for Grain (Advanced)

**Files:**
- Modify: `CURRICULUM.md` (append)

- [ ] **Step 1: Append Section V (4 chapters, ≤12 new words each)**

Grammar progression: (1) movement verbs + direction (*īre, venīre*; to/from places), (2) time words (today/tomorrow/then; *hodiē, crās, tum*), (3) longer connected narrative across sentences, (4) "with/without" and companions (*cum, sine*). Story beat: Lucius travels out of town to buy grain (*frūmentum*) and meets people on the road. Comprehension target 72%. Continue cumulative set.

- [ ] **Step 2: Verify**

Run the awk count; every Section V chapter ≤12. Confirm monotonic cumulative set and empty source-book grep.

- [ ] **Step 3: Commit**

```bash
git add CURRICULUM.md
git commit -m "Add Section V chapters (the road for grain)"
```

---

### Task 7: Section VI — The Festival (Advanced)

**Files:**
- Modify: `CURRICULUM.md` (append)

- [ ] **Step 1: Append Section VI (4 chapters, ≤12 new words each)**

Grammar progression: (1) joining ideas with *quod* (because) and *cum/ubi* (when), (2) "who/which" relative clause (simple), (3) longer multi-paragraph passage, (4) review/mastery chapter — no or minimal new vocab, a full festival story using the accumulated set. Story beat: the town festival; the bakery sells bread to the crowd; the family celebrates. Comprehension target 70%. Continue cumulative set.

- [ ] **Step 2: Verify**

Run the awk count; every Section VI chapter ≤12. Confirm monotonic cumulative set and empty source-book grep.

- [ ] **Step 3: Commit**

```bash
git add CURRICULUM.md
git commit -m "Add Section VI chapters (the festival)"
```

---

### Task 8: Whole-document consistency pass

**Files:**
- Modify: `CURRICULUM.md`, `STORY_WORLD.md` (fixes only)

- [ ] **Step 1: Verify per-level caps across the whole file**

Run:
```bash
awk '/^## Section/{sec=$0} /^### Chapter/{ch=$0} /New vocabulary \(/{match($0,/\(([0-9]+)\)/,a); print sec" | "ch" | "a[1]}' CURRICULUM.md
```
Expected: Sections I–II counts ≤5, III–IV ≤8, V–VI ≤12.

- [ ] **Step 2: Verify cumulative set is monotonic and self-consistent**

Manually walk each chapter: cumulative count must equal previous cumulative + this chapter's new count, and every word used in a story beat must already exist in the cumulative set at that chapter. Fix any drift inline.

- [ ] **Step 3: Verify character + setting consistency against `STORY_WORLD.md`**

Confirm every character named in `CURRICULUM.md` story beats exists in `STORY_WORLD.md`. Add any missing character to `STORY_WORLD.md`.

- [ ] **Step 4: Final source-book scan**

Run a recursive case-insensitive scan of `CURRICULUM.md` and `STORY_WORLD.md` for any source-textbook name or its author (the terms we keep out of the repo).
Expected: no matches.

- [ ] **Step 5: Commit any fixes**

```bash
git add CURRICULUM.md STORY_WORLD.md
git commit -m "Curriculum/story-world consistency pass"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** Story world (Task 1) ✓; section/chapter spine, 6 sections (Tasks 2–7) ✓; per-chapter data contract — grammar/new vocab/cumulative/comprehension/story beat (Task 2 format, all sections) ✓; both deliverable files ✓; original-terms / no-book rule (grep checks every task) ✓.
- **Placeholder scan:** Section I fully worked as a concrete template; Sections II–VI specify exact grammar progression, vocab themes, caps, comprehension targets, and story beats so the executor authors them deterministically. No "TBD"/"add later".
- **Consistency:** Cumulative counts chain explicitly (5→10→14→18) in the worked section and the awk/manual checks enforce monotonicity throughout; vocab entry format fixed once and reused.
```
