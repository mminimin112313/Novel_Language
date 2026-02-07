# NVL MCP Set

This directory provides MCP integration assets for NVL Agent Suite.

## Included tools

- `nvl_compile`: compile NVL source and return diagnostics/log.
- `nvl_aql`: run AQL query over compiled NVL state/events.
- `nvl_pipeline`: run full two-agent pipeline.
- `nvl_episode_pack`: build an EpisodePack (EpisodeSpec + compiled NVL context).
- `nvl_manuscript_lint`: deterministic lint for manuscript grounding/requirements.
- `nvl_read_run_file`: read persisted run artifact file.

## Local run

```bash
npm run mcp
```

## Example MCP client config

See `mcp/server.sample.json` and adjust absolute path.
