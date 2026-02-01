---
name: korean-law
description: Search and retrieve Korean laws, precedents, and administrative rules using the National Law Information Center API.
layer: knowledge
---

# Korean Law Skill

This skill provides access to the official Korean Law & Precedent search MCP server.

## Tools Provided

- `health()`: Check service status and API key configuration.
- `search_law_tool(query, page=1, page_size=10)`: Search for laws by keyword.
- `get_law_detail_tool(law_id)`: Retrieve full text and details of a specific law.
- `search_precedent_tool(query, page=1, page_size=10, court=None)`: Search for court precedents.
- `get_precedent_detail_tool(precedent_id)`: Retrieve full text and details of a specific precedent.
- `search_administrative_rule_tool(query, page=1, page_size=10)`: Search for administrative rules.

## When to Use

- When needing official law text or precedents to support legal analysis.
- When verifying compliance with Korean regulations.
- When researching legal summaries (판결요지).

## Setup

1. Obtain an API key from [Open Law](https://open.law.go.kr/).
2. Set the `LAW_API_KEY` in the root `.env` file.
3. Dependencies and `.venv` are managed via the root `setup.sh`.

## Implementation Details

The skill is a Python-based FastMCP server located at `.agent/skills/knowledge/korean-law/src/main.py`.
It runs within its own isolated `.venv`.
