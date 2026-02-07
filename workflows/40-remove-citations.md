---
name: nvl-remove-citations
---

# Workflow: Remove Citations for Publication

Goal: remove `[[EVT:###]]` citations from a finalized draft while preserving text content.

## Steps

1. Ensure manuscript lint is passing (citations are valid and dense).
2. Copy draft to a publishable version.
3. Remove citation markers:
   - Replace `[[EVT:###]]` occurrences with nothing.
4. Do a final Korean proofreading pass to fix spacing around removed markers.

## Notes

- Keep the cited draft version in git for traceability.
- Publish the citation-free version.

