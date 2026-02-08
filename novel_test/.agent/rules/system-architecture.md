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
        SO[Series Outline]
        WB[nvl-world-builder]
        EP[nvl-episode-planner]
        BS[Beat Sheet 기승전결]
        CV[character_voices.md]
        SS[project-style.md]
    end

    subgraph Compilation["⚙️ Compilation Phase"]
        AR[nvl-architect]
        CG[nvl-compiler-guard]
        CR[compiler-rules.yaml]
    end

    subgraph Writing["✍️ Writing Phase (Split-Write-Merge)"]
        EW[nvl-episode-writer]
        NV[nvl-novelist]
        P1[part_01_기.txt]
        P2[part_02_승.txt]
        P3[part_03_전.txt]
        P4[part_04_결.txt]
        MG[_merged.txt]
    end

    subgraph Review["🔄 Review Loop"]
        RV[nvl-episode-reviewer]
        RL[revision-log.md]
        EDR[editor-review.md]
    end

    subgraph QA["🔍 Quality Assurance"]
        CA[nvl-consistency-auditor]
        KP[nvl-korean-proofreader]
        AQ[nvl-aql]
    end

    subgraph Output["📤 Output Layer"]
        NVL[.nvl Script]
        PRO[Final Manuscript]
    end

    subgraph Templates["📝 Templates"]
        T1[series-outline-template.md]
        T2[beat-sheet-template.md]
        T3[editor-review-template.md]
        T4[revision-log-template.md]
    end

    subgraph Rules["📏 Rules Layer"]
        GR[editorial-rules.md]
        PCR[nvl-compiler-guide.md]
        PSR[cyberfunk-noir-style.md]
    end

    %% Input to Planning
    UD --> SO
    UD --> WB
    WD --> WB
    SO --> EP
    EP --> BS

    %% Planning Dependencies
    WB --> |world.nvl| AR
    BS --> |arc_structure| EW
    CV --> |voice profiles| EW
    SS --> |style priority| EW

    %% Compilation Loop
    AR --> |nvl_code| CG
    CG --> |diagnostics| AR
    CG --> |success| NVL
    CR --> |rules| CG

    %% Writing Flow (Split-Write-Merge)
    NVL --> EW
    EW --> P1
    EW --> P2
    EW --> P3
    EW --> P4
    P1 --> MG
    P2 --> MG
    P3 --> MG
    P4 --> MG

    %% Review Loop
    MG --> RV
    RV --> |REVISE| EW
    RV --> |PASS| KP
    RV --> RL
    RV --> EDR

    %% QA Flow
    KP --> PRO
    NVL --> CA
    CA --> |audit_report| AR

    %% Templates Injection
    T1 -.-> SO
    T2 -.-> EP
    T3 -.-> RV
    T4 -.-> RL

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
    P0[Phase 0: Series Outline] --> P1[Phase 1: World Building]
    P1 --> P2[Phase 2: Episode Planning 기승전결]
    P2 --> P3[Phase 3: NVL Scripting]
    P3 --> P4[Phase 4: Compilation]
    P4 --> |fail| P3
    P4 --> |pass| P5[Phase 5: Split-Write-Merge]
    P5 --> P6[Phase 6: Review Loop]
    P6 --> |REVISE| P5
    P6 --> |REJECT| P2
    P6 --> |PASS| P7[Phase 7: Proofreading]
    P7 --> OUT[Final Manuscript]

    subgraph "Stop Conditions"
        S1["비트시트에 기승전결 4막"]
        S2["Cascade Compile 0 errors"]
        S3["Review PASS"]
    end
```

---

## Skill Routing Table (Updated)

| Phase | Skill | Input | Output | Rules Applied |
|:------|:------|:------|:-------|:--------------|
| 0 | (manual) | User direction | `series-outline.md` | series-outline-template |
| 1 | `nvl-world-builder` | Direction | `world.nvl` | - |
| 2 | `nvl-episode-planner` | EpisodePack, Outline | `ep{N}/beatsheet.md` | beat-sheet-template |
| 3 | `nvl-architect` | Direction + Diagnostics | `ep{N}.nvl` | compiler-guide.md |
| 4 | `nvl-compiler-guard` | NVL code | Compile log | compiler-rules.yaml |
| 5 | `nvl-episode-writer` | NVL + Beatsheet | `ep{N}/part_*.txt` | editorial-rules.md, style.md |
| 6 | `nvl-episode-reviewer` | Merged draft | Review notes | editor-review-template |
| 7 | `nvl-korean-proofreader` | Draft | Final prose | editorial-rules.md |

---

## Rules Priority (High → Low)

1. **Project-Specific** (`cyberfunk-noir-style.md`, `style.md`)
2. **Compiler Rules** (`compiler-rules.yaml`, `nvl-compiler-guide.md`)
3. **Editorial Theory** (`editorial-rules.md`)
4. **Skill SKILL.md** (per-skill instructions)

---

## Templates

| Template | Purpose | Used By |
|:---------|:--------|:--------|
| `series-outline-template.md` | 시리즈 전체 아크 기획 | Phase 0 |
| `beat-sheet-template.md` | 기승전결 비트시트 | nvl-episode-planner |
| `editor-review-template.md` | 리뷰 형식 표준화 | nvl-episode-reviewer |
| `revision-log-template.md` | 수정 이력 추적 | Review Loop |

---

## Split-Write-Merge Workflow

```
ep{N}/
├── beatsheet.md       (기승전결 비트시트)
├── part_01_기.txt     (~3-4KB, 기-도입)
├── part_02_승.txt     (~3-4KB, 승-전개)
├── part_03_전.txt     (~3-4KB, 전-전환점)
├── part_04_결.txt     (~3-4KB, 결-결말)
├── _merged.txt        (병합본)
├── review_r1.md       (리뷰 라운드 1)
└── revision-log.md    (수정 이력)
```

**Purpose**: 5KB 파일 크기 제한 대응
