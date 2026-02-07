# Raw Brief Snapshot (2026-02-07)

User requested:

- Build a systematic set for novel-writing AI agents:
  - `.agent` definitions
  - `skill` set
  - `workflow`
  - `rules`
  - `scripts`
  - `mcp` set
- Use an NVL compiler as consistency gate.
- Use two-agent pipeline:
  1. Writer gives rough direction.
  2. Agent 1 (Architect) converts direction to NVL code.
  3. Compiler validates until success (iterative repair loop).
  4. Agent 2 (Novelist) translates validated logs to natural-language novel.
- Provide detailed logs and support text download.
- Build in a separate folder and manage with Git.
