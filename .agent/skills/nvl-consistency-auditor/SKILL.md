---
name: nvl-consistency-auditor
description: Run plot-consistency audits using compiler diagnostics, AQL queries, and manuscript lint outputs. Use to catch plot holes, ownership/knowledge mistakes, and unresolved clues.
---

# Inputs

- NVL source (or compile result)
- EpisodePack (optional)
- Manuscript lint result (optional)

# Output

Return a short audit report (bullet list) with:

- what to fix in NVL (if compiler errors exist)
- what to fix in manuscript (if lint errors/warnings exist)
- AQL queries to run for verification

# Suggested AQL Queries

```sql
SELECT name, status, location FROM Actors WHERE status = 'Alive';
SELECT id, state, due FROM Clues WHERE state = 'Active';
TRACE OWNERSHIP OF 'Dagger';
SELECT actor, fact, kind, sourceActor, sceneId, worldTime FROM Knowledge;
```

# Auditor Rules

1. Compiler errors are blockers; fix NVL before editing prose.
2. Manuscript lint errors are blockers; fix citations/requirements before polishing.
3. Prefer minimal changes that restore consistency.

# Narrative Logic Checks (New)
1. **Character Arc Consistency**:
    - Does the character's action align with their **Desire** or **Fear**?
    - If they act against their nature, is there a specific **Reason** or **Change** event?
2. **Scene Purpose**:
    - Does every scene function as a Goal-Conflict-Change unit?
    - Flag scenes that are purely expository without conflict.

