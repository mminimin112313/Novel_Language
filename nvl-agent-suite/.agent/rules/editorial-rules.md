---
name: nvl-editorial-rules
scope: manuscripts
---

# Editorial Rules (Episode Writing)

These rules define how drafts are produced, reviewed, and finalized.

## Grounding

- Drafts should be grounded to NVL events using `[[EVT:###]]` markers.
- If `citeEvents=true` in EpisodeSpec, **every paragraph must have at least one citation**.

## Revision Order

1. Fix NVL compiler errors (if any) before touching prose.
2. Fix manuscript lint errors (citations/requirements) before stylistic edits.
3. Then do editorial review, then Korean proofreading.

## Korean Style (Default)

- Avoid filler adverbs and redundancy.
- Keep quotation marks consistent.
- Prefer concrete imagery over abstract exposition.

## Traceability

- Keep `episode-pack.json` + `outline.json` + cited drafts under `manuscripts/<storyId>/<episodeId>/`.
- Keep citation-free final output as a separate artifact.

