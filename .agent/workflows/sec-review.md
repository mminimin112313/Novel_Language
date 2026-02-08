# Security Review Workflow
Trigger: `/sec-review`

## Goal
Deep dive security audit of the codebase or specific module.

## Steps
1. **Threat Modeling**: Identify entry points and assets.
2. **Static Analysis**:
   - Grep for `password`, `key`, `token`, `secret`.
   - Grep for `eval`, `innerHTML`, `dangerouslySet`.
3. **Logic Review**:
   - AuthZ: Is permission checked?
   - AuthN: Is user authenticated?
   - Rate Limiting: Is abuse prevented?
4. **Output**:
   - Security Report with Risk Level (Critical/High/Medium/Low).
   - Mitigation Plan.
