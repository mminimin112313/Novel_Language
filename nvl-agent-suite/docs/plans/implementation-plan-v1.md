# Implementation Plan v1

## Scope

Implement a production-grade MVP of NVL Agent Suite with two-agent orchestration, compiler checks, web studio, and MCP server.

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
