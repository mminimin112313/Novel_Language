# oh-my-ag Gap Analysis (2026-02-08)

## Scope

Reference repository: `https://github.com/first-fluke/oh-my-ag` (head checked on 2026-02-08).

Analyzed areas:

- `.agent` directory conventions
- shared skill protocols
- command-style workflow naming
- setup diagnostics (`doctor`) pattern

## Findings

1. `.agent`-first layout is the stable baseline.
2. Shared protocol docs reduce skill drift in long sessions.
3. Command-style workflow aliases (`setup`, `plan`, `review`, `debug`, `tools`) improve discoverability.
4. Setup doctor checks catch environment and config portability issues early.

## Applied to This Repository

1. Added `setup:doctor` script and implementation:
   - `src/setup/doctor.ts`
   - `src/scripts/setup-doctor.ts`
2. Updated bootstrap to run doctor before quality gates.
3. Added command-style workflow aliases:
   - `.agent/workflows/setup.md`
   - `.agent/workflows/plan.md`
   - `.agent/workflows/orchestrate.md`
   - `.agent/workflows/coordinate.md`
   - `.agent/workflows/review.md`
   - `.agent/workflows/debug.md`
   - `.agent/workflows/tools.md`
4. Added shared protocol set under `.agent/skills/_shared/`:
   - `clarification-protocol.md`
   - `context-budget.md`
   - `difficulty-guide.md`
   - `reasoning-templates.md`
   - `lessons-learned.md`
   - `verify.sh`
5. Added workflow routing skill:
   - `.agent/skills/workflow-guide/SKILL.md`

## Remaining Optional Improvements

1. Add a CI job that runs `npm run setup:doctor` on every pull request.
2. Add a PR checklist that includes plot consistency and Korean proofreading gates.
3. Add an Antigravity command index in `README.md` for faster onboarding.
