---
name: nvl-episode-writer
description: Write an episode draft in Korean from EpisodePack + beat outline. Must follow 기승전결 arc, include transitions, and cite NVL events.
---

# Prerequisites

| 선행 작업 | 상태 |
|:----------|:-----|
| 비트시트 완성 | ☐ `ep{N}_beatsheet.json` 존재 |
| 기승전결 확인 | ☐ 4막 모두 정의됨 |
| 스타일 로드 | ☐ 프로젝트 style.md 확인 |
| 음성 프로필 로드 | ☐ character_voices.md 확인 |

# Context Loading (필수)

순서대로 로드:
1. **비트시트** → `ep{N}_beatsheet.json` (arc_structure 섹션)
2. **프로젝트 스타일** → `{project}/nvl/style.md`
3. **캐릭터 음성** → `{project}/nvl/character_voices.md`
4. **editorial-rules.md** → 일반 문장론 (낮은 우선순위)

**Priority**: 프로젝트 스타일 > 비트시트 > 캐릭터 음성 > 일반 이론

# Inputs

- `episodePack` (JSON): from `nvl_episode_pack`
- `beatSheet` (JSON): from `nvl-episode-planner` (필수)

# Output

Plain text draft **with citations**:
- 모든 문단에 `[[EVT:###]]` 인용 필수
- 인용은 `episodePack.events[*].globalIndex` 기반

# Arc-Aware Writing (기승전결)

## 파트별 톤 가이드

| 파트 | 톤 | 문장 길이 | 페이싱 |
|:-----|:---|:----------|:-------|
| **기(起)** | 호기심, 설정 | 중간 | 느림 (분위기 조성) |
| **승(承)** | 긴장 상승, 몰입 | 다양 | 점진적 가속 |
| **전(轉)** | 충격, 전환 | 짧음 | 빠름 → 멈춤 |
| **결(結)** | 해소, 여운 | 중간~김 | 느림 (감정 여운) |

## 전환 문장 패턴

### 씬 간 전환
```
# 부드러운 전환
...했다.
그리고 [시간/공간 전환 힌트].
[새로운 씬 시작]

# 날카로운 전환 (전환점에서)
...—
[드라마틱 단절]
[새로운 상황]
```

### 파트 간 전환

| 전환 | 패턴 |
|:-----|:-----|
| 기→승 | 균형 깨짐, "그때—" |
| 승→전 | 위기 최고조, "하지만" |
| 전→결 | 결심 후 행동, "마침내" |

# Writing Rules (Hard Constraints)

## 1. Source of Truth
- NVL이 유일한 사실 소스
- NVL에 없는 사실 추가 금지

## 2. Expansion Ratio (필수)
- 산문은 NVL의 **5배** 이상
- NVL 3KB → 산문 15KB+
- 모든 `ACTION`을 5-10개 마이크로 액션으로 분해

```
# Bad
잭이 총을 꺼냈다.

# Good
잭의 손이 코트 안쪽으로 들어갔다. 
차가운 금속 감촉. 
손잡이를 쥐었다. 무게감.
천천히 끌어올렸다.
총구가 빛을 받아 번졌다.
그제야 숨을 내쉬었다.
```

## 3. Show, Don't Tell

| 금지 | 대안 |
|:-----|:-----|
| "슬펐다" | "눈가가 뜨거워졌다" |
| "무서웠다" | "등에 식은땀이 흘렀다" |
| "화가 났다" | "이를 악물었다" |

## 4. 캐릭터 음성 일관성

| 체크 | 항목 |
|:-----|:-----|
| ☐ | 대사가 캐릭터 프로필과 일치 |
| ☐ | 내면 독백 톤이 캐릭터에 맞음 |
| ☐ | 말투 특징이 반영됨 |

## 5. 감각 묘사 (Sensory Details)

각 씬에 최소 3가지 감각:
- 시각 (색, 빛, 움직임)
- 청각 (소리, 침묵)
- 촉각/후각/미각

## 6. Citation (필수)

```
# 형식
...문장. [[EVT:023]]

# 여러 이벤트
...문장. [[EVT:023]] [[EVT:024]]
```

# Quality Checklist

| ☐ | 항목 |
|:--|:-----|
| ☐ | 기승전결 4막 톤 차이가 느껴짐 |
| ☐ | 씬 간 전환이 자연스러움 |
| ☐ | 전환점(전)이 충격적임 |
| ☐ | 모든 문단에 EVT 인용 있음 |
| ☐ | 5x expansion ratio 충족 |
| ☐ | Show, don't tell 준수 |
| ☐ | 캐릭터 음성 일관됨 |
| ☐ | 감각 묘사 풍부 |

# Post-Writing Actions

## Split-Write-Merge (5KB 제한 대응)

> **중요**: 한 번에 전체 에피소드 생성 금지. 파트별 분할 작성 필수.

### 폴더 구조
```
ep{N}/
├── beatsheet.md       (비트시트)
├── part_01_기.txt     (~3-4KB)
├── part_02_승.txt     (~3-4KB)
├── part_03_전.txt     (~3-4KB)
├── part_04_결.txt     (~3-4KB)
├── _merged.txt        (병합본)
└── revision-log.md    (수정 이력)
```

### 작성 순서
1. **ep{N}/ 폴더 생성**
2. **비트시트 복사** → `ep{N}/beatsheet.md`
3. **part_01_기.txt 작성** ← 기승전결 중 '기' 비트만
4. **part_02_승.txt 작성** ← '승' 비트만
5. **part_03_전.txt 작성** ← '전' 비트만
6. **part_04_결.txt 작성** ← '결' 비트만
7. **병합**: `cat part_*.txt > _merged.txt`
8. **리뷰 요청** → `nvl-episode-reviewer` (병합본 대상)

### 파트별 글자 수 가이드

| 파트 | 비트 | 목표 글자 수 |
|:-----|:-----|:-------------|
| part_01_기 | hook, setup, inciting | 3,000-4,000 |
| part_02_승 | reaction, attempt, obstacle | 3,500-4,500 |
| part_03_전 | crisis, turn, decision | 3,000-4,000 |
| part_04_결 | climax, resolution, hook_forward | 2,500-3,500 |

### 파트 간 연결

각 파트 끝에 다음 파트로의 전환 힌트 포함:
- `part_01_기.txt` 끝 → '승'으로의 전환 암시
- `part_02_승.txt` 끝 → '전'으로의 전환 암시
- `part_03_전.txt` 끝 → '결'으로의 전환 암시

