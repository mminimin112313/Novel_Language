---
name: work-logger
description: Systematically records the success, failure, or outcome of any unit of work (browser session, build, test) to the persistent history context.
layer: knowledge
---

# Work Logger & Outcome Recorder

This skill provides a standardized way to document what happened during an agent task. It is critical for maintaining long-term context and learning from failures.

## Tools Provided

### `log_work.py`
A Python script to append a structured log entry to `.agent/contexts/history/work_logs/`.

**Usage**:
```bash
python .agent/skills/knowledge/work-logger/log_work.py --status "SUCCESS" --task "System Initialization" --outcome "All services started successfully."
```

**Arguments**:
- `--status`: `SUCCESS`, `FAILURE`, `PARTIAL`
- `--task`: Brief description of the attempted task.
- `--outcome`: Detailed result or user-facing message.
- `--context`: (Optional) Path to a directory or file relevant to the work.
- `--artifacts`: (Optional) Comma-separated list of generated files (screenshots, logs).
- `--reflection`: (Optional) "Lesson Learned" or "Root Cause Analysis".

## When to Use

- **After Browsing**: The `browsing` skill MUST call this upon completion or panic.
- **After Critical Workflows**: Workflows like `/release` or `/e2e` should log their final status.
- **Manual Logging**: When you want to save a decision or significant milestone.

## Log Format

Logs are saved as `YYYY-MM-DD_<TaskSlug>.md` in `.agent/contexts/history/work_logs/`.

```markdown
# [SUCCESS] System Initialization

**Date**: 2024-05-20 14:00:00
**Status**: SUCCESS

## Outcome
All services started successfully.

## Reflections
- Environment variables were correctly loaded.

## Artifacts
- `logs/startup.log`
```
