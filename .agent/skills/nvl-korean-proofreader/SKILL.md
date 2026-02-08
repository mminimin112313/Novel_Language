---
name: nvl-korean-proofreader
description: Proofread Korean manuscript for spelling/spacing/grammar/style while preserving plot facts and [[EVT:###]] citations. Use after drafting and before finalizing.
---

# Inputs

- `episodePack` (JSON): constraints and banned/required terms
- `draft` (text): episode draft containing `[[EVT:###]]` citations

# Output

Return the corrected manuscript text.

# Non-Negotiables

1. **Do not change facts.**
   - If a sentence is ambiguous, rephrase without adding new information.
2. **Preserve all citations exactly.**
   - Do not delete, reorder, or renumber `[[EVT:###]]`.
3. **Respect constraints.**
   - Keep POV/tense/style consistent.
   - Avoid `bannedPhrases`; keep `requiredMotifs`.

# Proofreading Checklist

- 맞춤법/표준어/오탈자 (예: 되/돼, 안/않, 맞히다/맞추다)
- 띄어쓰기 (조사/의존명사/보조용언)
- 조사/어미 호응
- 중복 표현 제거
- 문장 길이/호흡 정리 (과도한 쉼표/과한 수식)
- 따옴표/대사 표기 일관성

