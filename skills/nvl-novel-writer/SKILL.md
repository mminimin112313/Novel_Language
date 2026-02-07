---
name: nvl-novel-writer
description: End-to-end long-form novel generation workflow that plans chapters, compiles each chapter through NVL consistency checks, and renders validated prose into manuscript files. Use when the user asks for actual multi-chapter novel writing, draft production, or manuscript assembly.
---

# Workflow

1. Build chapter plan from concept.
2. Run chapter pipeline (Architect -> Compiler -> Novelist) for each chapter.
3. Persist chapter text and compile logs.
4. Assemble final manuscript.

# Command

```bash
npm run novel:write -- --concept "..." --title "..." --chapters 5 --style Cinematic
```

# Output

- `novels/<project-id>/manuscript.md`
- `logs/novel-writing/<project-id>/run-summary.json`
