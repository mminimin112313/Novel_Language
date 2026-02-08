# Two-Agent Workflow

1. Writer inputs rough direction.
2. Architect agent produces NVL draft.
3. Compiler validates and emits diagnostics + detailed log.
4. If compile fails, Architect receives diagnostics and repairs code.
5. Repeat step 3-4 until success or retry limit.
6. On success, Novelist agent renders prose from compile log.
7. Persist full artifacts for traceability and download.

## Retry Policy

- Hard cap: 6 attempts.
- Stop immediately when compile result is success.
- On final failure, return final diagnostics and latest code.
