# Workflow Routing Examples

## Example A: "인어공주 플롯 정합성 점검해줘"

- Workflow: `.agent/workflows/10-plot-compile.md`
- Skills: `nvl-architect` -> `nvl-compiler-guard` -> `nvl-aql`
- Stop condition: compiler diagnostics `error=0`

## Example B: "3화 원고 써줘, 1인칭 현재시제"

- Workflow: `.agent/workflows/30-write-episode.md`
- Skills: `nvl-episode-planner` -> `nvl-episode-writer` -> `nvl-episode-reviewer` -> `nvl-korean-proofreader`
- Stop condition: manuscript lint pass + Korean proofreading pass

## Example C: "클론했는데 세팅이 안 된다"

- Workflow: `.agent/workflows/setup.md`
- Skills: `workflow-guide`
- Stop condition: `npm run setup:doctor` success
