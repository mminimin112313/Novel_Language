# Cyberfunk Noir - Project Style Sheet

> **Priority**: This file overrides generic rules in `editorial-rules.md` for all Cyberfunk Noir content.

---

## Aesthetic Definition

| Element | Description |
|:--------|:------------|
| **Color Palette** | Pink/Cyan neon, rust orange, toxic green, matte black shadows |
| **Weather** | Constant acid rain. Humidity. Fog from drainage vents. |
| **Lighting** | Flickering neon. No natural sunlight (smog blocks sky). Red laser dots. |
| **Sound** | Static hum, drone buzz, distant gunfire, synth-music echoes |
| **Smell** | Battery acid, synth-meat, ozone, rusted metal, wet concrete |
| **Texture** | Grime, cold chrome, wet leather, cracked glass |

---

## Language Rules

### Required Expressions (Use Frequently)
- "비가 배터리 맛이 났다." (Rain tasted like battery acid)
- "네온이 심장박동처럼 깜빡였다." (Neon flickered like a heartbeat)
- "그림자가 손톱처럼 뻗어나갔다." (Shadows stretched like claws)
- "녹슨 금속 냄새가 코를 찔렀다." (Rust smell stung the nose)

### Forbidden Expressions (Never Use)
| Forbidden | Why | Alternative |
|:----------|:----|:------------|
| "아름다운 노을" | Anti-Noir | "상층부의 조명이 스모그를 붉게 물들였다" |
| "희망이 차올랐다" | Too positive | "어쩌면 살 수 있을지도 모른다는 생각이 스쳤다" |
| "따뜻하게 웃었다" | Out of character | "입꼬리가 씰룩거렸다" |
| "행복했다" | Direct emotion | Show through action/behavior |

---

## Prose Style

### Sentence Structure
- **Short sentences** during action (3-7 words)
- **Medium sentences** during observation (8-15 words)
- **Internal monologue** in italics or separate lines

### Rhythm Pattern
```
Short. Short. Short.
Medium observation sentence with sensory detail.
Short reaction.
Internal monologue—cynical, world-weary.
```

### Example
```
총성이 울렸다.
유리가 박살났다.
나는 몸을 숙였다.
창문 밖 네온 불빛이 유리 파편에 반사되어 무지개처럼 흩어졌다—아름다운 건 아니었다. 그냥 눈이 아팠다.
빌어먹을.
```

---

## Character Voice Quick Reference

| Character | Voice Pattern | Vocabulary |
|:----------|:--------------|:-----------|
| **Jack** | Terse, cynical | Old tech terms, sarcasm, self-deprecation |
| **Elara** | Nervous, formal | Corporate jargon slipping out, polite speech breaking down |
| **Goro** | Folksy, sly | Food metaphors, Japanese-Korean mix |
| **Vane** | Minimal, cold | Almost silent; meaning in actions, not words |
| **Rats** | High-pitched, fragmented | Broken speech, tech-speak, trade-focused |

---

## Pacing Metrics (Project-Specific)

| Scene Type | Target Words | Events | Prose:Event Ratio |
|:-----------|:-------------|:-------|:------------------|
| High Action | 800-1200 | 10-15 | ~80:1 |
| Dialogue | 600-1000 | 8-12 | ~100:1 |
| Internal/Slow | 1000-1500 | 5-8 | ~200:1 |
| Chase | 600-800 | 12-18 | ~50:1 |

---

## Integration Directive

All writing skills (`nvl-episode-writer`, `nvl-novelist`) MUST:
1. Load this file BEFORE generating prose
2. Apply Forbidden/Required expression filters
3. Match character voice profiles
4. Target pacing metrics by scene type
