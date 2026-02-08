---
name: nvl-aql
description: Query compiled NVL state/events using AQL to search plot facts (who owns what, who knows what, unresolved clues, etc.). Use for plot debugging and consistency audits.
---

# What This Skill Is For

Use AQL to answer questions like:

- "지금 살아있는 인물은 누구인가?"
- "이 아이템의 소유권 변동 내역은?"
- "A가 B에게 어떤 사실을 말한 뒤 B가 그 사실을 알게 되었는가?"
- "해결되지 않은 복선(Clue)은 무엇인가?"

# Commands

Run AQL from the CLI:

```bash
npm run aql -- tests/plot/little-mermaid/attempt-03-compile-pass.nvl "SELECT name, status, location FROM Actors WHERE status = 'Alive'"
npm run aql -- tests/plot/little-mermaid/attempt-03-compile-pass.nvl "TRACE OWNERSHIP OF 'Dagger'"
npm run aql -- tests/plot/little-mermaid/attempt-03-compile-pass.nvl "SELECT actor, fact, kind, sourceActor FROM Knowledge"
npm run aql -- tests/plot/little-mermaid/attempt-03-compile-pass.nvl "SELECT id, state, due FROM Clues WHERE state = 'Active'"
```

Or via MCP tool:

- `nvl_aql` with `{ "source": "<nvl source>", "query": "<AQL>" }`

# Notes

- AQL runs even if compilation fails; results may be partial. Fix `error` diagnostics first for reliable queries.

