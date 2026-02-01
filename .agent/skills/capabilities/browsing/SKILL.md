---
name: browsing
description: Control a web browser locally to navigate, take screenshots (snapshots), and interact with websites. Best for web automation tasks.
---

# Browsing Skill

This skill allows you to control a local web browser using Playwright. It is designed to mimic a human cognitive process, separating "Memory/Knowledge" (Brain) from "Work Output" (Workspace).



## 🔄 High-Precision Execution Process (SVP)
To ensure zero-failure automation, follow this cycle:

1.  **DETECT (Structure)**: Run `visual-map` to identify the UI layout and frame hierarchy.
2.  **OBSERVE (Details)**: Capture `screenshot` and use `inspect-at` to pin down exact coordinates.
3.  **PLAN (Protocol)**: Draft a `run-protocol` JSON that batches all interactions.
4.  **EXECUTE (Action)**: Run the protocol at high speed.
5.  **VERIFY (Outcome)**: Capture final snapshots.



## 🔄 High-Precision Execution Process (SVP)
Every high-stakes browsing task (Login, CAPTCHA, Scraping) MUST follow the **Structural Verification Protocol**:

1.  **Detection Phase**: Run `visual-map` or `list-elements` to understand the page structure and frame hierarchy.
2.  **Observation Phase**: Capture a `screenshot` and use `inspect-at` to verify coordinates or selectors.
3.  **Planning Phase**: Design a JSON protocol (`run-protocol`) that accounts for the detected structure.


## 📂 Hierarchical Workspace Structure
All outputs are organized in the root `browsing_dump/` directory following a session-first schema:

```text
browsing_dump/
├── sessions/
│   └── Session_YYYY-MM-DD_HH-mm-ss/
│       ├── screenshots/          # Intermediate step screenshots
│       ├── logs/                 # JSON execution traces & summaries
│       ├── PANIC_stepN.png       # Fail-state capture
│       └── panic_dump.json       # Blocked-state data
├── reports/                      # Final user-facing PNGs/MDs
└── temp/                         # Temporary scratchpad data
```

- **Traceability**: Every `run-protocol` execution creates a unique folder.
- **Panic Dumps**: Automatic fail-state snapshots are saved directly in the session folder.
- **Reporting**: Use `screenshot "report_..."` to save final results to the `reports/` folder.


## Installation

```bash
cd .agent/skills/capabilities/browsing
npm install
npm run build
```

## Usage Patterns

This skill exposes a library of **TypeScript Functions** ("Blocks"). To use it, you must generate and execute a TypeScript script.

### 1. Concept: Building Blocks
Instead of static JSON, you write dynamic code.
- **Primitives**: `src/logic/actions.ts` (safeClick, safeType)
- **Capabilities**: `src/blocks/` (openEditor, writePost)

### 2. How to Execute
Create a temporary script (e.g., `temp_flow.ts`) and run it using `npx tsx`.

```typescript
```typescript
// Example: Google Search Flow
import { chromium } from 'playwright-core';
import { captureSnapshot } from '../src/blocks/common/utils.js';

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    
    // 1. Open
    await page.goto('https://www.google.com');
    
    // 2. Search
    await page.fill('textarea[name="q"]', 'Antigravity Agent');
    await page.press('textarea[name="q"]', 'Enter');
    await page.waitForNavigation();

    // 3. Verify
    await captureSnapshot(page, 'final_result', 'GoogleSearch');
    
    await browser.close();
})();
```

### 3. API Reference

#### Core Actions (`src/logic/actions.ts`)
- `safeClick(target, selector)`: Robust click with logging.
- `safeType(target, selector, text)`: Robust typing.
- `findFrame(page, name)`: Smart frame locator.

#### Advanced Intelligence (`src/BrowsingLib.ts`)
- `systemDump()`: Complete state capture (Network, DOM, Accessibility, Visual).
- `visionAnalyze(desc, area?)`: Crop and analyze UI via `@agent/vision`.
- `inspectAt(x, y)`: DevTools-level element analysis at coordinates.
- `executeJS(code)`: Direct JS execution in the page context.
- `getNetworkLogs()`: Retrieve captured session traffic.

## 🛠 Script Execution Mode
Run complex TypeScript automation scripts directly via the CLI:
```bash
npm run browse script path/to/script.ts
```
The `BrowsingLib` instance is automatically injected into the `run` function of the script.

