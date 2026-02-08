# CHANGELOG

## 2026-02-08

- Branch: `codex/bootstrap-nvl-agent-suite`
- Reorganized Antigravity assets to `.agent/*` layout (migrated skills/workflows/rules, added `.agent/config/user-preferences.yaml`, `.agent/mcp.json`, and `.agent/skills/_shared/*`).
- Added AQL (`src/query/*`, `npm run aql`, MCP: `nvl_aql`) for plot search (knowledge/ownership/clues/scenes).
- Added EpisodeSpec/EpisodePack (`src/episode/*`, `npm run episode:pack`, MCP: `nvl_episode_pack`) for episode-level context packs.
- Added deterministic manuscript lint (`src/lint/*`, `npm run manuscript:lint`, MCP: `nvl_manuscript_lint`) with `[[EVT:###]]` grounding checks.
- Compiler observability upgrade: events carry scene context; knowledge and item transfer histories are tracked.
- Added second plot fixture set: `tests/plot/speckled-band/*` + persisted logs under `logs/plot-validation/speckled-band/`.
- Generalized `plot:validate` to run across multiple stories.
- Added Antigravity manual and expanded skills/workflows/rules for episode writing, Korean proofreading, and consistency audits.
- Removed external Gemini SDK dependency and API-key UX from the web studio; default workflow requires no API keys.

## 2026-02-07

- Branch: `codex/bootstrap-nvl-agent-suite`
- Round 1: Added initial project skeleton and requirements capture.
- Round 2: Added NVL compiler core, diagnostics, and tests.
- Round 3: Added agent orchestration, retry loop, run persistence, and skill/workflow/rules sets.
- Round 4: Added full web studio and stepwise/full pipeline APIs with log download support.
- Round 5: Added MCP stdio server set and MCP tool wrappers/tests.
- Plot validation extension: added internet-source Little Mermaid conversion fixtures, iterative compile tests, and persistent plot-validation logs.
- Added clone-first bootstrap workflow (`scripts/bootstrap.sh`, `AGENTS.md`, `npm run setup:auto`).
- Added AI long-form novel workflow (planner + chapter pipelines + manuscript assembly).
