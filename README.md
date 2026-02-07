# NVL Agent Suite

Two-agent novel authoring system for NVL (Novel-Lang):

1. Architect agent generates NVL code from writer direction.
2. Compiler validates causality/epistemic/spatial consistency.
3. Novelist agent renders validated logs into natural-language fiction.

This repo is optimized for Antigravity usage: **no API keys are required**. Deterministic checks (compiler/AQL/lint) gate quality; prose generation is driven by skills/workflows.

## Project Goals

- Production-ready TypeScript implementation.
- Full web UI for directing story, compiling, fixing, rendering, and downloading logs.
- Detailed trace logs for every run.
- MCP toolset for editor/agent integrations.

## Quickstart

```bash
npm install
npm run dev
```

For clone-first full setup:

```bash
npm run setup:auto
```

Server endpoints:

- `POST /api/compile`
- `POST /api/pipeline`
- `GET /api/runs/:runId/files/:fileName`
- `POST /api/architect`
- `POST /api/novelist`

CLI helpers:

- `npm run compile:file -- ./example.nvl`
- `npm run aql -- ./example.nvl "SELECT name, status, location FROM Actors WHERE status = 'Alive'"`
- `npm run pipeline -- \"인어공주가 왕자를 구하고 목소리를 잃는다\" Cinematic`
- `npm run episode:pack -- ./example.nvl templates/episode-spec.example.json ./episode-pack.json`
- `npm run manuscript:lint -- ./episode-pack.json ./draft.txt`
- `npm run novel:write -- --concept \"...\" --title \"...\" --chapters 5 --style Noir`
- `npm run mcp`
- `npm run plot:validate`
- `npm run setup:auto`

## Included Sets

- `.agent`: role configs for architect/novelist/orchestrator + episode writing roles
- `skills`: architect/compiler-guard/novelist + AQL + episode planning/writing/review/proofread + consistency audit
- `workflows`: setup + plot compile + two-agent loop + episode writing flow
- `rules`: compiler lint/validation registry + editorial/project rules
- `scripts`: CLI compile and pipeline helpers
- `workflows/actual-novel-writing.md`: practical manuscript production flow
- `scripts/bootstrap.sh`: clone-first auto bootstrap script
- `tests/plot`: internet-plot compile fixtures with iterative corrections
- `logs/plot-validation`: persisted compile diagnostics and correction history
- `mcp`: stdio MCP server + sample client config
- `docs/manuals/ANTIGRAVITY_NVL.md`: Antigravity-first manual (plot compile, AQL, EpisodePack, lint)

## Status

- MVP implemented with full web studio and MCP tools.

## Branch Tracking

- Active implementation branch: `codex/bootstrap-nvl-agent-suite`
