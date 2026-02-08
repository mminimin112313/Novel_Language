---
name: nvl-setup-alias
description: Setup workflow alias with project doctor checks.
---

# Workflow: Setup (Antigravity + NVL)

Goal: a fresh clone is operational without API keys.

## Steps

1. Run setup doctor:
   - `npm run setup:doctor`

2. Run bootstrap:
   - `npm run setup:auto`

3. Confirm deterministic gates:
   - `npm run lint`
   - `npm run test`
   - `npm run plot:validate`

## Done Criteria

- `.agent` structure is valid.
- MCP config is clone-portable.
- Tests and plot validation pass.
