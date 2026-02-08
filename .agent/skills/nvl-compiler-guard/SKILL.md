---
name: nvl-compiler-guard
description: Validate NVL scripts for causal, spatial, epistemic, and ontology consistency. Use when checking if generated story code is logically executable and when producing actionable diagnostics.
---

# Validation Steps

1. Parse line-by-line statements deterministically.
2. Build world state and actor state incrementally.
3. Enforce hard errors for:
   - unknown commands
   - unknown entities
   - dead actor actions
   - physical action location mismatch
   - missing inventory on USE/GIVE
   - epistemic violations on SPEAK fact
   - backward world time without flashback mode
4. Emit warnings for unresolved clues and character-break risk.
5. Produce detailed per-line event log with checks and before/after state digest.

# Output Contract

Return:

- `success`
- `diagnostics[]`
- `events[]`
- `logText`
- `normalizedSource`
