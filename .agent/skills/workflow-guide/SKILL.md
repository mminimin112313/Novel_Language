---
name: workflow-guide
description: Route novel-writing tasks to the correct Antigravity workflow with publishing industry structure. Includes planning-writing-review loop.
---

# Purpose

Select the minimal safe workflow for the current request and hand off to specialized skills following publishing industry standards.

# Publishing Industry Flow

```
시리즈 아웃라인 → 볼륨 기획 → 에피소드 비트시트 → NVL 스크립팅
    ↓
[Writer Phase]
    ↓
Cascade Compile → 초안 작성 → 자체 점검
    ↓
[Editor Phase]
    ↓
편집자 리뷰 → 수정 → 재리뷰 (통과까지 반복)
    ↓
[Proofreader Phase]
    ↓
교정 → 최종본
```

# Routing Table

| 상황 | 워크플로우 | 스킬 체인 |
|:-----|:-----------|:----------|
| **1. 셋업/환경** | `workflows/00-setup.md` | - |
| **2. 새 프로젝트** | (순차 실행) | Series Outline → World Builder |
| **3. 월드 빌딩** | `workflows/10-plot-compile.md` | `nvl-world-builder` |
| **4. 에피소드 기획** | `workflows/plan.md` | `nvl-episode-planner` |
| **5. 에피소드 작성** | `workflows/30-write-episode.md` | (아래 참조) |
| **6. 전체 소설** | `workflows/20-write-novel.md` | `nvl-novel-writer` |
| **7. 디버그/오류** | `workflows/debug.md` | `nvl-compiler-guard`, `nvl-aql` |

# Episode Writing Workflow (Detail)

## Phase 1: Planning
1. **시리즈 아웃라인 확인** (없으면 먼저 작성)
2. **비트시트 작성** → `nvl-episode-planner`
   - 기승전결 4막 구조 필수
   - 50+ 이벤트 매핑
3. **비트시트 저장** → `ep{N}_beatsheet.md`

## Phase 2: Scripting
1. **NVL 스크립팅** → `nvl-architect`
   - APPEAR 명령으로 씬별 등장인물
2. **Cascade Compile** → `npm run compile:cascade`
   - 0 errors 확인

## Phase 3: Writing (Split-Write-Merge)

> **중요**: 5KB 파일 크기 제한으로 인해 분할 작성 필수

### 폴더 구조
```
ep{N}/
├── beatsheet.md       (비트시트)
├── part_01_기.txt     (기-도입)
├── part_02_승.txt     (승-전개)
├── part_03_전.txt     (전-전환점)
├── part_04_결.txt     (결-결말)
├── _merged.txt        (병합본)
└── revision-log.md    (수정 이력)
```

### 작성 순서
1. **에피소드 폴더 생성** → `ep{N}/`
2. **파트별 작성** (각 ~3-4KB):
   - `part_01_기.txt` ← 기승전결 중 '기'
   - `part_02_승.txt` ← '승'
   - `part_03_전.txt` ← '전'
   - `part_04_결.txt` ← '결'
3. **각 파트 리뷰** → 파트별 점검
4. **병합** → `_merged.txt`

### 파트 작성 규칙
| 파트 | 목표 글자 수 | 비트 수 |
|:-----|:-------------|:--------|
| part_01_기 | 3,000-4,000 | 3개 (hook, setup, inciting) |
| part_02_승 | 3,500-4,500 | 3개 (reaction, attempt, obstacle) |
| part_03_전 | 3,000-4,000 | 3개 (crisis, turn, decision) |
| part_04_결 | 2,500-3,500 | 3개 (climax, resolution, hook_forward) |

### 병합 명령
```bash
cat ep{N}/part_*.txt > ep{N}/_merged.txt
```

## Phase 4: Review Loop
```
┌─────────────────────────┐
│ nvl-episode-reviewer    │
│ (PASS / REVISE / REJECT)│
└───────────┬─────────────┘
            │
    ┌───────┼───────┐
    │ PASS  │REVISE │REJECT
    │       │       │
    ↓       ↓       ↓
 Phase 5  수정 후   Phase 1로
          재리뷰    되돌아감
```

1. **리뷰 요청** → `nvl-episode-reviewer`
2. **리뷰 저장** → `ep{N}/review_r{round}.md`
3. **판정에 따라**:
   - PASS → Phase 5
   - REVISE → 해당 파트만 수정 후 재리뷰
   - REJECT → 비트시트부터 재작성
4. **리비전 로그 업데이트** → `ep{N}/revision-log.md`

## Phase 5: Proofreading
1. **교정** → `nvl-korean-proofreader` (병합본 대상)
2. **최종본 저장** → `ep{N}_final.txt`


# Context Loading (모든 작성 스킬 공통)

순서대로 로드:
1. **시리즈 아웃라인** (있다면)
2. **`world.nvl`**
3. **이전 에피소드 NVL**
4. **프로젝트 `style.md`**
5. **`character_voices.md`**
6. **`editorial-rules.md`** (낮은 우선순위)

**Priority**: 프로젝트 스타일 > 비트시트 > 일반 이론

# Templates

| 템플릿 | 용도 |
|:-------|:-----|
| `templates/series-outline-template.md` | 시리즈 전체 기획 |
| `templates/beat-sheet-template.md` | 에피소드 비트시트 |
| `templates/editor-review-template.md` | 편집자 리뷰 형식 |
| `templates/revision-log-template.md` | 수정 이력 추적 |

# Output Contract

모든 라우팅 응답에 포함:
1. 선택된 워크플로우 경로
2. 스킬 체인
3. 정지 조건 (다음 단계 진입 전 통과해야 할 것)
4. 필요한 템플릿

# Stop Conditions

| 단계 | 정지 조건 |
|:-----|:----------|
| Planning → Scripting | 비트시트에 기승전결 4막 존재 |
| Scripting → Writing | Cascade Compile 0 errors |
| Writing → Review | 초안 저장 완료 |
| Review → Next | PASS 판정 |
| Proofreading → Done | 문법/맞춤법 오류 0 |
