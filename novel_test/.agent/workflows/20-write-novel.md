---
name: nvl-write-novel
---

# Workflow: Novel Writing (Phase/Chapter/Episode Loop)

Goal: Generate a consistent novel by iterating Series Outline → Phase → Chapter → Episode with review loops.

## Prerequisites

| 선행 조건 | 상태 |
|:----------|:-----|
| 시리즈 아웃라인 | ☐ `.agent/templates/series-outline-template.md` 사용 |
| 프로젝트 폴더 구조 | ☐ `{project}/nvl/`, `{project}/phase_XX/` |

## Phase 0: Series Outline (필수)

### 0.1 Create Series Outline
- **Template**: `.agent/templates/series-outline-template.md`
- **Output**: `{project}/series-outline.md`

포함 내용:
- 전체 시리즈 아크 (3막)
- 볼륨별 브레이크다운
- 복선/떡밥 관리표

> [!IMPORTANT]
> 시리즈 아웃라인 없이 에피소드 작성 금지

## Phase 1: World Building

### 1.1 Run World Builder
- **Skill**: `nvl-world-builder`
- **Output**: `{project}/nvl/world.nvl`

### 1.2 Compile World
```bash
npm run compile:file -- {project}/nvl/world.nvl
```
- **Stop Condition**: 0 errors

## Phase 2: Phase/Chapter Planning

### 2.1 Define Phase Arc
각 Phase(부)의 서브 아크 정의:
- Phase 목표
- 포함 Chapter 수
- 각 Chapter 핵심 사건

### 2.2 Chapter Breakdown
각 Chapter별:
- 포함 에피소드 수
- 각 에피소드 비트시트 개요

## Phase 3: Episode Execution (반복)

각 에피소드에 대해 `30-write-episode.md` 워크플로우 실행:

```
Episode Loop:
┌─────────────────────────────────────────┐
│ 1. Beat Sheet (기승전결)                 │
│ 2. NVL Scripting + Cascade Compile       │
│ 3. Split-Write-Merge                     │
│ 4. Review Loop (PASS까지 반복)           │
│ 5. Proofreading → Final                  │
└─────────────────────────────────────────┘
       ↓ 다음 에피소드
```

### Sync Rule
- 산문과 NVL이 불일치하면 **NVL 먼저 수정**
- 산문은 NVL에서 파생된 결과물

## Phase 4: Chapter/Phase Completion

### 4.1 Chapter Review
챕터 완료 시:
- 전체 에피소드 연속성 확인
- 복선 회수 현황 점검

### 4.2 Phase Milestone
Phase 완료 시:
- Phase 아크 완성도 검토
- 시리즈 아웃라인과 대조

## Output Structure

```
{project}/
├── series-outline.md          (시리즈 전체 기획)
├── nvl/
│   ├── world.nvl
│   ├── style.md
│   └── character_voices.md
├── phase_01/
│   ├── chapter_01/
│   │   ├── ep01.nvl
│   │   ├── ep01/
│   │   │   ├── beatsheet.md
│   │   │   ├── part_*.txt
│   │   │   ├── _merged.txt
│   │   │   ├── review_r1.md
│   │   │   └── revision-log.md
│   │   └── ep01_final.txt
│   │   ...
│   └── chapter_02/
│       ...
├── phase_02/
│   ...
```

## Acceptance Criteria

| 기준 | 조건 |
|:-----|:-----|
| NVL 컴파일 | 모든 에피소드 0 errors |
| 리뷰 통과 | 모든 에피소드 PASS |
| 인용 유지 | 교정 전까지 `[[EVT:###]]` 보존 |
| 아크 완성 | 기승전결 4막 존재 |
| 연속성 | 시리즈 아웃라인과 일치 |
