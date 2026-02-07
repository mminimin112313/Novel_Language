# CHANGELOG

## 2026-02-07

- Branch: `codex/nvl-agent-suite-mvp`
- Round 1: Added initial project skeleton and requirements capture.
- Round 2: Added NVL compiler core, diagnostics, and tests.
- Round 3: Added Gemini agent orchestration, retry loop, run persistence, and skill/workflow/rules sets.
- Round 4: Added full web studio and stepwise/full pipeline APIs with log download support.
- Round 5: Added MCP stdio server set and MCP tool wrappers/tests.
- Plot validation extension: added internet-source Little Mermaid conversion fixtures, iterative compile tests, and persistent plot-validation logs.
- Antigravity compatibility: moved skills/workflows/rules under `.agent/` and added Antigravity-focused workflows/rules.
- Compiler observability: events now carry scene context; SPEAK propagates knowledge to targets; item/knowledge histories are recorded.
- AQL: added `npm run aql` and MCP tool `nvl_aql` for plot search (ownership/knowledge/clues/scenes).
- Plot validation: added a second cross-validated fixture set (*Speckled Band*) and made `plot:validate` multi-story.
