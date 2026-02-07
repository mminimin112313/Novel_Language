export const DSL_SPEC = `
You are writing NVL (Novel Validation Language) line-DSL.

Rules:
- Output ONLY valid NVL lines, no markdown fences.
- Start by declaring actors with ACTOR.
- Keep timeline valid with SCENE lines using ISO8601 worldTime.
- Use commands from this set only:
  ACTOR <name>
  COMPONENT <actor> <component>
  SET <actor>.<path> = <value>
  GIVE <actor> <item>
  KNOWS <actor> <fact>
  MEMORY <actor> event=<id> role=<role> distortion=<0..1> tags=<comma,separated>
  RELATE <from> -> <to> affinity=<num> trust=<num> romance=<true|false>
  GOAL <actor> main=<goal> sub=<goal>
  SCENE <id> worldTime=<ISO8601> narrative=<int> mode=<normal|flashback>
  SEED <clueId> target=<target> due=<act>
  RESOLVE <clueId> reason=<text>
  ACTION <verb> subject=<actor> [target=<actor>] [item=<item>] [fact=<fact>] [damage=<int>]

Compiler expectations:
- Physical actions (GIVE/ATTACK/USE/STEAL/HUG/KISS) require same location.
- USE/GIVE item must exist in subject inventory.
- SPEAK with fact requires subject to KNOWS that fact.
- Backward worldTime requires mode=flashback on SCENE.
- Dead actor cannot act.
- Resolve clues you seed when possible.
`;

export function architectDraftPrompt(direction: string): string {
  return [
    "Convert writer direction into compile-ready NVL.",
    DSL_SPEC,
    "Writer Direction:",
    direction,
    "Output JSON: {\"dsl\": string, \"notes\": string[] }"
  ].join("\n\n");
}

export function architectRepairPrompt(
  direction: string,
  previousCode: string,
  diagnosticsText: string
): string {
  return [
    "Repair NVL so compilation errors are removed while preserving story intent.",
    DSL_SPEC,
    "Writer Direction:",
    direction,
    "Previous NVL:",
    previousCode,
    "Compiler diagnostics:",
    diagnosticsText,
    "Return JSON: {\"dsl\": string, \"notes\": string[] }"
  ].join("\n\n");
}

export function novelistPrompt(direction: string, style: string, logText: string): string {
  return [
    "You are a novelist agent.",
    "Write polished Korean prose using only validated facts from the log.",
    "Do not invent new items, knowledge, or events that are absent from logs.",
    `Style: ${style}`,
    `Writer direction: ${direction}`,
    "Validated system log:",
    logText,
    "Output only the final prose."
  ].join("\n\n");
}

export function novelPlanPrompt(
  concept: string,
  titleHint: string | undefined,
  chapterCount: number,
  baseStyle: string
): string {
  return [
    "You are a novel planner agent.",
    "Create a chapter plan that can be compiled chapter-by-chapter in NVL.",
    "Each chapter direction must be concrete, stateful, and suitable for event-level coding.",
    "Keep causality explicit and avoid vague direction text.",
    titleHint ? `Preferred title hint: ${titleHint}` : "No fixed title hint.",
    `Chapter count: ${chapterCount}`,
    `Base style: ${baseStyle}`,
    `Concept: ${concept}`,
    [
      "Output JSON only with this shape:",
      "{",
      '  "title": string,',
      '  "summary": string,',
      '  "chapters": [',
      "    {",
      '      "index": number,',
      '      "title": string,',
      '      "direction": string,',
      '      "style": string',
      "    }",
      "  ]",
      "}"
    ].join("\n")
  ].join("\n\n");
}
