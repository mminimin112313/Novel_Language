# NVL Agent Suite - System Architecture

## Overview

This document defines the complete system architecture for the NVL Novel Writing Agent Suite.  
**Priority Rule**: Project-specific rules (e.g., `cyberfunk-noir-style.md`) override generic rules.

---

## System ERD (Entity Relationship Diagram)

```mermaid
flowchart TB
    subgraph Input["📥 Input Layer"]
        UD[User Direction]
        WD[World Definition]
    end

    subgraph Planning["📋 Planning Phase"]
        WB[nvl-world-builder]
        EP[nvl-episode-planner]
        CV[character_voices.md]
        SS[project-style.md]
    end

    subgraph Compilation["⚙️ Compilation Phase"]
        AR[nvl-architect]
        CG[nvl-compiler-guard]
        CR[compiler-rules.yaml]
    end

    subgraph Writing["✍️ Writing Phase"]
        EW[nvl-episode-writer]
        NV[nvl-novelist]
        ER[editorial-rules.md]
        PS[Project Style Sheet]
    end

    subgraph QA["🔍 Quality Assurance"]
        CA[nvl-consistency-auditor]
        RV[nvl-episode-reviewer]
        KP[nvl-korean-proofreader]
        AQ[nvl-aql]
    end

    subgraph Output["📤 Output Layer"]
        NVL[.nvl Script]
        PRO[.txt Prose]
        MAN[Manuscript]
    end

    subgraph Rules["📏 Rules Layer"]
        GR[editorial-rules.md]
        PCR[nvl-compiler-guide.md]
        PSR[cyberfunk-noir-style.md]
    end

    %% Input to Planning
    UD --> WB
    UD --> EP
    WD --> WB

    %% Planning Dependencies
    WB --> |world.nvl| AR
    EP --> |beat_outline| EW
    CV --> |voice profiles| EW
    SS --> |style priority| EW

    %% Compilation Loop
    AR --> |nvl_code| CG
    CG --> |diagnostics| AR
    CG --> |success| NVL
    CR --> |rules| CG

    %% Writing Flow
    NVL --> EW
    NVL --> NV
    EW --> PRO
    NV --> PRO
    ER --> EW
    ER --> NV
    PS --> EW
    PS --> NV

    %% QA Flow
    PRO --> RV
    RV --> |revision_notes| EW
    PRO --> KP
    KP --> MAN
    NVL --> CA
    CA --> |audit_report| AR

    %% Rules Injection
    GR -.-> |style theory| EW
    GR -.-> |style theory| NV
    PCR -.-> |error patterns| AR
    PSR -.-> |project aesthetic| EW
    PSR -.-> |project aesthetic| NV
```

---

## Phase Dependency Chain

```mermaid
graph LR
    P0[Phase 0: World Building] --> P1[Phase 1: Episode Planning]
    P1 --> P2[Phase 2: NVL Scripting]
    P2 --> P3[Phase 3: Compilation]
    P3 --> |fail| P2
    P3 --> |pass| P4[Phase 4: Prose Writing]
    P4 --> P5[Phase 5: Review & QA]
    P5 --> |revision| P4
    P5 --> |pass| P6[Phase 6: Proofreading]
    P6 --> OUT[Final Manuscript]

    subgraph "Rules Injection Points"
        R1[world.nvl] -.-> P0
        R2[character_voices.md] -.-> P1
        R3[project-style.md] -.-> P4
        R4[editorial-rules.md] -.-> P4
        R5[compiler-rules.yaml] -.-> P3
    end
```

---

## Skill Routing Table (Updated)

| Phase | Skill | Input | Output | Rules Applied |
|:------|:------|:------|:-------|:--------------|
| 0 | `nvl-world-builder` | User direction | `world.nvl` | - |
| 1 | `nvl-episode-planner` | EpisodePack | `epXX_plan.md` | character_voices.md |
| 2 | `nvl-architect` | Direction + Diagnostics | `epXX.nvl` | compiler-guide.md |
| 3 | `nvl-compiler-guard` | NVL code | Compile log | compiler-rules.yaml |
| 4 | `nvl-episode-writer` | NVL + Plan | `epXX.txt` | editorial-rules.md, project-style.md |
| 4 | `nvl-novelist` | Compile log | Prose | editorial-rules.md, project-style.md |
| 5 | `nvl-episode-reviewer` | Draft | Review notes | editorial-rules.md |
| 5 | `nvl-consistency-auditor` | NVL | Audit report | - |
| 6 | `nvl-korean-proofreader` | Draft | Final prose | editorial-rules.md |

---

## Rules Priority (High → Low)

1. **Project-Specific** (`cyberfunk-noir-style.md`)
2. **Compiler Rules** (`compiler-rules.yaml`, `nvl-compiler-guide.md`)
3. **Editorial Theory** (`editorial-rules.md`)
4. **Skill SKILL.md** (per-skill instructions)

---

## Integration Points

### Style Sheet Integration
```
nvl-episode-writer/SKILL.md
└── Line 27: "Genre: Noir / Cyberpunk / Gritty"
    └── NOW REFERENCES: rules/cyberfunk-noir-style.md
```

### Character Voice Integration
```
nvl-episode-planner/SKILL.md
└── Beat outline generation
    └── NOW LOADS: cyberfunk noir/nvl/character_voices.md
```

### Pacing Metrics Integration
```
nvl-compiler-guide.md
└── Event Density Mandate
    └── NOW INCLUDES: Prose pacing targets (words per scene type)
```
