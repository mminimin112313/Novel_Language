# 00 SKILLS MANIFESTO: Layered Domain Architecture

This project follows a **Layered Domain Architecture** for AI agent skills. This structure ensures that capabilities are modular, reproducible, and easy for agents to discover and utilize.

## 1. Directory Structure

Skills are categorized into 4 distinct layers:

```
.agent/skills/
├── core/                   # Essential Agent Lifecycle & Behaviors
│   ├── continuous-learning/ # Auto-evolves instincts into skills
│   ├── strategic-compact/   # Intelligent context window management
│   └── eval-harness/        # Benchmarking and verification metrics
│
├── capabilities/           # Executable Tools (The "Hands" and "Eyes")
│   ├── browsing/           # Advanced web interaction (Playwright)
│   └── memory/             # Semantic Knowledge Graph (Vector Index)
│
├── workflows/              # Process Guides (The "Methods")
│   ├── tdd/                # Red-Green-Refactor development loop
│   ├── security-review/    # Deep vulnerability auditing
│   └── verification/       # Continuous integrity checks
│
└── knowledge/              # Reference Patterns (The "Books")
    ├── backend/            # API and system design patterns
    ├── frontend/           # UI/UX and styling guidelines
    ├── database/           # Schema and optimization patterns
    └── languages/          # Language-specific idioms (Go, TS, Python)
```

## 2. Skill Catalog & Usage Guide

### Core Layer (Agent Behaviors)
| Skill | Description | When to Use |
|-------|-------------|-------------|
| **continuous-learning** | Instinct-based system that learns your preferences and evolves them into reusable skills. | **Always On**. Use explicit commands (`/instinct-status`) when you want to review what the agent has learned about you. |
| **iterative-retrieval** | A 4-phase loop (Dispatch -> Evaluate -> Refine -> Loop) to gather perfect context for subagents. | Use when a subagent fails due to missing context, or when "guessing" relevant files is risky/ineurrate. |
| **strategic-compact** | Intelligent suggestion system for manual context compaction. | Use when the agent suggests it (usually after Planning or Verification phases) to reclaim token window space. |

### Capabilities Layer (Tools)
| Skill | Description | When to Use |
|-------|-------------|-------------|
| **browsing** | Bio-inspired web navigation using Playwright (Vision + Action). | Use for **scraping data**, **testing web UIs** (E2E), or verifying visual elements. |
| **memory** | Semantic Knowledge Graph using vector embeddings (Sentence Transformers). | Use to **record architectural decisions**, **save lessons learned**, or **retrieve project-specific facts** that must survive the current session. |

### Workflows Layer (Process Guides)
| Skill | Description | When to Use |
|-------|-------------|-------------|
| **tdd** | Enforces Red-Green-Refactor loop with 80%+ test coverage. | **MANDATORY** when writing new features, fixing bugs, or refactoring. |
| **security-review** | Deep vulnerability audit (OWASP, Secrets, Input Validation). | Use when touching **authentication**, **payments**, **user input**, or **secrets**. |
| **verification** | Comprehensive 6-phase quality gate (Build, Type, Lint, Test, Security, Diff). | Use **before creating a PR** or after major code changes to ensure project health. |

## 3. Initial Setup & Reproducibility

The architecture is designed to be **Self-Healing**.

### Standard Setup (One-Click)
Run the root setup script to initialize the entire project environment:
```bash
./setup.sh
```

### Self-Healing Pattern
Every complex skill contains an internal `setup` mechanism (e.g., `setup.py` or `package.json`).
- If a skill bridge (e.g., `MemorySkill.ts`) detects its environment is missing, it **automatically** triggers its local setup before the first operation.
- Dependencies are isolated in local `.venv` or `node_modules` within the skill directory to prevent global policy conflicts.

## 4. Guidelines for New Skills
- **Mandatory Documentation**: Every skill MUST have a `SKILL.md`.
- **Reproducibility**: Must include an automated setup script if it has external dependencies.
- **Placement**: Assign to the correct layer based on whether it is a behavior, tool, method, or reference.
