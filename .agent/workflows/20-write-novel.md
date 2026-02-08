---
name: nvl-write-novel
---

# Workflow: Phase/Chapter NVL Loop

Goal: Generate a consistent novel by iterating Phase -> Chapter -> Episode.

## 1. World Building (Prerequisite)
- Run `nvl-world-builder` to generate split world files (`nvl/world/*.nvl`).
- Ensure they compile cleanly.

## 2. Phase Planning
- Define the arc for the current Phase (e.g., Phase 1: The Setup).
- Break down into Chapters.

## 3. Chapter Execution (Iterative)
- **Plan**: Create episode beat sheet (`epXX_plan.md`).
- **Write NVL**: Create `epXX.nvl` referencing world files.
- **Compile**: Verify logic (`npm run compile:file`).
- **Draft Prose**: Write `epXX.txt` based *strictly* on NVL events.
- **Sync Check**: If prose needs to diverge, UPDATE NVL first.

## Output
- `phase_XX/chapter_XX/epXX.nvl` (Canonical Truth)
- `phase_XX/chapter_XX/epXX.txt` (Prose Draft)

## Acceptance Criteria

- Prose only references facts present in the validated log.
- Style matches requested parameters.
- Output is stable enough to be iterated chapter-by-chapter.

