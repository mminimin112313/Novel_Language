# Antigravity Agent Template

This is a starter template for **Antigravity** projects. It provides a structured set of Rules, Workflows, and Skills to help you build software efficiently.

## Directory Structure
- `.agent/rules/`: **Always-on** or **Context-aware** rules (Security, Style).
- `.agent/workflows/`: Executable workflows triggered by `/command`.
- `.agent/skills/`: Specialized capabilities (Security Audit, Coding Standards).
- `.agent/agents/`: Specialized agent personas (Architect, Planner, etc.).
- `.context/`: Project context files (Architecture, Stack, PRD).
- `mcp/`: MCP Server configurations.

---

## The Guides

These guides explain the foundations and advanced techniques of the Antigravity workflow.

| Guide | Description |
|-------|-------------|
| [Shorthand Guide](file:///.agent/skills/knowledge/template-guides/shortform-guide.md) | Setup, foundations, philosophy. **Read this first.** |
| [Longform Guide](file:///.agent/skills/knowledge/template-guides/longform-guide.md) | Token optimization, memory persistence, evals, parallelization. |

---

## What's Inside

This template provides a comprehensive collection of production-ready configurations:

```
.agent/
├── agents/           # Specialized subagents (Planner, Architect, Architect, etc.)
├── skills/           # Workflow definitions and layered capabilities
│   ├── core/         # Essential lifecycle and behaviors
│   ├── capabilities/ # Web browsing, semantic memory
│   ├── workflows/    # TDD, Security Review processes
│   └── knowledge/    # Reference patterns and guides
├── rules/            # Always-follow guidelines (Security, Style, Performance)
└── workflows/        # Slash commands (/plan, /tdd, /e2e)
```

## How to Use

### 1. Installation & Setup
Copy the contents of this folder to your project root and run the setup script:

**Linux/macOS:**
```bash
cp -r agent-template/. .
./setup.sh
```

**Windows (CMD or PowerShell):**
```cmd
setup.bat
```

The setup scripts automatically:
- Detect required runtimes (Node.js, Python).
- Initialize virtual environments for specialized skills.
- Install necessary dependencies.
- Fix missing configuration files (e.g., `tsconfig.json` for dispatcher).
- Set up the core directory structure.


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
