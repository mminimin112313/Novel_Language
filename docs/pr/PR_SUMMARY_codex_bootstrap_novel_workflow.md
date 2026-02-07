# PR Summary: Bootstrap Automation + Actual Novel Workflow

## Branch

- Source: `codex/bootstrap-nvl-agent-suite`
- Target: `main`

## Why

- Make clone-first onboarding deterministic for AI and humans.
- Add practical long-form novel writing flow beyond single chapter pipeline.
- Expose manuscript workflow through CLI and MCP.

## What Changed

1. Clone-first automation

- Added `scripts/bootstrap.sh`
- Added `AGENTS.md` first-run rule (`bash scripts/bootstrap.sh`)
- Added `.env.example`
- Added npm script: `npm run setup:auto`

2. Actual novel writing workflow

- Added planner agent: `src/agents/planner.ts`
- Added workflow engine: `src/workflows/novelWriter.ts`
- Added CLI command: `npm run novel:write -- --concept ... --title ... --chapters ...`
- Added writer agent profile: `.agent/writer.agent.yaml`
- Added skill: `skills/nvl-novel-writer/SKILL.md`
- Added workflow doc: `workflows/actual-novel-writing.md`

3. MCP expansion

- Added tool wrapper: `toolWriteNovel` in `src/mcp/tools.ts`
- Registered MCP tool: `nvl_write_novel` in `src/mcp/server.ts`
- Updated MCP docs: `mcp/README.md`

4. Test coverage

- Added planner fallback test: `tests/planner.spec.ts`
- Added novel workflow integration test: `tests/novel-workflow.spec.ts`
- Extended MCP tool tests with novel workflow case: `tests/mcp-tools.spec.ts`

## Validation

```bash
npm run lint
npm run test
npm run novel:write -- --concept "폭우 속 야간열차 살인사건" --title "심야특급" --chapters 2 --style Noir --project smoke-novel-workflow
```

## Notes

- `clone only` cannot execute code automatically by Git itself for security reasons.
- This PR implements practical automation via `AGENTS.md` + `bootstrap.sh`, so AI agents can deterministically self-setup on first interaction.
