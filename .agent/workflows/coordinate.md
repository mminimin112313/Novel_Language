---
name: nvl-coordinate
description: Human-in-the-loop multi-agent coordination for novel production.
---

# Workflow: Coordinate

Goal: coordinate architect, compiler, and novelist roles with manual checkpoints.

## Sequence

1. `nvl-architect`
   - produce/update NVL from writer direction.

2. `nvl-compiler-guard`
   - compile and return only deterministic failures first.
   - stop and request fix when `error > 0`.

3. `nvl-aql` + `nvl-consistency-auditor`
   - run targeted checks for secrets, clue resolution, ownership chain.

4. `nvl-novelist` or episode chain
   - only after compile pass.

5. `nvl-korean-proofreader`
   - final Korean quality pass before export.
