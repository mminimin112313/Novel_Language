---
name: nvl-write-episode
---

# Workflow: Episode Writing (Split-Write-Merge)

Goal: Write an episode with 기승전결 arc, deterministic checks, review loop, and proofreading.

## Prerequisites

| 선행 조건 | 상태 |
|:----------|:-----|
| 시리즈 아웃라인 | ☐ (없으면 먼저 작성) |
| `world.nvl` 컴파일 통과 | ☐ |
| 이전 에피소드 존재 (있다면) | ☐ |

## Phase 1: Planning

### 1.1 Build EpisodePack
```bash
npm run episode:pack -- <path-to.nvl> <episode-spec.json> <episode-pack.json>
```
Or MCP: `nvl_episode_pack`

### 1.2 Create Beat Sheet (기승전결 필수)
- **Skill**: `nvl-episode-planner`
- **Template**: `.agent/templates/beat-sheet-template.md`
- **Output**: `ep{N}/beatsheet.md`

> [!IMPORTANT]
> 기승전결 4막 모두 정의해야 다음 단계 진행 가능

## Phase 2: Scripting

### 2.1 Write NVL Script
- **Skill**: `nvl-architect`
- Use `APPEAR` for per-scene character tracking
- **Output**: `ep{N}.nvl`

### 2.2 Cascade Compile
```bash
npm run compile:cascade -- "{project}" phase_XX/chapter_XX/ep{N}.nvl
```
- **Stop Condition**: 0 errors

## Phase 3: Writing (Split-Write-Merge)

> **중요**: 5KB 제한으로 인해 분할 작성 필수

### 3.1 Create Episode Folder
```bash
mkdir -p phase_XX/chapter_XX/ep{N}
```

### 3.2 Part-by-Part Writing
| 파트 | 파일 | 비트 | 글자 수 |
|:-----|:-----|:-----|:--------|
| 기 | `part_01_기.txt` | hook, setup, inciting | 3,000-4,000 |
| 승 | `part_02_승.txt` | reaction, attempt, obstacle | 3,500-4,500 |
| 전 | `part_03_전.txt` | crisis, turn, decision | 3,000-4,000 |
| 결 | `part_04_결.txt` | climax, resolution, hook_forward | 2,500-3,500 |

- **Skill**: `nvl-episode-writer`
- Each part must include `[[EVT:###]]` citations

### 3.3 Merge
```bash
cat ep{N}/part_*.txt > ep{N}/_merged.txt
```

## Phase 4: Review Loop

### 4.1 Manuscript Lint
```bash
npm run manuscript:lint -- <episode-pack.json> <_merged.txt>
```
- Fix until `ok=true`

### 4.2 Editorial Review
- **Skill**: `nvl-episode-reviewer`
- **Template**: `.agent/templates/editor-review-template.md`
- **Output**: `ep{N}/review_r{round}.md`

| 판정 | 조치 |
|:-----|:-----|
| PASS | Phase 5로 진행 |
| REVISE | 해당 파트만 수정 → 재리뷰 |
| REJECT | Phase 1 비트시트부터 재작성 |

### 4.3 Update Revision Log
- **Template**: `.agent/templates/revision-log-template.md`
- **Output**: `ep{N}/revision-log.md`

## Phase 5: Proofreading

### 5.1 Korean Proofreading
- **Skill**: `nvl-korean-proofreader`
- **Input**: `ep{N}/_merged.txt`
- **Output**: `ep{N}/proofread.txt`

### 5.2 Remove Citations
```bash
sed 's/\[\[EVT:[0-9]*\]\]//g' ep{N}/proofread.txt > phase_XX/chapter_XX/ep{N}_final.txt
```

## Artifacts (Final Structure)

```
phase_XX/chapter_XX/
├── ep{N}.nvl              (NVL 스크립트)
├── ep{N}/
│   ├── beatsheet.md       (비트시트)
│   ├── part_01_기.txt
│   ├── part_02_승.txt
│   ├── part_03_전.txt
│   ├── part_04_결.txt
│   ├── _merged.txt
│   ├── review_r1.md
│   ├── proofread.txt
│   └── revision-log.md
└── ep{N}_final.txt        (최종본, 인용 제거)
```
