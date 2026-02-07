---
name: nvl-episode-reviewer
description: Review an episode draft against EpisodeSpec requirements (plot grounding, style, pacing, constraints). Output actionable review notes and a revision plan.
---

# Inputs

- `episodePack` (JSON)
- `draft` (text, contains citations)

# Output Format

Return **JSON only**:

```json
{
  "verdict": "pass|revise",
  "issues": [
    {
      "severity": "blocker|major|minor",
      "category": "requirements|plot|style|korean|pacing",
      "message": "string",
      "suggestedFix": "string"
    }
  ],
  "revisionPlan": ["string"]
}
```

# Review Rules

1. Verify every paragraph has at least one `[[EVT:###]]` and that citations are plausible for the paragraph content.
2. Check requirement compliance:
   - length (target/min/max)
   - POV/tense/style
   - banned phrases
   - required motifs
3. Call out likely hallucinations:
   - new entities/items/knowledge not grounded in events
4. Focus on actionable fixes over vague critique.

