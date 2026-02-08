---
name: nvl-korean-proofreader
description: Proofread Korean manuscript for spelling/spacing/grammar/style while preserving plot facts and [[EVT:###]] citations. Use after drafting and before finalizing.
---

# Prerequisites

| 선행 조건 | 상태 |
|:----------|:-----|
| 리뷰 통과 | ☐ PASS 판정 후에만 교정 진행 |
| 병합본 존재 | ☐ `ep{N}/_merged.txt` |

# Inputs

- `episodePack` (JSON): constraints and banned/required terms
- `draft` (text): episode draft containing `[[EVT:###]]` citations (병합본)

# Output

Return the corrected manuscript text:
- `ep{N}/proofread.txt` (인용 포함 버전)
- `ep{N}_final.txt` (인용 제거, 최종 출판용)

# Non-Negotiables (필수 준수)

1. **사실 변경 금지**
   - 애매한 문장은 새 정보 없이 재표현
2. **인용 보존**
   - `[[EVT:###]]` 삭제/재정렬/번호변경 금지
3. **제약 준수**
   - POV/시제/스타일 일관성 유지
   - `bannedPhrases` 회피, `requiredMotifs` 유지

# Proofreading Checklist

## A. 맞춤법/문법 (필수)

| ☐ | 항목 | 예시 |
|:--|:-----|:-----|
| ☐ | 되/돼 구분 | "되다" vs "돼(되어)" |
| ☐ | 안/않 구분 | 부정 vs 아니하다 |
| ☐ | 맞히다/맞추다 | 정답 vs 조정 |
| ☐ | 띄어쓰기 | 조사/의존명사/보조용언 |
| ☐ | 조사/어미 호응 | 은/는, 이/가, 을/를 |

## B. 문체/가독성 (필수)

| ☐ | 항목 |
|:--|:-----|
| ☐ | 중복 표현 제거 |
| ☐ | 과도한 수식어 정리 |
| ☐ | 문장 길이 균일화 (너무 길면 분리) |
| ☐ | 대사 표기 일관성 (따옴표) |

## C. 아크 구조 확인 (Phase 2 추가)

| ☐ | 항목 |
|:--|:-----|
| ☐ | 기승전결 4막 톤 차이 유지 |
| ☐ | 전환 문장이 자연스러움 |
| ☐ | 전(轉) 전환점이 명확함 |

## D. 캐릭터 음성 (Phase 3 추가)

| ☐ | 항목 |
|:--|:-----|
| ☐ | 대사가 캐릭터 프로필과 일치 |
| ☐ | 말투 특징 유지 |
| ☐ | 내면 독백 톤 일관 |

## E. Show, Don't Tell (Phase 3 추가)

| ☐ | 항목 |
|:--|:-----|
| ☐ | 감정 직접 명시 제거 ("슬펐다" 등) |
| ☐ | 행동/감각으로 대체 확인 |

# Quality Gate

| 기준 | 통과 조건 |
|:-----|:----------|
| 맞춤법 오류 | 0개 |
| 띄어쓰기 오류 | 3개 이하 |
| 인용 훼손 | 0개 |
| 사실 변경 | 0개 |

# Output Actions

1. **인용 포함 버전 저장** → `ep{N}/proofread.txt`
2. **인용 제거**:
   ```bash
   sed 's/\[\[EVT:[0-9]*\]\]//g' proofread.txt > ../ep{N}_final.txt
   ```
3. **최종본 저장** → `ep{N}_final.txt`
