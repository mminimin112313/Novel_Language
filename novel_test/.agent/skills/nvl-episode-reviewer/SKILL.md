---
name: nvl-episode-reviewer
description: Review an episode draft against EpisodeSpec requirements (plot grounding, style, pacing, constraints, 기승전결 structure). Output formal review notes using publishing industry standards.
---

# Context Loading (필수)

리뷰 전 반드시 로드:
1. **프로젝트 스타일**: `{project}/nvl/style.md`
2. **캐릭터 음성**: `{project}/nvl/character_voices.md`
3. **비트시트**: `{project}/.../ep{N}_beatsheet.md` (있다면)
4. **이전 리뷰**: `{project}/.../revision-log.md` (있다면)

# Inputs

- `episodePack` (JSON)
- `draft` (text, contains citations)
- `beatSheet` (optional, for arc verification)

# Output Format

리뷰 결과는 두 가지 형식으로 출력:

## 1. JSON Summary (for automation)

```json
{
  "verdict": "PASS|REVISE|REJECT",
  "round": 1,
  "scores": {
    "arc_structure": 7,
    "prose_quality": 6,
    "character_voice": 8,
    "plot_consistency": 9,
    "style_compliance": 7
  },
  "issues": [
    {
      "severity": "MUST|SHOULD|COULD",
      "category": "arc|prose|voice|plot|style",
      "location": "Scene X, paragraph Y",
      "message": "string",
      "suggestedFix": "string"
    }
  ],
  "revisionPlan": ["string"]
}
```

## 2. Markdown Report (for human review)

`.agent/templates/editor-review-template.md` 형식을 따라 작성.
리뷰 완료 후 `{project}/.../ep{N}_review_r{round}.md`로 저장.

# Review Checklist

## A. 기승전결 구조 (Arc Structure)

| 체크 | 항목 |
|:-----|:-----|
| ☐ | 기(起): 도입부가 독자를 끌어들이는가? |
| ☐ | 승(承): 갈등이 단계적으로 심화되는가? |
| ☐ | 전(轉): 명확한 전환점이 있는가? |
| ☐ | 결(結): 해소와 다음 훅이 있는가? |
| ☐ | 전체 아크가 자연스럽게 흐르는가? |

## B. 산문 품질 (Prose Quality)

| 체크 | 항목 |
|:-----|:-----|
| ☐ | 문장이 명확하고 경제적인가? |
| ☐ | 씬 전환이 자연스러운가? |
| ☐ | 감정 묘사가 "Show, don't tell"인가? |
| ☐ | 리듬과 완급 조절이 적절한가? |

## C. 캐릭터 음성 (Character Voice)

| 체크 | 항목 |
|:-----|:-----|
| ☐ | 각 캐릭터 대사가 음성 가이드와 일치하는가? |
| ☐ | 내면 독백 톤이 캐릭터에 맞는가? |

## D. 플롯 정합성 (Plot Consistency)

| 체크 | 항목 |
|:-----|:-----|
| ☐ | 모든 문단에 `[[EVT:###]]` 인용이 있는가? |
| ☐ | 인용이 문단 내용과 일치하는가? |
| ☐ | NVL에 없는 사실이 추가되지 않았는가? |

## E. 스타일 준수 (Style Compliance)

| 체크 | 항목 |
|:-----|:-----|
| ☐ | 필수 표현이 사용되었는가? |
| ☐ | 금지 표현이 없는가? |
| ☐ | 프로젝트 분위기가 일관적인가? |

# Severity Definitions

| 레벨 | 정의 | 조치 |
|:-----|:-----|:-----|
| **MUST** | 필수 수정, 수정 없이 통과 불가 | 반드시 다음 라운드 전 수정 |
| **SHOULD** | 권장 수정, 품질 향상에 중요 | 가능하면 수정 |
| **COULD** | 선택 수정, 개선 가능성 | 작가 재량 |

# Verdict Criteria

| 판정 | 조건 |
|:-----|:-----|
| **PASS** | MUST 0개, SHOULD 3개 이하 |
| **REVISE** | MUST 1개 이상, 또는 SHOULD 4개 이상 |
| **REJECT** | 구조적 재작성 필요 (MUST 5개 이상) |

# Post-Review Actions

1. JSON과 Markdown 리뷰 모두 저장
2. `revision-log.md` 업데이트
3. MUST 항목에 대한 구체적 수정 지침 제공
4. 학습된 교훈을 `lessons-learned.md`에 기록
