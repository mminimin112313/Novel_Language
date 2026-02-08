# Lessons Learned Log

Record recurring mistakes and durable fixes.

## Template

- date:
- story/project:
- issue:
- root cause:
- deterministic check added:
- prevention rule:

## Current Entries

- date: 2026-02-08
- story/project: repo setup
- issue: absolute MCP `cwd` broke clone portability
- root cause: machine-specific config was committed
- deterministic check added: `npm run setup:doctor` (`mcp-cwd` check)
- prevention rule: keep `.agent/mcp.json` `cwd` as `.`
