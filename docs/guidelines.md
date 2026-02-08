# Cyberfunk Noir: Narrative Guidelines

## 1. Atmosphere & Density (The 15KB Rule)
The world of Cyberfunk Noir is **dense**, **messy**, and **alive**.
- **The 5x Rule**: One line of NVL code = One paragraph of prose.
- **Never Empty**: A street is never just a street. It's a "labyrinth of wet cardboard, neon reflections, and the smell of synthetic pork."
- **Micro-Events**: The world doesn't wait for the protagonist.
  - A drone crashes nearby.
  - A junkie argues with a vending machine.
  - The lights flicker in Morse code.
- **Sensory Overload**: Describe the *smell* of ozone, the *taste* of metal in the air, the *sound* of distant sirens constantly.

## 2. Dialogue (The "Tiki-Taka")
Dialogue is the soul of Noir. It should be sharp, cynical, and laden with subtext.
- **No Direct Answers**:
  - Q: "Did you find him?"
  - A: "I found his arm. The rest is probably in a sewer somewhere."
- **Action Beats**:
  - Don't just stand and talk.
  - *Jack polished his revolver.*
  - *Elara nervously tapped her cyber-eye.*
- **Chemistry**:
  - Jack and Goro: Old friends who hate each other's habits. (Grudging respect).
  - Jack and Elara: Cynic vs. Naive Elite. (Clash of worlds).

## 3. Pacing
**Slow Down.**
- Don't rush from Point A to Point B.
- The journey *is* the story.
- If Jack makes a coffee, describe the grinder jamming, the water being too cold, the taste being bitter sludge. This builds character (he's poor, tired, and used to disappointment).

## 4. Korean Nuance
- Avoid "Translationese" (번역투).
- Use natural Korean sentence endings and rhythms suitable for a gritty novel.
- "젠장(Damn it)" is okay, but "빌어먹을 시궁창(Fucking gutter)" is better.

## 5. Context Loading (Critical for Antigravity)

Before writing ANY new episode, the agent MUST load:
1. **Series Outline** (`series-outline.md`) → Global arc awareness
2. **`world.nvl`** → Global actors, factions, locations, initial relations
3. **Prior episode NVL files** → Cumulative state
4. **`character_voices.md`** → Voice profiles for dialogue consistency
5. **Project Style Sheet** (e.g., `style.md`) → Aesthetic constraints

**Priority Order**: Project style > Editorial theory > Skill defaults

## 6. Writing Workflow (Split-Write-Merge)

Due to 5KB context limits, episodes are written in parts:
1. **Planning**: `nvl-episode-planner` creates a **Beat Sheet** with 기승전결(Intro, Development, Turn, Conclusion).
2. **Scripting**: `nvl-architect` writes NVL and compiles with 0 errors.
3. **Writing**: `nvl-episode-writer` drafts `part_01` to `part_04` separately.
4. **Merging**: Parts are merged into `_merged.txt` for review.
5. **Review**: `nvl-episode-reviewer` checks against the Beat Sheet and Style.
6. **Proofreading**: `nvl-korean-proofreader` polishes the merged draft.

See `.agent/rules/system-architecture.md` for the full ERD.
