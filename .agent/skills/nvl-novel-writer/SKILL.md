---
name: nvl-novel-writer
description: End-to-end long-form novel generation workflow that plans chapters, compiles each chapter through NVL consistency checks, and renders validated prose into manuscript files. Use when the user asks for actual multi-chapter novel writing, draft production, or manuscript assembly.
---

# Workflow

1. **World Building**: Run `nvl-world-builder` to generate/update `nvl/world/*.nvl` files.
2. **Structure**: Organize work into `phase_XX/chapter_XX/epXX` structure.
3. **Planning**: Create `epXX_plan.md` (Beat Sheet) before writing NVL.
4. **NVL Writing**: Write `epXX.nvl` utilizing the split world files.
5. **Compilation**: Compile to ensure logic safety.
6. **Prose Drafting**: Write `epXX.txt` based *strictly* on specific NVL events.
    - **Regulation**: Prose must be **5x longer** than the NVL code.
    - **Density**: Use the `Micro-Event` breakdown from the plan.
7. **Sync Loop**: If the prose requires a change, UPDATE the NVL first.

# Command

```bash
npm run novel:write -- --concept "..." --title "..." --chapters 5 --style Cinematic
```

# Output

- `novels/<project-id>/manuscript.md`
- `logs/novel-writing/<project-id>/run-summary.json`
