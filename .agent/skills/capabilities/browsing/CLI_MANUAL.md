# Browsing Skill CLI Manual (Enhanced)

This manual describes the improved browsing skill with systematic control and professional-grade system dumping.

## CLI Command Reference

### `system-dump`
Creates a comprehensive analysis package of the current page.
- **Output**: `browsing_dump/system_dumps/dump_TIMESTAMP/`
- **Contents**: 
  - `screenshot.png`: Full page capture.
  - `accessibility_tree.json`: Page structure as seen by assistive technologies.
  - `visual_map.json`: Pruned list of interactive elements.
  - `dom_structure.json`: Hierarchical DOM/JS structure summary.
  - `network_logs.json`: Captured network requests and responses.
  - `page.html`: Full DOM content.
  - `metadata.json`: URL, title, and timestamp.

### `script <path.ts>`
Executes a TypeScript script using the persistent browser session.
- **Requirement**: The script must export a `run` function.
- **Context**: The `run` function receives a `BrowsingLib` instance.
- **Example**:
  ```typescript
  import { BrowsingLib } from './BrowsingLib.js';
  export async function run(browsing: BrowsingLib) {
      await browsing.open("https://google.com");
      await browsing.type('textarea[name="q"]', "Antigravity Agent");
      await browsing.systemDump();
  }
  ```

### `inspect-at <x> <y>`
Returns detailed information about the element at the specified coordinates, including attributes, computed styles, and JS event listener indicators.

### `vision-analyze <description> [x y w h]`
Crops a specific area (or full page) and analyzes it using the vision skill.

### `execute-js <code>`
Executes custom JavaScript in the browser context.

### `get-network-logs`
Returns the current session's network logs.

### `open <url>`
Navigates to the specified URL.

### `click <selector>`
Clicks the element matching the selector.

### `type <selector> <text>`
Types text into the element matching the selector.

### `vision-click <description>`
**[EXPERIMENTAL]** Saves a screenshot and requests vision-based analysis to find and click an element matching the description.

---

## Systematic Usage (BrowsingLib)

The `BrowsingLib` provides a clean API for complex automation:

```typescript
const browsing = new BrowsingLib(...);
await browsing.open(url);
await browsing.systemDump();
```

## Agent Integration

Agents should prefer using `system-dump` to understand the page structure at a "coding level" before performing interactions. For complex multi-step tasks, agents should generate a TS script and execute it via `npm run browse script script.ts`.
