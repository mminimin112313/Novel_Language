---
description: Systematically analyze a reference repository and generate a structured research report.
---

# Research Workflow: /analyze-ref [REPO_PATH]

Follow these steps to generate a high-quality research report for a given reference repository.

1. **Initialization**
   - Identify the repository name from the path.
   - Read the root `README.md` and `package.json` or `pyproject.toml`.

2. **Codebase Scanning**
   - List key directories and find the core logic (e.g., `src/`, `models/`, `utils/`).
   - Identify the primary tech stack and libraries used.

3. **Structural Analysis**
   - Create a Mermaid diagram of the project's high-level architecture.
   - Define a Mermaid ERD for any database or data structure patterns identified.

4. **Detailed Exploration**
   - View the content of the most critical files (e.g., main entry points, core algorithm implementations).
   - Extract code snippets or logic flows that demonstrate "best-in-class" practices.

5. **Insight Extraction**
   - Compare the findings with the Nexus-CLI goals.
   - List specific "Insights for Nexus-CLI" (what to copy, what to avoid).

6. **Reporting**
   - Generate the final report in `.agent/contexts/research/{RepoName}_Analysis.md`.
   - Ensure it follows the structure in `.agent/rules/research.md`.
   - Provide a summary to the user with a link to the report.
