---
trigger: always_on
---

# Subagent Delegation Rules

Subagents handles delegated tasks with limited scope, saving context for the orchestrator.

## General Principles
- **One Task, One Agent**: Each agent should have a clear, single responsibility.
- **Pass Objective Context**: The subagent only knows the literal query; give it the PURPOSE behind the request.
- **Iterative Retrieval**: Follow up on subagent results before accepting them.
- **Background vs Foreground**: Use background subagents for long tasks to keep the orchestrator free.

## Available Personas
Detailed personas are stored in the **Persona Library**: [agent-personas/](file:///.agent/skills/knowledge/agent-personas/)

Core Personas:
- `architect`: System design and technical strategy.
- `planner`: Requirements and implementation planning.
- `code-reviewer`: Quality and security auditing.
- `tdd-guide`: Driving the test-first development loop.
- `security-reviewer`: Focused vulnerability analysis.
- `build-error-resolver`: Fixing compilation and runtime environment issues.
- `e2e-runner`: Specializing in Playwright integration journeys.
- `refactor-cleaner`: Systematic technical debt and dead code removal.

Additional language-specific personas (e.g., `go-reviewer`, `go-build-resolver`) are also available in the library.

## Delegation Workflow
1. **Define Input/Output**: Clearly state what the agent should receive and produce.
2. **Select Model**: Choose the cheapest model sufficient for the task (see `performance.md`).
3. **Skill-Based Scoping**: Assign subagents to specific skill layers (e.g., `tdd-guide` to `workflows/tdd`).
4. **Verify Result**: Use the "Iterative Retrieval Pattern" to refine the subagent's output.