# Debug Workflow
Trigger: `/debug [error/issue]`

## Goal
Systematically identify and fix a bug.

## Steps
1. **Reproduce**: Create a reproduction script or test case.
2. **Hypothesize**: What is causing the issue? List 3 possibilities.
3. **Instrument**: Add logging or use debugger to verify hypothesis.
4. **Fix**: Implement the fix.
5. **Verify**: Run the reproduction test to confirm fix.
6. **Regression**: Run related tests to ensure no side effects.
