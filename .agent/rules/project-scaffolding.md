# Project Scaffolding & Customization

This guide explains how to bootstrap a **new project** using the Agent Kernel (`.agent`) and how to customize it for specific domains.

## 1. The "Kernel" Concept
The `.agent` directory acts as a portable **Agent Kernel**. It contains:
- **Core Skills**: How to learn, search, and remember.
- **Rules**: operational constraints (TDD, Security).
- **Hooks**: Automated quality checks.

## 2. Bootstrapping a New Project

To start a new project with these agentic capabilities:

### Step A: Clone the Kernel
Copy the `.agent` directory to your new project root.
```bash
cp -r /path/to/everything-antigravity/.agent /path/to/new-project/
cd /path/to/new-project
```

### Step B: Reset Contexts
The copied kernel carries contexts from the old project. You must reset them:
1.  **Clear Project Context**:
    - Delete contents of `.agent/contexts/project/`.
    - Create fresh `intent.md`, `stack.md`, `architecture.md`.
    - *Tip*: Use the agent to "Analyze this repo and populate `.agent/contexts/project/*`".
2.  **Reset Memory**:
    - Delete `.agent/memory/memory_index.db`.
    - Delete `.agent/memory/nodes/*.md`.
    - Run `./setup.sh` to re-initialize the empty memory graph.

### Step C: Customize Rules (Optional)
If the new project has specific strictures (e.g., "Must use Django" or "No TDD required"):
1.  Edit `.agent/rules/architecture.md` or create `.agent/rules/local.md`.
2.  Update `.agent/rules/README.md` to reflect the changes.

## 3. Customizing Agents & Personas

### Adding a Domain-Specific Persona
If your project requires a specialist (e.g., "Solidity Auditor" or "Game Designer"):
1.  Create `.agent/contexts/personas/solidity_auditor.md`.
2.  Define their specific focus, behavior, and tools.
3.  Update `.agent/contexts/README.md` to list this new persona.

### Overriding Global Rules
To override a global rule (e.g., changing max complexity from 10 to 5):
- Modify `.agent/rules/coding-style.md` directly. The agent reads these files as the "Source of Truth" for the current workspace.

## 4. Maintenance
- **Syncing Upstream**: If the core "everything-antigravity" kernel updates, you can `git pull` changes into your project's `.agent` folder (treating it as a submodule or subtree).
