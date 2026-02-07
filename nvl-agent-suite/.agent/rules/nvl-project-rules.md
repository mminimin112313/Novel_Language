---
name: nvl-project-rules
scope: repository
---

# NVL Project Rules (Antigravity Default)

These rules are for running the NVL novel-writing workflow *inside Antigravity* using repository-local skills/workflows and deterministic compiler checks.

## Ground Rules

1. **No API keys as prerequisites.**
   - Do not ask the user to paste API keys.
   - Treat LLM access as handled by Antigravity runtime.

2. **Compiler is the source of truth.**
   - Only consider a plot step "valid" if `compileNVL` returns `success=true`.
   - Never invent facts in prose that are not representable in NVL or not present in the compile log.

3. **All plot development is traceable.**
   - Keep iterative NVL fixes as numbered attempts:
     - `tests/plot/<story-id>/attempt-01-rough.nvl`
     - `tests/plot/<story-id>/attempt-02-...nvl`
   - Persist compiler outputs to:
     - `logs/plot-validation/<story-id>/attempt-XX.compile.txt`
     - `logs/plot-validation/<story-id>/attempt-XX.diagnostics.json`
     - `logs/plot-validation/<story-id>/summary.md`

4. **Cross-validate plot sources.**
   - Maintain at least 2 independent sources per story in:
     - `docs/research/<story-id>-sources.md`
   - Prefer public-domain primary texts + a neutral plot summary.

5. **Git discipline (5-pass development).**
   - Implement changes in five small review rounds (foundation -> core -> integration -> docs -> hardening).
   - Commit each round with concrete scope.

