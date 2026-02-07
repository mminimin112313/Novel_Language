# Antigravity Brief Snapshot (2026-02-07)

User clarified requirements:

- Antigravity workflow is the default runtime for agents.
- The repo should provide:
  - `.agent` skills/workflows/rules for novel writing
  - deterministic NVL compiler for plot consistency checks
  - plot search/query capability (AQL)
- The default workflow should not require users to paste API keys.
- Plot compilation should be reproducible with:
  - `tests/plot/<story-id>/attempt-XX*.nvl`
  - `logs/plot-validation/<story-id>/attempt-XX.*` + `summary.md`

