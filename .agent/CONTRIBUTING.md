# Contributing Guidelines: Cross-Platform Development

To ensure this project runs smoothly on Mac, Linux, and Windows, please adhere to the following guidelines.

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
