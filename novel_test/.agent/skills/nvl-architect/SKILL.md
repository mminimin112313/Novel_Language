---
name: nvl-architect
description: Generate or repair NVL line-DSL code from natural-language story direction. Use when the task is converting writer intent to compile-valid NVL and iterating with compiler diagnostics.
---

# Workflow (기승전결 기반)

1. 작가 지침(Writer Direction)을 읽고 액터(Actor), 장소(Location), 지식 정보(Knowledge), 핵심 사건을 추출합니다.
2. 기승전결(起承轉結) 단계에 맞춰 NVL 라인 DSL을 생성합니다. (마크다운 펜스 제외)
3. 모든 액터는 참조되기 전에 `ACTOR`로 선언되어야 합니다.
4. 회상 모드(`mode=flashback`)가 명시되지 않는 한 시간순(Timeline monotonicity)을 준수합니다.
5. 컴파일 진단(Diagnostics)이 있는 경우, 최우선적으로 `error` 수정을 진행합니다.


# Context Loading (Mandatory)

Before generating NVL, load these files:
1. `world.nvl` → Check existing actors, items, relations
2. Prior episode NVL files → Avoid redeclaring actors, check cumulative state
3. `nvl-compiler-guide.md` → Known error patterns and fixes

# NVL DSL Specification

Use these commands only:
- `ACTOR <name>`
- `COMPONENT <actor> <component>`
- `SET <actor>.<path> = <value>`
- `GIVE <actor> <item>`
- `KNOWS <actor> <fact>`
- `MEMORY <actor> event=<id> role=<role> distortion=<0..1> tags=<comma,separated>`
- `RELATE <from> -> <to> affinity=<num> trust=<num> romance=<true|false>`
- `GOAL <actor> main=<goal> sub=<goal>`
- `SCENE <id> worldTime=<ISO8601> narrative=<int> mode=<normal|flashback>`
- `SEED <clueId> target=<target> due=<act>`
- `RESOLVE <clueId> reason=<text>`
- `ACTION <verb> subject=<actor> [target=<actor>] [item=<item>] [fact=<fact>] [damage=<int>]`

# Strategic Constraints
- **Physical Actions**: (GIVE/ATTACK/USE/STEAL/HUG/KISS) require the same location for both subject and target.
- **Inventory Check**: USE/GIVE item requires the item to exist in the subject's inventory.
- **Epistemic Check**: SPEAK with a fact requires the subject to KNOWS that fact first.
- **Causality**: Backward worldTime requires `mode=flashback` on the SCENE.
- **Life State**: Dead actors (`hp=0`) cannot act.

# Repair Heuristics
- `E_ITEM_MISSING` or `E_GIVE_ITEM`: Insert a prior `GIVE` or `ACTION LEARN` or change the item.
- `E_SPATIAL_MISMATCH`: Align actor locations using `SET Actor.location = ...` before physical action.
- `E_EPISTEMIC`: Add `KNOWS` or `ACTION LEARN` before a `SPEAK` action with that fact.
- `E_CAUSALITY_TIME`: Fix the `worldTime` order or add `mode=flashback`.
- `E_UNKNOWN_COMMAND`: Remove or fix typos in command names (e.g., use `#` for comments).

# Output Formatting
- Output **ONLY** the NVL code block.
- Do not include markdown fences in the final code output unless requested.
- Return JSON if specified in the call: `{"dsl": string, "notes": string[]}`.

