---
name: dispatcher
description: Meta-skill that indexes available capabilities and routes user requests to the most appropriate skill.
---

# Skill Dispatcher

The **Dispatcher** is the "Cerebellum" of the agent. It maintains an up-to-date index of all available skills (`SKILL.md` files) and provides logic to select the best tool for a given task.

## Features

- **Auto-Indexing**: Scans `.agent/skills/**/SKILL.md` to build a capability map.
- **Skill Routing**: Matches user prompts to skill descriptions/triggers.
- **Feedback Loop**: Learn which skills succeeded for specific types of requests.

## Usage

### Commands

- `/refresh-index`: Re-scans all `SKILL.md` files and updates `registry.json`.
- `/match-skill "query"`: Returns the best matching skill for the query.

### Integration

Hooks can call the dispatcher to inject "suggested tools" into the context.

## Configuration

- `registry_path`: `.agent/skills/core/dispatcher/data/registry.json`
