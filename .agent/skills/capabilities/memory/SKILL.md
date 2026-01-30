---
name: memory
description: Project Memory Capability. Index, Search, and Retrieve project knowledge using SQLite FTS.
---

# Memory Capability

This capability provides the core memory engine for the agent.

## Tools

### `memory_core.py`
The CLI tool for managing the memory database.

```bash
# Search
.agent/skills/capabilities/memory/memory_core.py search "query"

# Record
.agent/skills/capabilities/memory/memory_core.py record "content" --tags "tags"

# Update
.agent/skills/capabilities/memory/memory_core.py update <id> --content "new content"
```

## Data Storage
- Nodes: `.agent/memory/nodes/*.md` (Source of Truth)
- Index: `.agent/memory/memory_index.db` (SQLite Cache)
