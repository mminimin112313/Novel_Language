# Agent Skills Architecture Proposal

The current `.agent/skills` directory is flat and mixes different types of capabilities (passive knowledge, active tools, process guides). This proposal reorganizes them into a **Layered Domain Architecture**.

## 1. Directory Structure

We will group skills into 4 categories:

```
.agent/skills/
├── core/                   # Essential Agent Lifecycle & behaviors
│   ├── continuous-learning/
│   ├── strategic-compact/
│   └── eval-harness/
│
├── capabilities/           # executable Tools (The "Hands" and "Eyes")
│   ├── browsing/           # Web interaction (Playwright)
│   └── memory/             # Project Knowledge Graph (Python/SQLite)
│                           # *Moved out of browsing to be a shared resource*
│
├── workflows/              # Process Guides (The "Methods")
│   ├── tdd/                # (renamed from tdd-workflow)
│   ├── security-review/
│   └── verification/       # (renamed from verification-loop)
│
└── knowledge/              # Reference Patterns (The "Books")
    ├── backend/            # (renamed from backend-patterns)
    ├── frontend/           # (renamed from frontend-patterns)
    ├── database/           # (Converged clickhouse/postgres patterns?)
    │   ├── postgres/
    │   └── clickhouse/
    └── languages/          # (Converged golang patterns)
        └── golang/
```

## 2. Rationales

### Why move Memory out of Browsing?
Although you previously requested Memory as a `browsing` subskill, it creates a **Logical Dependency Cycle**:
- `TDD Workflow` depends on `Memory` (to record decisions).
- If `Memory` is inside `Browsing`, `TDD` implicitly depends on `Browsing`.
- This is confusing because TDD (Unit Testing) shouldn't require a Web Browser component.
- **Solution**: `Memory` becomes a peer `Capability`. `Browsing` can still use it (via the existing integration), and `TDD` can use it directly.

### Grouping Knowledge
We have many `*-patterns` folders. Grouping them under `knowledge/` keeps the root clean and makes it easier for the agent to "browse the library" without being overwhelmed by executable tools.

## 3. Migration Plan

1.  **Create Directories**: `core`, `capabilities`, `workflows`, `knowledge`.
2.  **Move & Rename**:
    *   `continuous-learning-v2` -> `core/continuous-learning` (Archive v1)
    *   `browsing` -> `capabilities/browsing`
    *   `browsing/src/subskills/memory` -> `capabilities/memory`
    *   `tdd-workflow` -> `workflows/tdd`
    *   And so on...
3.  **Update References**:
    *   Update `SKILL.md` paths in the moved skills (if they reference each other).
    *   Update `browsing/src/subskills/memory/MemorySkill.ts` to point to the new python script location.
    *   Update `tdd` and `security-review` SKILL.mds to point to the new memory script location.

## 4. Browsing-Memory Bridge
We will keep the `MemorySkill.ts` inside `browsing/src/subskills/` (or rename to `integrations/`) but it will point to the shared `capabilities/memory` tool. This preserves the "Browsing can remember" feature while decoupling the implementations.
