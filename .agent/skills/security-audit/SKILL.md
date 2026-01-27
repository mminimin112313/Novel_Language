---
name: Security Audit
description: >
  Perform a security audit on code or architecture.
  Use this skill when the user asks for "security check", "vulnerability scan", or "audit".
---

# Security Audit

## Context
This skill guides you through a security review process.

## Instructions
1. **Identify Assets**: What are we protecting? (User data, keys, etc.)
2. **Identify Threats**: potential attackers and vectors (XSS, SQLi, Auth bypass).
3. **Scan Code**:
   - Grep for sensitive patterns (`password`, `secret`, `token`).
   - Check input validation on all entry points.
   - Verify authentication/authorization gates.
4. **Report**:
   - List all findings.
   - Categorize by Severity (Critical, High, Medium, Low).
   - Provide remediation steps.
