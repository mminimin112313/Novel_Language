# Antigravity Baseline Setup

This document locks the default setup for running this repository with Antigravity while keeping plot consistency checks deterministic.

## 1) Baseline (Web-Verified)

As of February 8, 2026, the verified baseline is:

1. Install and launch Antigravity Desktop.
2. Open the MCP panel from the main UI.
3. Configure MCP servers from the built-in MCP Store, or add custom servers from raw config.

For custom MCP config, the documented UI path is:

- `...` -> `MCP Servers` -> `Manage MCP Servers` -> `View raw mcp.json`

## 2) Repository Structure (Project Default)

Keep this repository layout fixed:

- `AGENTS.md`: bootstrap + quality gate rules.
- `.agent/`: role definitions (`*.agent.yaml`) for orchestrated agent behavior.
- `.agent/skills/`: reusable task skills (authoring, consistency, proofreading, AQL).
- `.agent/workflows/`: end-to-end runbooks (setup, plot compile, episode writing).
- `.agent/rules/`: deterministic policy/rule docs.
- `src/`: compiler, query, episode pack, lint, MCP server, web server.
- `tests/plot/`: real plot fixtures and iterative correction attempts.
- `logs/plot-validation/`: persisted compile diagnostics by attempt.

## 3) Local Hygiene

Generated local artifacts should stay untracked:

- `.runs/`
- `novels/`
- `logs/novel-writing/`

`logs/plot-validation/` is intentionally versioned for reproducibility.

## 3.1) Setup Doctor (Required Before Writing)

Run:

- `npm run setup:doctor`

This command validates:

- clone-portable MCP configuration
- `.agent` structure completeness
- required npm scripts and plot fixtures

## 4) Source Reliability

- Official (high confidence): Google Cloud Antigravity docs + Google Developers Blog.
- Community (supporting): antigravity.im documentation for repo-level customization patterns (`.agent/rules`, `.agent/workflows`, `.agent/skills`).

## 5) External References

- Google Cloud, "Connect with Antigravity" (MCP setup and UI flow): https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/use/antigravity
- Google Developers Blog, "Simplifying secure MCP server integration with Antigravity": https://developers.googleblog.com/simplifying-secure-mcp-server-integration-with-antigravity/
- Antigravity community docs (supporting structure patterns): https://antigravity.im/documentation
