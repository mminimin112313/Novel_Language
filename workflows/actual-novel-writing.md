# Actual Novel Writing Workflow

## Goal

Generate publishable draft text through a deterministic loop:

1. AI plans chapter structure.
2. Each chapter is converted to NVL and compiler-validated.
3. Only validated logs are rendered into prose.
4. Chapter outputs are merged into a manuscript.

## Execution

```bash
npm run novel:write -- \
  --concept "현대 서울의 기억상실 탐정이 연쇄 사건을 추적한다" \
  --title "잃어버린 진술" \
  --chapters 5 \
  --style Noir
```

## Artifacts

- `novels/<project-id>/plan.json`
- `novels/<project-id>/chapter-XX-*.md`
- `novels/<project-id>/manuscript.md`
- `logs/novel-writing/<project-id>/*.compile-log.txt`
- `logs/novel-writing/<project-id>/run-summary.json`

## Failure Policy

- If a chapter fails compile-repair loop, workflow marks final result as failed.
- Logs and diagnostics are still persisted for targeted correction.
