# Design Principles & System Rules

> [!NOTE]
> This document defines the design standards for the Legal App project, drawing from the Carbon Design System for professional consistency and accessibility.

## 1. Core Principles
- **Clarity:** Prioritize legibility and task focus. Reduce cognitive load by avoiding unnecessary visual noise.
- **Consistency:** Use standardized components and patterns across the entire application.
- **Accessibility:** Ensure all designs meet WCAG AA standards (contrast, focus states, screen reader support).

## 2. Design Tokens

### Color Palette (Thematic)
Use role-based tokens instead of hex codes.
- `$interactive-01`: Primary action color (Buttons, Links).
- `$ui-01`: Primary background.
- `$ui-02`: Secondary background / Surface.
- `$text-01`: Primary body text.
- `$text-02`: Secondary/Supporting text.
- `$field-01`: Input field background.

### Typography
- **Typeface:** IBM Plex Sans (fallback to system sans-serif).
- **Productive Set:** Used for data-heavy tasks ($body-short-01, $label-01).
- **Expressive Set:** Used for marketing/narrative pages ($heading-05, $display-01).

### Spacing & Grid
- **Scale:** Multiples of 2, 4, 8, 12, 16, 24, 32...
- **2x Grid:** 16-column responsive layout for large screens.
- **Gutters:** 32px (Wide), 16px (Narrow), 2px (Condensed).

## 3. Implementation Rules
- NEVER hardcode CSS values. Always use CSS Variables mapped to tokens.
- Components must support Light/Dark theme switching via token mapping.
- All interactive elements MUST have a visible focus state.
