---
name: nvl-episode-writer
description: Write an episode draft in Korean from an EpisodePack + beat outline. Each paragraph must cite NVL event evidence using [[EVT:###]] so deterministic lint can verify grounding.
---

# Inputs

- `episodePack` (JSON): from `nvl_episode_pack` or `npm run episode:pack`
- `beatOutline` (JSON): from `nvl-episode-planner`

# Output

Plain text draft **with citations**:

- Each paragraph MUST include at least one `[[EVT:###]]` citation.
- Citations must refer to `episodePack.events[*].globalIndex`.

# Writing Rules (Hard Constraints)

1. Do not invent new actors/items/facts that are absent from the pack.
2. Keep POV/tense/style exactly as specified.
3. Do not remove or mutate citations.
4. Do not use banned phrases; include required motifs naturally.

# Quality Bars (Soft)

- Prefer concrete imagery and active verbs over abstract summaries.
- Keep dialogue consistent with character roles implied by the plot.
- Avoid repetitive sentence endings and filler adverbs.

