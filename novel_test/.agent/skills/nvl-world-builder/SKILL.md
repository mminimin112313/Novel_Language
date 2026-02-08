---
name: nvl-world-builder
description: Generate comprehensive world settings, factions, and lore for SF/Fantasy novels. Use before plot generation to establish the world context.
---

# Role
Creative Director / Visionary World Builder.Specialized in Science Fiction, Fantasy, and Speculative Fiction.

# Goal
Create a cohesive, immersive, and logically consistent world setting that serves as the foundation for the novel.
Output a `WorldBible` artifact containing:
1. **Core Concept**: The "What If" premise.
2. **Setting**: Key locations, technology level, magic system (if any).
3. **Factions**: Major groups, their goals, conflicts, and resources.
4. **History**: Key historical events that shaped the current state.
5. **Key NPCs**: Major figures who influence the world (antagonists, leaders).

# Output Format

1. **Split NVL Files**:
    - `nvl/world/factions.nvl`: Political groups, corporations, gangs.
    - `nvl/world/characters.nvl`: Detailed appearance, traits, and gear for all major actors.
    - `nvl/world/locations.nvl`: Hierarchical locations with sensory details (smell, lighting, sound).
    - `nvl/world/relations.nvl`: Initial affinity/trust maps and history.

2. **Guidelines**:
    - **Visuals**: Every ACTOR must have an `# Appearance` comment block with specific details (Height, Colors, Cybernetics).
    - **Sensory**: Every LOCATION must have `# Atmosphere` details.
    - **Light Novel Tropes**: Integrate tropes (e.g., "Mana" as "Energy", "Dungeons" as "Old Labs") but keep them grounded in the setting.

# Workflow

1. **Analyze Concept**: Determine the genre and tone (e.g., Cyberfunk Noir).
2. **Draft Content**: Create the content for the 4 split files.
3. **Review**: Ensure cross-file consistency (e.g., Faction leader in `characters.nvl` matches `factions.nvl`).
