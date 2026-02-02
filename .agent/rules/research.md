# Research and Reporting Rules

These rules define the conventions for analyzing reference repositories and generating structured research reports for the **Target Project**.

## 1. Research Objectives
- **Patterns**: Identify architectural and design patterns relevant to the project's domain.
- **Data Models**: Extract and visualize data structures and relationships (ERDs).
- **Core Logic**: Pinpoint critical implementation details (e.g., algorithms, business logic).
- **Insights**: Extract actionable technical insights specifically for the Target Project's development.

## 2. Report Structure (Mandatory)
Every research report must follow this structure:
1. **Executive Summary**: High-level overview of the repository's purpose and key value.
2. **Architecture Diagram**: Mermaid diagram showing component relationships or data flow.
3. **Data Model (ERD)**: Mermaid-based Entity Relationship Diagram if applicable.
4. **Key Implementation Details**: Deep dive into specific files or functions.
5. **Insights for Project**: Bulleted list of techniques or libraries to adopt or avoid.

## 3. Directory Policy
- All research reports must be saved in `.agent/contexts/reference/`.
- Filename format: `{RepoName}_Analysis.md`.

## 4. Visual Standards
- Use Mermaid diagrams for all architectural or structural representations.
- Use `render_diffs` or code snippets to highlight critical logic.
- Ensure all file links are absolute and clickable within the workspace.

## 5. Agentic Research Workflow
When conducting deep research, prefer the **Agentic Research Workflow** defined in `.agent/workflows/research.md`.
- Use the `/research` command to trigger this workflow.
- This leverages specialized `researcher` and `writer` agents for higher quality output.
- Caching is enabled by default to speed up iterative research.
