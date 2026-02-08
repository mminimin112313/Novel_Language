---
name: nvl-architect
description: Generate or repair NVL line-DSL code from natural-language story direction. Use when the task is converting writer intent to compile-valid NVL and iterating with compiler diagnostics.
---

# Workflow

1. Read writer direction and extract actors, locations, knowledge facts, and key events.
2. Emit line DSL only; do not output markdown fences.
3. Ensure all actors are declared before references.
4. Ensure timeline monotonicity unless flashback mode is explicit.
5. If diagnostics exist, prioritize fixing all `error` diagnostics first.

# Context Loading (Mandatory)

Before generating NVL, load these files:
1. `world.nvl` → Check existing actors, items, relations
2. Prior episode NVL files → Avoid redeclaring actors, check cumulative state
3. `nvl-compiler-guide.md` → Known error patterns and fixes

# Required Command Set

Use only:

- `ACTOR`
- `COMPONENT`
- `SET`
- `GIVE`
- `KNOWS`
- `MEMORY`
- `RELATE`
- `GOAL`
- `SCENE`
- `SEED`
- `RESOLVE`
- `ACTION`

# Repair Heuristics

- `E_ITEM_MISSING` or `E_GIVE_ITEM`: add prior `GIVE` or change action item.
- `E_SPATIAL_MISMATCH`: align actor locations before physical action.
- `E_EPISTEMIC`: add `KNOWS` before `ACTION SPEAK` with fact.
- `E_CAUSALITY_TIME`: mark scene `mode=flashback` or reorder times.
