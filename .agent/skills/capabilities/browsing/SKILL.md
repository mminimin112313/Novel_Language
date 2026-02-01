---
name: browsing
description: Control a web browser locally to navigate, take screenshots (snapshots), and interact with websites. Best for web automation tasks.
---

# Browsing Skill

This skill allows you to control a local web browser using Playwright. It is designed to mimic a human cognitive process, separating "Memory/Knowledge" (Brain) from "Work Output" (Workspace).

## 🧠 Cognitive Architecture

This skill uses a bio-inspired memory structure located in `.agent/skills/capabilities/browsing/brain/`. You must use this to maintain context and learn from your interactions.

- **Sensory Memory** (`brain/sensory/`):
    - **Usage**: When you capture a snapshot or see something temporary, think of it here.
    - **Action**: "I see X on the page."

- **Constitution**: [CONSTITUTION.md](src/subskills/memory/CONSTITUTION.md) - **READ THIS** for rules on when to update memory.

- **Short-Term Memory** (`brain/short_term/`):
    - **Usage**: Store your *current* mission status, active selectors you are testing, or temporary variables.
    - **Action**: "I am currently on Step 2 of the login flow."

## 🔄 High-Precision Execution Process (SVP)
To ensure zero-failure automation, follow this cycle:

1.  **DETECT (Structure)**: Run `visual-map` to identify the UI layout and frame hierarchy.
2.  **OBSERVE (Details)**: Capture `screenshot` and use `inspect-at` to pin down exact coordinates.
3.  **PLAN (Protocol)**: Draft a `run-protocol` JSON that batches all interactions.
4.  **EXECUTE (Action)**: Run the protocol at high speed.
5.  **VERIFY (Outcome)**: Capture final snapshots and record patterns in `brain`.

- **Long-Term Memory** (`brain/long_term/`):
    - **Episodic** (`episodic/`): Logs of past sessions. **Check this before starting** to see if you've failed this task before.
    - **Semantic** (`semantic/`): **Verified Knowledge**. If you successfully identify a stable selector (e.g., `#login-button`), SAVE IT here. Future sessions should look here first.

## 🔄 High-Precision Execution Process (SVP)
Every high-stakes browsing task (Login, CAPTCHA, Scraping) MUST follow the **Structural Verification Protocol**:

1.  **Detection Phase**: Run `visual-map` or `list-elements` to understand the page structure and frame hierarchy.
2.  **Observation Phase**: Capture a `screenshot` and use `inspect-at` to verify coordinates or selectors.
3.  **Planning Phase**: Design a JSON protocol (`run-protocol`) that accounts for the detected structure.
4.  **Execution Phase**: Execute the protocol and verify outcomes via final-state snapshots.
5.  **Learning Phase**: record success patterns into `brain/long_term/semantic/`.

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
// Example: Naver Blog Post Flow
import { chromium } from 'playwright-core';
import { openEditor, handlePopup, writePost } from '../src/blocks/naver/editor.js';
import { captureSnapshot } from '../src/blocks/common/utils.js';

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    
    // 1. Open
    await openEditor(page);
    
    // 2. Handle Popup
    await handlePopup(page);
    
    // 3. Write
    await writePost(page, {
        title: "Hello from TS Blocks",
        content: "This is a dynamic test.",
        components: { hr: true, quote: true }
    });

    // 4. Verify
    await captureSnapshot(page, 'final_result', 'PostWriteForm');
    
    await browser.close();
})();
```

### 3. API Reference

#### Core Actions (`src/logic/actions.ts`)
- `safeClick(target, selector)`: Robust click with logging.
- `safeType(target, selector, text)`: Robust typing.
- `findFrame(page, name)`: Smart frame locator.

#### Naver Blocks (`src/blocks/naver/editor.ts`)
- `openEditor(page)`: Navigates to write page.
- `handlePopup(page)`: Dismisses draft recovery.
- `writePost(page, options)`: Fills title and content.
