---
name: nvl-write-novel
---

# Workflow: Compile-Pass Log -> Prose (Novelist Agent)

Goal: generate publishable prose using only compile-validated events.

## Inputs

- `direction`: writer intent (tone, theme, constraints)
- `style`: Cinematic | Noir | Classic | LightNovel
- `compile-log.txt`: from a compile-pass NVL attempt

## Steps

1. Verify the log is from a compile-pass run:
   - confirm `result=SUCCESS` in the header

2. Generate prose:
   - Use the `nvl-novelist` skill.
   - Prose must not introduce any items/entities/facts absent from the log.

3. Save outputs:
   - Store manuscript at `manuscripts/<story-id>/draft.md` (create folder if needed)
   - Keep the compile log alongside for traceability.

## Acceptance Criteria

- Prose only references facts present in the validated log.
- Style matches requested parameters.
- Output is stable enough to be iterated chapter-by-chapter.

