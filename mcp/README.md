# NVL MCP Set

This directory provides MCP integration assets for NVL Agent Suite.

## Included tools

- `nvl_compile`: compile NVL source and return diagnostics/log.
- `nvl_aql`: query compiled NVL state/events (plot search).
- `nvl_pipeline`: run full two-agent pipeline.
- `nvl_episode_pack`: build EpisodePack from EpisodeSpec (scene selection + requirements).
- `nvl_manuscript_lint`: deterministic lint for grounded drafts (citations/requirements).
- `nvl_read_run_file`: read persisted run artifact file.
- `nvl_write_novel`: run planner + chapter pipeline and produce manuscript artifacts.

## Local run

```bash
npm run mcp
```

## Example MCP client config

See `mcp/server.sample.json` and adjust absolute path.
