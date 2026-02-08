---
name: nvl-episode-planner
description: Plan an episode with 기승전결 arc structure, beat sheet, and scene/paragraph mapping. Requires series outline and outputs structured plan with NVL event citations.
---

# Prerequisites (필수 선행 조건)

에피소드 기획 전 반드시 확인:

| 선행 문서 | 상태 | 없으면 |
|:----------|:-----|:-------|
| 시리즈 아웃라인 | ☐ | `series-outline-template.md`로 먼저 작성 |
| 이전 에피소드 상태 | ☐ | cascade compile로 확인 |
| 프로젝트 스타일 | ☐ | `style.md` 로드 |
| 캐릭터 음성 | ☐ | `character_voices.md` 로드 |

# Context Loading (필수)

순서대로 로드:
1. **시리즈 아웃라인** → 전체 아크에서 이 에피소드 위치 확인
2. **`world.nvl`** → 글로벌 액터, 팩션, 장소
3. **이전 에피소드 NVL** → 누적 상태
4. **`character_voices.md`** → 대화 기획에 필요
5. **프로젝트 스타일** → 미학적 제약

# Inputs

- `episodePack` (JSON): from `nvl_episode_pack` or `npm run episode:pack`
- `seriesOutline` (optional but recommended): from `series-outline-template.md`

# Output Format

## 1. Beat Sheet (기승전결 기반)

```json
{
  "metadata": {
    "episodeId": "string",
    "seriesPosition": "Phase X, Chapter Y, Episode Z",
    "targetChars": 15000,
    "estimatedScenes": 6
  },
  "arc_structure": {
    "기_intro": {
      "hook": { "intent": "string", "events": ["[[EVT:001]]"], "targetChars": 800 },
      "setup": { "intent": "string", "events": ["[[EVT:002]]", "[[EVT:003]]"], "targetChars": 1200 },
      "inciting": { "intent": "string", "events": ["[[EVT:005]]"], "targetChars": 1000 }
    },
    "승_development": {
      "reaction": { "intent": "string", "events": [], "targetChars": 1500 },
      "attempt": { "intent": "string", "events": [], "targetChars": 1500 },
      "obstacle": { "intent": "string", "events": [], "targetChars": 1500 }
    },
    "전_turn": {
      "crisis": { "intent": "string", "events": [], "targetChars": 1500 },
      "turn": { "intent": "string", "events": [], "targetChars": 1200 },
      "decision": { "intent": "string", "events": [], "targetChars": 1000 }
    },
    "결_resolution": {
      "climax": { "intent": "string", "events": [], "targetChars": 1500 },
      "resolution": { "intent": "string", "events": [], "targetChars": 1000 },
      "hook_forward": { "intent": "string", "events": [], "targetChars": 500 }
    }
  },
  "story_engine": {
    "six_questions": {
      "desire": "string (외적 목표)",
      "need": "string (내적 결핍)",
      "obstacle": "string (적대 세력)",
      "stakes": "string (실패 시 결과)",
      "lie": "string (거짓 믿음)",
      "change": "string (캐릭터 변화)"
    }
  },
  "transitions": {
    "from_previous_episode": "string (이전 에피소드에서 이어받는 것)",
    "to_next_episode": "string (다음 에피소드로 넘기는 것)"
  },
  "constraints": {
    "pov": "first_person|third_person_limited|omniscient",
    "tense": "past|present",
    "style": "string"
  }
}
```

## 2. Scene-Level Breakdown

```json
{
  "scenes": [
    {
      "sceneId": "Scene01",
      "arc_phase": "기_intro.hook",
      "worldTime": "ISO-8601",
      "characters": ["APPEAR list"],
      "location": "string",
      "goal_conflict_change": {
        "goal": "이 씬에서 주인공이 원하는 것",
        "conflict": "무엇이 방해하는가",
        "change": "씬 끝에 달라진 것"
      },
      "beats": [
        { "type": "action|dialogue|internal", "content": "string", "events": ["[[EVT:###]]"] }
      ]
    }
  ]
}
```

# Planning Rules

## Arc Requirements (필수)

1. **기승전결 모두 존재해야 함** - 어느 하나라도 빠지면 REJECT
2. **각 파트 비율**: 기(~25%), 승(~25%), 전(~25%), 결(~25%)
3. **전환점(전) 명확해야 함** - "이 순간 모든 것이 바뀐다" 포인트

## Event Mapping (필수)

1. 모든 비트는 `[[EVT:###]]` 인용 필수
2. `episodePack.events`에 있는 이벤트만 사용
3. 50개 이상의 이벤트 활용 권장 (밀도 확보)

## Micro-Event Breakdown

한 매크로 비트를 5-10개 마이크로 액션으로 분해:

```
Bad: "Jack이 사무실에 들어간다"
Good: 
  - Jack이 문 앞에서 멈춘다
  - 노크할지 고민한다
  - 숨을 고른다
  - 손잡이를 잡는다
  - 문을 연다
  - 안을 살핀다
  - 들어선다
```

## Transition Rules (필수)

1. 각 씬 끝에 다음 씬으로의 전환 힌트
2. 기→승, 승→전, 전→결 단계 전환 명확히
3. 에피소드 시작: 이전 에피소드 리마인더
4. 에피소드 끝: 다음 에피소드 훅

# Quality Checklist

| ☐ | 항목 |
|:--|:-----|
| ☐ | 시리즈 아웃라인과 일관성 확인 |
| ☐ | 기승전결 4막 모두 존재 |
| ☐ | 전환점(전)이 명확함 |
| ☐ | 모든 비트에 EVT 인용 있음 |
| ☐ | 50+ 이벤트 사용 |
| ☐ | 씬 간 전환이 자연스러움 |
| ☐ | 캐릭터 아크가 명확함 |

# Output Files

1. `ep{N}_beatsheet.json` - 구조화된 비트시트
2. `ep{N}_beatsheet.md` - 가독성 높은 마크다운 버전
