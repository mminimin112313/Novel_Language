---
name: nvl-episode-planner
description: Plan an episode (beat sheet + scene/paragraph plan) from an EpisodePack. Output a structured outline that explicitly maps beats to NVL events (by [[EVT:###]] citations).
---

# Inputs

- `episodePack` (JSON): produced by `nvl_episode_pack` MCP tool or `npm run episode:pack`

# Output Format

Return **JSON only**:

```json
{
  "beats": [
    {
      "title": "string",
      "intent": "string",
      "targetChars": 800,
      "evidence": ["[[EVT:002]]", "[[EVT:005]]"]
    }
  ],
  "constraints": {
    "pov": "first_person|third_person_limited|omniscient",
    "tense": "past|present",
    "style": "Cinematic|Noir|Classic|LightNovel"
  },
  "notes": ["string"]
}
```

# Planning Rules

1. Use only facts present in `episodePack.events`, `episodePack.actors`, and `episodePack.clues`.
2. Every beat MUST include at least one `evidence` citation that exists in the pack (`globalIndex`-based `[[EVT:###]]`).
3. Respect `episodePack.spec.requirements`:
   - `requiredMotifs` should appear across beats (not all in one paragraph).
   - Avoid `bannedPhrases`.
   - Stay near `targetChars` (or within min/max).
4. Prefer clear cause->effect sequencing; do not rearrange events unless the spec explicitly requests flashback.

