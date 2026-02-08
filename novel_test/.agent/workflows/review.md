---
name: nvl-review
description: Plot consistency, 기승전결 arc, and manuscript quality review workflow with PASS/REVISE/REJECT verdicts.
---

# Workflow: Review

Goal: Reject plot holes, arc failures, and style violations before final export.

## Review Phases

### Phase 1: Compiler Review
- Compile source: `npm run compile:cascade`
- **Stop Condition**: `error` diagnostics = 0
- Classify `warning` as must-fix or accepted risk

### Phase 2: Arc Structure Review

| 체크 | 항목 |
|:-----|:-----|
| ☐ | 기(起) 도입부 존재 |
| ☐ | 승(承) 전개부 존재 |
| ☐ | 전(轉) 전환점 명확 |
| ☐ | 결(結) 결말과 훅 존재 |
| ☐ | 파트 간 전환 자연스러움 |

### Phase 3: Consistency Review
- **Skill**: `nvl-consistency-auditor`
- Query with AQL for:
  - Actor status
  - Ownership chains
  - Clue states (`SEED`/`RESOLVE`)
  - Knowledge flow
- Ensure unresolved clues are intentional (`RedHerring`)

### Phase 4: Manuscript Review
- **Skill**: `nvl-episode-reviewer`
- **Template**: `.agent/templates/editor-review-template.md`
- Verify each paragraph grounded by `[[EVT:###]]`
- Check style compliance

### Phase 5: Korean Editorial Review
- **Skill**: `nvl-korean-proofreader`
- Spacing/orthography/tone consistency

## Verdict System

| 판정 | 조건 | 조치 |
|:-----|:-----|:-----|
| **PASS** | MUST 0개, SHOULD ≤3개 | 다음 단계 진행 |
| **REVISE** | MUST ≥1개 또는 SHOULD ≥4개 | 해당 파트 수정 후 재리뷰 |
| **REJECT** | 아크 구조 문제 또는 MUST ≥5개 | 비트시트부터 재작성 |

## Output

- `ep{N}/review_r{round}.md` (리뷰 결과)
- `ep{N}/revision-log.md` (수정 이력)

## Quality Gate

| 기준 | 통과 조건 |
|:-----|:----------|
| Compile | 0 errors |
| Arc | 기승전결 4막 존재 |
| Citations | 모든 문단에 `[[EVT:###]]` |
| Style | 금지 표현 0개 |
| Grammar | 맞춤법 오류 0개 |
