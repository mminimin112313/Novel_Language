---
name: nvl-tools
description: MCP tool routing table for Antigravity operations.
---

# Workflow: Tools Map

Use this table to select the correct MCP tool quickly.

| Intent | MCP Tool | Expected Output |
|---|---|---|
| Plot compile | `nvl_compile` | diagnostics + event log |
| Plot query/search | `nvl_aql` | SQL-like query result |
| Two-agent loop run | `nvl_pipeline` | run metadata + compile status |
| Episode context pack | `nvl_episode_pack` | EpisodePack JSON |
| Draft lint | `nvl_manuscript_lint` | deterministic lint report |
| Artifact read | `nvl_read_run_file` | file content |
| Long-form generation | `nvl_write_novel` | chapter/manuscript artifacts |
