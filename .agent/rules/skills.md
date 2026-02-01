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

## 2. Key Skills Inventory

### Capabilities
- **browsing**: Multi-agent local browser control with Vision & Network capture.
- **vision**: Image processing, OCR, and 어노테이션 drawing.

### Knowledge
- **korean-law**: Official National Law Information Center API integration for Laws/Precedents.

## 3. Self-Healing & reproducibility
- **Automatic Setup**: Skills with dependencies MUST include `package.json` (JS) or `requirements.txt` (Python).
- **Lazy Initialization**: Skill bridges (e.g., `MemorySkill.ts`) MUST detect environmental gaps and trigger setup on first use.
- **Environment Isolation (CRITICAL)**: Always prioritize local `.venv` or `node_modules` within the skill directory. Python skills MUST be run using their local `.venv/bin/python3`.
- **Runtime Resolution**: Dynamically resolve the local interpreter path (e.g., `./.agent/skills/knowledge/korean-law/.venv/bin/python3`).

### Knowledge Reuse
- **Refactoring**: When adding logic, search `knowledge/` first to reuse existing patterns.