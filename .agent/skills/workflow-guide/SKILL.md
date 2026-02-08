---
name: workflow-guide
description: Route novel-writing tasks to the correct Antigravity workflow and skill chain.
---

# Purpose

Select the minimal safe workflow for the current request and hand off to specialized skills.

# Routing Rules

1. Setup or broken environment:
   - use `.agent/workflows/setup.md`
   - then run `npm run setup:doctor`

2. Plot to compile loop:
   - use `.agent/workflows/10-plot-compile.md`
   - skills: `nvl-architect` -> `nvl-compiler-guard`

3. Episode writing (Phase/Chapter Structure):
   - use `.agent/workflows/30-write-episode.md`
   - skills: `nvl-episode-planner` -> `nvl-episode-writer` -> `nvl-episode-reviewer` -> `nvl-korean-proofreader`
   - **Crucial**: Ensure World NVL files (`factions.nvl`, `characters.nvl` etc) are updated FIRST if new elements are introduced.

4. Full novel writing:
   - use `.agent/workflows/20-write-novel.md`
   - skill: `nvl-novel-writer`
   - **Crucial**: Iterate Phase by Phase. Do not generate 100 chapters at once.

5. Failure or inconsistency:
   - use `.agent/workflows/debug.md` and `.agent/workflows/review.md`
   - skills: `nvl-compiler-guard`, `nvl-aql`, `nvl-consistency-auditor`

# Output Contract

Always return:

- chosen workflow path
- chosen skill chain
- stop condition (what must pass before next stage)
