# NVL Agent Suite

Two-agent novel authoring system for NVL (Novel-Lang):

1. Architect agent generates NVL code from writer direction.
2. Compiler validates causality/epistemic/spatial consistency.
3. Novelist agent renders validated logs into natural-language fiction.

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

Server endpoints:

- `POST /api/compile`
- `POST /api/pipeline`
- `GET /api/runs/:runId/files/:fileName`
- `POST /api/architect`
- `POST /api/novelist`

CLI helpers:

- `npm run compile:file -- ./example.nvl`
- `npm run pipeline -- \"인어공주가 왕자를 구하고 목소리를 잃는다\" Cinematic`
- `npm run mcp`
- `npm run plot:validate`

## Included Sets

- `.agent`: role configs for architect, novelist, orchestrator
- `skills`: nvl-architect, nvl-compiler-guard, nvl-novelist
- `workflows`: two-agent loop specification
- `rules`: compiler lint/validation rule registry
- `scripts`: CLI compile and pipeline helpers
- `tests/plot`: internet-plot compile fixtures with iterative corrections
- `logs/plot-validation`: persisted compile diagnostics and correction history
- `mcp`: stdio MCP server + sample client config

## Status

- MVP implemented with full web studio and MCP tools.

## Branch Tracking

- Active implementation branch: `codex/nvl-agent-suite-mvp`
