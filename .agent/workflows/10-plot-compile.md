---
name: nvl-plot-compile
---

# Workflow: Plot -> NVL -> Compile (Iterate Until Pass)

Goal: convert a real plot into NVL, then iterate until the compiler reports `SUCCESS`, while recording every attempt.

## Inputs

- A story id: `<story-id>` (kebab-case, example: `little-mermaid`)
- Two plot sources (cross-validated)
- A plot outline (bullet points)

## Steps

1. Create story folders:
   - `tests/plot/<story-id>/`
   - `logs/plot-validation/<story-id>/`
   - `docs/research/<story-id>-sources.md`

2. Attempt 01 (rough conversion):
   - Create `tests/plot/<story-id>/attempt-01-rough.nvl`
   - Run `npm run compile:file -- tests/plot/<story-id>/attempt-01-rough.nvl`
   - Save compiler outputs under `logs/plot-validation/<story-id>/attempt-01.*`

3. Attempt 02..N (repair loop):
   - Copy previous attempt to next attempt file.
   - Fix all `error` diagnostics first (spatial, epistemic, inventory, causality).
   - Re-run compile and persist logs for that attempt.
   - Stop when `success=true`.

4. Add/extend tests:
   - Add `tests/plot/<story-id>.spec.ts` verifying attempt 01 fails and final attempt passes.
   - Update `npm run plot:validate` configuration to include this story.

## Acceptance Criteria

- Plot compiles in a final attempt with **no error diagnostics**.
- Earlier attempts demonstrate meaningful failures (proves the linter works).
- Logs are complete and reproducible.

