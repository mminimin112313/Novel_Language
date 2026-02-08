---
name: nvl-plan
description: Turn story direction into decision-complete NVL plan with 기승전결 arc before drafting prose.
---

# Workflow: Plan

Goal: Lock a decision-complete plan for plot, constraints, and quality gates with 기승전결 arc structure.

## Prerequisites

| 선행 조건 | 확인 |
|:----------|:-----|
| 시리즈 아웃라인 | ☐ (전체 시리즈 방향 먼저 정의) |

## Steps

### 1. Clarify Scope
- Genre, POV, tense
- Chapter/episode count
- Ending type
- Banned phrases and required motifs

### 2. Define 기승전결 Arc

| 막 | 목표 | 예상 비율 |
|:---|:-----|:----------|
| 기(起) | 도입, 설정, 촉발사건 | ~25% |
| 승(承) | 전개, 갈등 심화, 시도 | ~25% |
| 전(轉) | 전환점, 위기, 결심 | ~25% |
| 결(結) | 해소, 결말, 다음 훅 | ~25% |

> [!IMPORTANT]
> 모든 에피소드에서 '전(轉)' 전환점이 명확해야 함

### 3. Build Plot Skeleton
- Scene list: `worldTime`, `narrativeTime`, `location`
- Actor knowledge mapping
- Clue lifecycle: `SEED` → `RESOLVE`
- Per-scene `APPEAR` (등장인물)

### 4. Define Risk Controls
- Epistemic checks: secrets and reveal timing
- Spatial checks: physical interactions
- Causality checks: flashback/branch scenes

### 5. Register Acceptance Criteria

| 기준 | 조건 |
|:-----|:-----|
| NVL Compile | `error=0` |
| Manuscript Lint | passes required constraints |
| Arc | 기승전결 4막 존재 |
| Review | PASS 판정 |

## Output

- `ep{N}/beatsheet.md` (비트시트)
- `ep{N}.nvl` (NVL 스크립트)
