# Memory Constitution

This document defines the **Constitution** for the Browsing Agent's memory subsystem.
These rules dictate **WHEN** and **HOW** the agent must update its long-term memory.

## 1. Core Mandate
**"Learn Once, Apply Forever."**
The primary goal of the memory system is to prevent the agent from repeating the same discovery process (e.g., finding the same selector, login URL, or CAPTCHA solution) more than once per project.

## 2. Trigger Events (WHEN to Record)

The agent **MUST** record a new memory entry in the following scenarios:

### A. Successful Structural Discovery
- **Trigger**: When you successfully identify a stable CSS selector for a critical element (search box, login button, navigation link).
- **Action**: Record the selector, the page URL, and a brief description.
- **Tags**: `selector`, `navigation`, `ui-structure`

### B. Protocol Success
- **Trigger**: When a multi-step `run-protocol` completes successfully for a specific task (e.g., "Navigating to Naver Search Results").
- **Action**: Record the sequence or the name of the protocol file that worked.
- **Tags**: `protocol`, `workflow`, `success`

### C. Error/Failure Resolution
- **Trigger**: When you encounter an error (e.g., "Element not found") and find a workaround or a correct alternative.
- **Action**: Record the error and the solution.
- **Tags**: `error-handling`, `solution`, `debugging`

### D. Critical Data Extraction
- **Trigger**: When you are asked to "remember" or "save" specific information found on a page.
- **Action**: Record the extracted text verbatim or summarized.
- **Tags**: `knowledge`, `fact`, `extraction`

## 3. Formatting Standards (HOW to Record)

All memories must follow this Markdown format for the `content` field:

```markdown
**Context**: [URL or Task Name]
**Discovery**: [The fact/selector/solution]
**Confidence**: [High/Medium/Low]
**Usage**: [How to use this in future commands]
```

## 4. Operational Rules

1. **Check First**: Before starting any navigation task, run `memory-search` to see if a relevant memory exists.
2. **Update Over Creates**: If a memory exists but is slightly outdated (e.g., selector changed), use `memory-update` instead of creating a duplicate.
3. **No PII**: Do NOT record passwords, personal emails, or sensitive session tokens in long-term memory.

## 5. Compliance
Failure to update memory after a significant discovery is considered a violation of the **Efficiency Protocol**.
