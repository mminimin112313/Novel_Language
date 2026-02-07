# Implementation Plan v1

## Scope

Implement a production-grade MVP of NVL Agent Suite with two-agent orchestration, compiler checks, web studio, and MCP server.

## Locked Decisions

- Stack: TypeScript (Node.js server + browser web studio).
- DSL: line-oriented NVL commands for deterministic parsing.
- Retry policy: max 6 architect-repair attempts.
- Antigravity policy: `.agent/` is the default integration surface (skills/workflows/rules).
- Key policy: default workflow requires no API keys; optional API-key override supported for Gemini-backed pipeline.

## Iterative Review + Commit Policy

This project is developed in five review-and-commit rounds:

1. Foundation and requirements capture.
2. Core NVL compiler + rule engine + tests.
3. Gemini-backed two-agent orchestrator + retry logic + run artifacts.
4. Full web studio + log viewer/download.
5. MCP server + packaging + documentation hardening.

## Risks Detected Early

- LLM output schema drift -> mitigate with structured JSON schema and fallback parser.
- DSL ambiguity -> start with line-based deterministic grammar.
- Infinite retry loops -> hard cap attempts and return full diagnostics.
- API key leakage -> server-side key path preferred; UI key supported only as explicit override.
- MCP stdio corruption due stdout logs -> use stderr for operational logs.
- Plot debugging without introspection -> mitigate with event scene context + AQL query tooling.
