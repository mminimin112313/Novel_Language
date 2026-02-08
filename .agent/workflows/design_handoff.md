---
description: How to process design handoff from Figma to code following Carbon principles.
---

# Design Handoff Workflow

## 1. Audit Figma Assets
- Verify that the designer used **Carbon Design System** Figma kit.
- Ensure all colors, fonts, and spacing are mapped to established **Tokens**.

## 2. Token Verification
// turbo
- Run a check to see if local CSS variables match the tokens defined in Figma.
- If new tokens are required, add them to `rules/design_principles.md`.

## 3. Structural Scaffolding
- Use the **2x Grid** to define the layout structure.
- Scaffold components using semantic HTML and role-based class names (e.g., `cds--button`).

## 4. Accessibility Check
- Verify color contrast ratios for all text/background combinations.
- Ensure interactive elements are reachable via keyboard and have focus styles.

## 5. Review & Align
- Conduct a design QA with the design team.
- Update `SKILL.md` if new implementation patterns are discovered.
