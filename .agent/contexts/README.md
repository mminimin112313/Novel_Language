# Context Engineering Map

This directory serves as the **Active Memory Bank** for the agent. Instead of polluting the global context window, the agent `read_file`s specific context modules based on the current mode.

## 1. Project Context (`project/`)
*Load these when starting a new session or switching major tasks.*

*   [**00_project_intent.md**](./project/00_project_intent.md): High-level goals, target audience, and success metrics.
*   [**10_architecture.md**](./project/10_architecture.md): System design, data flow, and key components.
*   [**20_stack.md**](./project/20_stack.md): Core runtimes (Node/Python), libraries, and infrastructure.
*   [**30_prd.md**](./project/30_prd.md): Product Requirements Document and feature specs.

## 2. Persona Contexts (`personas/`)
*Load these to adopt a specific mindset.*

*   [**dev.md**](./personas/dev.md): **[Execution Mode]** focus on implementation, testing, and clean code.
*   [**architect.md**](./personas/research.md): **[Planning Mode]** focus on system design, trade-offs, and scalability. (Mapped to `research.md`)
*   [**reviewer.md**](./personas/review.md): **[Verification Mode]** focus on security, performance, and best practices.

## Usage Rule
**When switching modes:**
1.  Check this map.
2.  `view_file` the relevant context.
3.  Proceed with the task.
