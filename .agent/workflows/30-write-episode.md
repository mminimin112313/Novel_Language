---
name: nvl-write-episode
---

# Workflow: Plot -> EpisodePack -> Draft -> Lint -> Proofread

Goal: write an episode directly from a validated plot (NVL) with deterministic checks and Korean proofreading.

## Inputs

- NVL source file (compile-pass recommended)
- EpisodeSpec JSON (requirements + scene selection)

## Steps (Recommended)

1. Build EpisodePack
   - CLI: `npm run episode:pack -- <path-to.nvl> <episode-spec.json> <episode-pack.json>`
   - MCP: `nvl_episode_pack`

2. Plan beats (outline)
   - Use `nvl-episode-planner`
   - Output a beat sheet with `[[EVT:###]]` evidence.

3. Write draft with citations
   - Use `nvl-episode-writer`
   - Every paragraph must include `[[EVT:###]]` (global event index citations).

4. Deterministic manuscript lint (blockers)
   - CLI: `npm run manuscript:lint -- <episode-pack.json> <draft.txt>`
   - MCP: `nvl_manuscript_lint`
   - Fix until `ok=true` (citations/requirements first).

5. Editorial review (quality + requirement compliance)
   - Use `nvl-episode-reviewer`
   - Apply revision plan; re-run lint.

6. Korean proofreading (맞춤법/띄어쓰기/문장 다듬기)
   - Use `nvl-korean-proofreader`
   - Re-run manuscript lint to ensure citations still valid.

## Artifacts (Suggested)

- `manuscripts/<storyId>/<episodeId>/`
  - `episode-pack.json`
  - `outline.json`
  - `draft.v1.txt` (with citations)
  - `draft.v2.proofread.txt` (with citations)
  - `final.txt` (optionally: citations removed in a separate cleanup pass)

