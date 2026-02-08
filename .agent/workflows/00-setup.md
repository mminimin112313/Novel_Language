---
name: nvl-setup
---

# Workflow: Setup (Clone -> Ready)

Goal: a freshly cloned repo becomes runnable with one command, without API keys.

## Steps

1. Run setup doctor:
   - `npm run setup:doctor`

2. Run automatic bootstrap:
   - `npm run setup:auto`

3. Verify compiler + fixtures:
   - `npm run lint`
   - `npm test`
   - `npm run plot:validate`

## Expected Outputs

- `node_modules/` installed.
- `.env` created from `.env.example` (optional).
- `logs/plot-validation/*` updated only by explicit validation runs.
