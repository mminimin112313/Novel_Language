---
name: design-system
description: Expertise in professional UI/UX implementation using role-based tokens and accessible component architectures.
layer: capabilities
---

# Design System Skill

## Tools Provided
- **Token Management:** Mapping visual designs to CSS variables and theme providers.
- **Responsive Architecture:** Implementing multi-column grids and fluid layouts.
- **Accessibility Auditing:** Verifying contrast, ARIA roles, and keyboard navigation.

## When to Use
- When creating or modifying UI components.
- When setting up the project's CSS foundation.
- When ensuring design handoffs from Figma/Sketch are accurately translated to code.

## Setup
Dependencies required for this skill in the project environment:
- `@carbon/colors`
- `@carbon/type`
- `@carbon/grid`
- `ibm-plex-font` (Optional but recommended)

## Implementation Patterns
### Token Usage
```css
.button-primary {
  background-color: var(--cds-interactive-01);
  color: var(--cds-text-04); /* text-on-interactive */
}
```

### Grid Layout
```html
<div class="cds--grid">
  <div class="cds--row">
    <div class="cds--col-md-4 cds--col-lg-8">
      <!-- Content -->
    </div>
  </div>
</div>
```
