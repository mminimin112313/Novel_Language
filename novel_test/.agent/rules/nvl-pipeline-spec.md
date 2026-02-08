# NVL Pipeline Architecture & Consistency Rules

## 1. Narrative Entity Relationship Diagram (ERD)

The flow of data from World Definition to Final Prose.

```mermaid
graph TD
    %% Levels
    subgraph Global_Context [World Level]
        World[world.nvl]
        Factions[Factions]
        GlobalChars[Global Characters]
        World --> Factions
        World --> GlobalChars
    end

    subgraph Planning_Level [Planning Level]
        Phase[Phase] --> Chapter[Chapter]
        Chapter --> EpisodePlan[Episode Plan (.md)]
        EpisodePlan -->|Micro-Event Breakdown| NVL_Script
    end

    subgraph Execution_Level [Execution Level]
        NVL_Script[NVL Script (.nvl)]
        Compiler[NVL Compiler]
        Prose[Prose Draft (.txt)]
        
        NVL_Script -->|Compiles| Compiler
        Compiler -->|Validates| State_Check{Consistency Check}
        State_Check -->|Pass| Prose
        State_Check -->|Fail| NVL_Script
        
        NVL_Script -.->|Source of Truth| Prose
        Prose -.->|5x Expansion| Prose_Detail[Voluminous Prose]
    end

    %% Data Relationships
    Factions -->|Used In| NVL_Script
    GlobalChars -->|Used In| NVL_Script
    
    %% Implicit additions
    Episode_Specifics[Local Entities]
    NVL_Script --> Episode_Specifics
```

## 2. Entity Management Rules

### Global Entities (world.nvl)
-   **Must** be defined in `nvl/world.nvl` if they appear in **more than one episode**.
-   **Must** have a clear role and aesthetic definition.
-   **Includes**: Factions, Major Characters, Recurring Locations.

### Local Entities (Episode Specific)
-   Can be defined within an episode script if they are **one-off** (e.g., a specific thug, a temporary item).
-   If a local entity survives and becomes recurring, it **Must** be promoted to `world.nvl` (Backporting).

### Consistency Checks
-   **Faction Audit**: Every episode must involve at least one global faction or a new local faction that fits the power dynamics.
-   **Location Tracking**: Major location hubs (Sectors) should be tracked globally.

## 3. Data Pipeline Standards
-   **Prose Expansion Ratio**: 1KB NVL Logic -> 5KB+ Prose.
-   **Micro-Event Mapping**: Every significant prose paragraph must map to a specific NVL Action or Fact.
-   **State Coherence**: Prose must not contradict the final state of the NVL compilation (e.g., if inventory has item X, prose must reflect it).
