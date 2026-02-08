---
name: nvl-debug
description: Triage and repair compile/lint failures quickly and deterministically.
---

# Workflow: Debug

Goal: move broken NVL/manuscript outputs back to pass state.

## Triage Order

1. Compile blockers (`error`):
   - `E_CAUSALITY_TIME`, `E_SPATIAL_MISMATCH`, `E_EPISTEMIC`, `E_ONTOLOGY_DEAD`, inventory errors
2. Consistency drifts (`warning`):
   - unresolved clues, emotional vector anomalies, relation graph mismatch
3. Manuscript lint failures:
   - missing citations, banned phrase usage, unmet motif/length constraints

## Repair Loop

1. Capture failing diagnostics with scene/time/actor references.
2. Patch NVL minimally (do not change unaffected scenes).
3. Re-compile and log delta in `logs/plot-validation/<story-id>/`.
4. Repeat until `error=0`.
