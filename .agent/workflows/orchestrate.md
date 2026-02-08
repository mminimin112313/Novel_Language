---
name: nvl-orchestrate
description: End-to-end orchestration from direction to validated manuscript.
---

# Workflow: Orchestrate

Goal: run the complete novelist pipeline with deterministic guardrails.

## Steps

1. Architect phase:
   - `nvl-architect` writes/repairs NVL from direction.

2. Compile phase:
   - run `nvl_compile` repeatedly until `error` diagnostics are zero.
   - if blocked, use `nvl-aql` and `nvl-consistency-auditor`.

3. Episode/manuscript phase:
   - for episodic output: `nvl_episode_pack` -> `nvl-episode-planner` -> `nvl-episode-writer`
   - for long-form output: `nvl_write_novel` or `nvl-novel-writer`

4. Quality phase:
   - run `nvl_manuscript_lint`
   - run `nvl-korean-proofreader`
   - optional publication cleanup: `.agent/workflows/40-remove-citations.md`
