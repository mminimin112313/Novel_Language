---
name: nvl-review
description: Plot consistency and manuscript quality review workflow.
---

# Workflow: Review

Goal: reject plot holes and style violations before final export.

## Steps

1. Compiler review:
   - compile source and ensure `error` diagnostics are zero.
   - inspect `warning` diagnostics and classify as must-fix or accepted risk.

2. Consistency review:
   - query with AQL for actor status, ownership chains, clue states, and knowledge flow.
   - ensure all unresolved clues are intentional (`RedHerring` only).

3. Manuscript review:
   - run manuscript lint against episode pack requirements.
   - verify each paragraph is grounded by `[[EVT:###]]` during internal review stage.

4. Korean editorial review:
   - run `nvl-korean-proofreader` for spacing/orthography/tone consistency.
