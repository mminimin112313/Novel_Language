# NVL Agent Suite

Two-agent novel authoring system for NVL (Novel-Lang):

1. Architect agent generates NVL code from writer direction.
2. Compiler validates causality/epistemic/spatial consistency.
3. Novelist agent renders validated logs into natural-language fiction.

This repo is **Antigravity-first**:

- The deterministic **compiler + query tooling** lives in this repo.
- The **LLM-driven writing loop** is expected to run via Antigravity using `.agent/skills`, `.agent/workflows`, and `.agent/rules`.
- **No API keys are required** to use the compiler, plot validation, or AQL search.

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

Manual:

- `docs/manuals/ANTIGRAVITY_NVL.md`

Server endpoints:

- `POST /api/compile`
- `POST /api/pipeline`
- `GET /api/runs/:runId/files/:fileName`
- `POST /api/architect`
- `POST /api/novelist`

CLI helpers:

- `npm run compile:file -- ./example.nvl`
- `npm run aql -- ./example.nvl "SELECT name, location FROM Actors"`
- `npm run episode:pack -- ./example.nvl ./templates/episode-spec.example.json ./episode-pack.json`
- `npm run manuscript:lint -- ./episode-pack.json ./draft.txt`
- `npm run pipeline -- \"인어공주가 왕자를 구하고 목소리를 잃는다\" Cinematic`
- `npm run mcp`
- `npm run plot:validate`

## Included Sets

- `.agent`: Antigravity sets (agents/skills/workflows/rules)
- `scripts`: CLI compile and pipeline helpers
- `tests/plot`: internet-plot compile fixtures with iterative corrections
- `logs/plot-validation`: persisted compile diagnostics and correction history
- `mcp`: stdio MCP server + sample client config
- `templates`: EpisodeSpec templates

## Status

- MVP implemented with full web studio and MCP tools.

## Branch Tracking

- Active implementation branch: `codex/nvl-agent-suite-mvp`
