# Contributing Guidelines: Everything Antigravity

Thanks for wanting to contribute to the Antigravity template. We're looking for new agents, skills, and patterns that make agentic coding more efficient.

To ensure this project remains high-quality and cross-platform (Mac, Linux, Windows), please adhere to the following guidelines.

## What We're Looking For
- **Specialized Agents**: Language-specific reviewers, framework experts, DevOps specialists.
- **Workflow Skills**: TDD, Security Review, documentation sync.
- **Rules & Patterns**: Battle-tested guidelines for performance and security.
- **MCP Configs**: New server integrations for common tools.

## 1. Shell Scripts vs Node.js
- **Prefer Node.js scripts** over Bash (`.sh`) scripts for core logic.
  - ✅ `node scripts/setup.js`
  - ⚠️ `./scripts/setup.sh` (Requires WSL or Git Bash on Windows)
- If you must use Bash, ensure it is POSIX compliant and document that Windows users need **WSL** or **Git Bash**.

## 2. Path Handling
- **Never hardcode path separators** (e.g., `foo/bar` or `foo\bar`).
- Use Node.js `path` module:
  ```typescript
  import * as path from 'path';
  const filePath = path.join(__dirname, 'data', 'file.txt');
  ```
- Use `path.resolve()` for absolute paths.

## 3. Command Execution
- **Python**: Windows often uses `python`, while Mac/Linux uses `python3`.
- Detect the platform dynamically:
  ```typescript
  const pythonCommand = process.platform === "win32" ? "python" : "python3";
  ```
- **Shell**: When using `child_process.exec`, be aware that the default shell on Windows is `cmd.exe`.

## 4. Environment Variables
- Use `cross-env` package for setting environment variables in `package.json` scripts:
  ```json
  "scripts": {
    "test": "cross-env NODE_ENV=test jest"
  }
  ```
- Do not assume `~` (home directory) works in all contexts. Use specific environment variables or libraries to resolve the home directory.

## 5. Line Endings
- Configure `.gitattributes` to handle line endings (`CRLF` vs `LF`) automatically:
  ```
  * text=auto
  *.sh text eol=lf
  ```
## Contribution Process
1. **Fork & Branch**: Create a feature branch for your contribution.
2. **File Placement**:
   - `agents/` for new personas.
   - `skills/` for capability-based logic.
   - `rules/` for always-follow guidelines.
   - `workflows/` for slash commands.
3. **Format**:
   - **Agents**: Include frontmatter (`name`, `description`, `tools`, `model`).
   - **Skills**: Use the `SKILL.md` format with clear "When to Use" and "Examples".
   - **Filename**: Use lowercase with hyphens (e.g., `python-reviewer.md`).

## Technical Requirements (Cross-Platform)

## 6. Self-Healing Skills
When creating or modifying a skill, ensure it follows the "Self-Healing" pattern:
- **Automatic Setup**: If a skill needs a specific environment (like a Python venv), it must include a way to set it up automatically.
- **Root Inclusion**: Add any new skill setup requirements to the root `setup.sh` script.
- **Environment Isolation**: Keep dependencies local to the skill directory whenever possible.
