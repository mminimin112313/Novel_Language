---
description: Deep research workflow using specialized agents
---

# Research Workflow

This workflow orchestrates a deep research task using specialized `researcher` and `writer` agents.

## Usage

```bash
/research "Your topic here"
```

## Steps

1.  **Initialize**:
    *   Creat a new workspace directory for this research: `.agent/data/research/{topic_slug}/`

2.  **Phase 1: Information Gathering (Researcher)**
    *   **Agent**: `researcher`
    *   **Goal**: Gather comprehensive facts and sources.
    *   **Instructions**:
        > Conduct a deep dive research on "{topic}".
        > 1. Search for the key concepts.
        > 2. Verify facts from at least 3 sources.
        > 3. Save your raw findings to `raw_notes.md` in the research directory.
        > 4. Include ALL URLs.

3.  **Phase 2: Synthesis (Writer)**
    *   **Agent**: `writer`
    *   **Goal**: Create a polished report.
    *   **Instructions**:
        > Read `raw_notes.md`.
        > Write a comprehensive report on "{topic}" based on these notes.
        > Save the final report to `final_report.md`.
        > Ensure it is well-formatted with Markdown.

4.  **Finalize**:
    *   Present the path to `final_report.md` to the user.
