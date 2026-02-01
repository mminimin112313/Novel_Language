# Context & Outcome Documentation Rules

This rule defines how to manage the agent's context and document the success/failure of tasks using the **Outcome Recorder** pattern.

## 1. Context Directory Structure

The `.agent/contexts/` directory is the single source of truth for the project's state.

-   `active/`: **Ephemeral State**. Stores the current task's context (e.g., `session_state.json`). Cleared or archived on task completion.
-   `history/`: **Persistent Logs**.
    -   `work_logs/`: SUCCESS/FAILURE reports of every major action.
    -   `decisions/`: ADRs or significant choices made during the project.
-   `reference/`: **Knowledge Base**. Static analysis of external repos or docs (formerly `research/`).
-   `project/`: **High-Level Docs**. Architecture, plans, implementation guides.
-   `personas/`: **Agent Identities**. Instructions for sub-agents.

## 2. Outcome Recording (WorkLogger)

Every significant unit of work (especially those involving external tools like browsers or compilers) MUST be logged.

### Why Log?
-   To learn from **FAILURE**: Analyze *why* something failed to prevent recurrence.
-   To track **SUCCESS**: Maintain a history of what has been accomplished.
-   To preserve **ARTIFACTS**: Keep links to screenshots/logs for debugging.

### How to Log
Use the `work-logger` skill (or `/log-work` workflow):

```bash
python .agent/skills/knowledge/work-logger/log_work.py \
  --status "FAILURE" \
  --task "Run E2E Tests" \
  --outcome "Tests failed due to timeout" \
  --reflection "Need to increase timeout for login step."
```

## 3. Workflow Integration

| Workflow | Usage |
| :--- | :--- |
| **Browsing** | AUTOMATIC. Logs session outcome to `history/work_logs/` on exit. |
| **Manual** | User runs `/log-work` to record a milestone or decision. |

## 4. Best Practices

-   **Never delete history**: Append only.
-   **Structure your outcome**: Don't just say "Done". Say "Verified X, Y, Z".
-   **Reflect on failures**: The `reflection` field is critical for continuous learning.
