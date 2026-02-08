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

# Style Loading (Mandatory)

Before writing, load these files in order:
1. `.agent/rules/cyberfunk-noir-style.md` → Project aesthetic, forbidden expressions
2. `cyberfunk noir/nvl/character_voices.md` → Character voice profiles
3. `.agent/rules/editorial-rules.md` → General writing theory

**Priority**: Project style overrides editorial theory.

# Writing Rules (Hard Constraints)

1. **Source of Truth**: NVL is the single source of truth.
2. **Expansion Ratio (Critical)**:
    - Prose MUST be at least **5x the length of NVL code**.
    - If NVL is 3KB, Prose must be 15KB+.
    - **How to Expand**:
        - Every NVL `ACTION` must be broken down into 5-10 micro-actions or thoughts.
        - Example: `ACTION USE Gun` -> Clean barrel, check rust, feel the weight, remember where he bought it, fail to load a round, curse the humidity.
3. **Style**:
    - **Genre**: Noir / Cyberpunk / Gritty.
    - **Pacing**: Slow burn. Focus on atmosphere and sensory details (smell, sound, texture) over fast action.
    - **Language**: Natural Korean prose. Avoid translationese (e.g., avoid "He had a sad face", use "He stared blankly at the rain").
3. **Scene Design (Goal-Conflict-Change)**:
    - Every scene must have a **Goal** (What Jack wants), a **Conflict** (Who stops him), and a **Change** (Value shift: detailed -> messy, safe -> dangerous).
    - If a scene feels flat, check if the **Conflict** is missing.

4. **Show, Don't Tell (Verified)**:
    - **Forbidden**: "Jack was sad", "The room was scary", "He felt angry".
    - **Required**: "Jack stared at the rain until his eyes burned", "The shadows stretched like clawed hands", "He holstered the gun with a sharp click".
    - **Internal Monologue**: Use first-person thought for Noir atmosphere.

5. **Visual Consistency**:
    - Describe characters EXACTLY as defined in `world/characters.nvl`.

6. **Citation**:
    - Every paragraph MUST include `[[EVT:###]]` citations.

