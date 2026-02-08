# Implementation Plan v1

## Scope

Implement a production-grade MVP of NVL Agent Suite with deterministic compiler checks, plot search (AQL), episode packaging (EpisodePack), manuscript lint, web studio, and MCP server for Antigravity/editor integration.

## Locked Decisions

- Stack: TypeScript (Node.js server + browser web studio).
- DSL: line-oriented NVL commands for deterministic parsing.
- Retry policy: max 6 architect-repair attempts.
- LLM policy: Antigravity runtime drives prose generation; repository code does not require API keys.

## Iterative Review + Commit Policy

This project is developed in five review-and-commit rounds:

1. Foundation and requirements capture.
2. Core NVL compiler + rule engine + tests.
3. Antigravity-first agent suite + deterministic tooling (AQL/EpisodePack/lint) + run artifacts.
4. Full web studio + log viewer/download.
5. MCP server + packaging + documentation hardening.

## Risks Detected Early

- LLM hallucination / fact drift -> mitigate with compile-pass logs + `[[EVT:###]]` citations + deterministic manuscript lint.
- DSL ambiguity -> start with line-based deterministic grammar.
- Infinite retry loops -> hard cap attempts and return full diagnostics.
- MCP stdio corruption due stdout logs -> use stderr for operational logs.
