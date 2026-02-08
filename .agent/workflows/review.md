# Code Review Workflow
Trigger: `/review`

## Goal
Review uncommitted changes for quality and security.

## Steps
1. **Get Changes**: `git diff --name-only HEAD`
2. **Security Check (CRITICAL)**:
   - [ ] No hardcoded secrets
   - [ ] No SQL injection
   - [ ] Input validation exists
3. **Quality Check**:
   - [ ] No console.logs
   - [ ] Error handling coverage
   - [ ] Naming conventions followed
   - [ ] No magic numbers
4. **Report**:
   - List issues with file/line references.
   - Suggest specific fixes.
   - Block if CRITICAL issues found.
