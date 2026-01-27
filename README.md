# Antigravity Agent Template

This is a starter template for **Antigravity** projects. It provides a structured set of Rules, Workflows, and Skills to help you build software efficiently.

## Directory Structure
- `.agent/rules/`: **Always-on** or **Context-aware** rules (Security, Style).
- `.agent/workflows/`: Executable workflows triggered by `/command`.
- `.agent/skills/`: Specialized capabilities (Security Audit, Coding Standards).
- `.agent/agents/`: Specialized agent personas (Architect, Planner, etc.).
- `.context/`: Project context files (Architecture, Stack, PRD).
- `mcp/`: MCP Server configurations.
- `docs/`: Original guide documents from everything-claude-code.

## How to Use

### 1. Installation
Copy the contents of this folder to your project root (or keep it as a submodule).
```bash
cp -r agent-template/. .
```

### 2. Customization
- **Rules**: Edit `.agent/rules/00-core.md` to set your project's "Constitution".
- **Context**: Fill out files in `.context/` to give the AI context about your project.

### 3. Available Workflows (Commands)
These are mapped to files in `.agent/workflows/`.

| Command | Description |
|---|---|
| `/plan-feature` | Plan a new feature (Requirements -> Implementation Plan) |
| `/implement-slice` | Implement a vertical slice of a feature |
| `/tdd` | Test-Driven Development Loop (Red-Green-Refactor) |
| `/review` | Code Quality & Security Review |
| `/sec-review` | Deep Security Audit |
| `/debug` | Systematic Debugging Loop |
| `/setup` | Initialize project tooling |
| `/release` | Prepare for release |

## Skills
Skills are automatically loaded based on context or user request.
- **Coding Standards**: "Refactor this", "Fix style"
- **Security Audit**: "Check for vulnerabilities"
- **Continuous Learning**: "Remember this pattern"
- **Iterative Retrieval**: "Find how X works"

## Agents
You can invoke specific personas using tags or context:
- `architect`: High-level system design
- `code-reviewer`: Detailed code review
- `security-reviewer`: Security specialist
- `tdd-guide`: TDD process guide

## MCP
See `mcp/README.md` for setting up Model Context Protocol servers.
