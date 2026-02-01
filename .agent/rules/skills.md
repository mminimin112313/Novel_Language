---
trigger: always_on
---

# Skills & Capabilities Rules

# Skills & Capabilities Rules

> [!NOTE]
> For the high-level architectural manifesto and layer definitions, see [architecture.md](./architecture.md).

This rule defines the technical mandates for implementing and maintaining agent skills within the **Layered Domain Architecture**.

## 1. Skill Implementation Standards

### Structure & Documentation
- **Mandatory `SKILL.md`**: Every skill directory MUST have a `SKILL.md` file. without exception.
- **Frontmatter**: Use strict YAML frontmatter for machine readability.
  ```yaml
  ---
  name: skill-name
  description: One-line description
  layer: capabilities|core|workflows|knowledge
  ---
  ```
- **Sections**: The `SKILL.md` must include:
  - `## Tools Provided`: What can the agent *do* with this?
  - `## When to Use`: Explicit triggers or scenarios.
  - `## Setup`: Dependencies and initialization (if applicable).

### Self-Healing & reproducibility
- **Automatic Setup**: Skills with dependencies MUST include `setup.py` (Python) or `package.json` (JS).
- **Lazy Initialization**: Skill bridges (e.g., `MemorySkill.ts`) MUST detect environmental gaps and trigger setup on first use.
- **Environment Isolation**: Always prioritize local `.venv` or `node_modules` within the skill folder.
- **Runtime Resolution**: Dynamically resolve the local interpreter path (e.g., `./.venv/bin/python3`).

### Knowledge Reuse
- **Refactoring**: When adding logic, search `knowledge/` first to reuse existing patterns.
- **Persistence**: High-value technical pivots or fixes discovered during work MUST be recorded into `capabilities/memory`.