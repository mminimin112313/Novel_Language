---
description: Log the outcome of a task to the project history.
---

1. Ask the user for the task status (SUCCESS, FAILURE, PARTIAL) and a brief description.
2. Ask for a summary of the outcome and any lessons learned.
3. Run the log_work.py script with the provided information.

```bash
# Example
python .agent/skills/knowledge/work-logger/log_work.py --status "SUCCESS" --task "Manual Log" --outcome "User manually logged this work."
```
