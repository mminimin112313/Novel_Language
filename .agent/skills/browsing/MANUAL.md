# Browsing Skill Manual (Systematic Guide)

Welcome to the enhanced **Browsing Skill** manual. This documentation covers the SOLID-refactored architecture, advanced interaction tools, and token optimization strategies.

## 🏗️ Architecture Overview (SOLID)
The skill is built on modular services to ensure robustness and extensibility:
- **`BrowserManager`**: Handles persistent sessions and tab orchestration.
- **`InteractionService`**: Executes human-like inputs (jitter, Bezier mouse moves).
- **`VisualService`**: Maps visual coordinates for CAPTCHA resolution.
- **`DiscoveryService`**: Analyzes page structure and provides interactive element lists.
- **`RefinementService`**: Processes raw HTML into clean, LLM-ready Markdown.
- **`CommandRegistry`**: Decouples CLI commands from implementation.

---

## 🛠️ CLI Command Reference

### `open <url>`
Opens a URL in the persistent browser context.
```bash
npm run browse open "https://google.com"
```

### `human-search <query>`
Performs a search by navigating to google.com and typing like a human. This is less likely to trigger bot detection.
```bash
npm run browse human-search "IU 2024 album"
```

### `snapshot` (Token Optimized)
Captures page HTML. **Optimizations:** Scripts, styles, and SVGs are removed to save tokens. Output is limited to 500KB.
```bash
npm run browse snapshot
```

### `extract <url> [selector]`
Navigates to a page and returns its content as Markdown. Ideal for reading articles.
```bash
npm run browse extract "https://en.wikipedia.org/wiki/IU_(singer)"
```

### `multi-click-at <x1> <y1> <x2> <y2> ...` (Batch Interaction)
Clicks multiple points sequentially in a single command. Extremely fast for CAPTCHA grid selection.
```bash
npm run browse multi-click-at 100 200 150 250 200 300
```

### `run-protocol <json_or_file>` (Scripting)
Executes a sequence of commands from a JSON string or file. Supports automatic screenshots per step.
**Format:**
```json
[
  { "command": "click-at", "args": [41, 91], "screenshot": true },
  { "command": "wait", "args": [1000] },
  { "command": "multi-click-at", "args": [100, 100, 200, 200], "label": "grid_select" }
]
```
**Usage:**
```bash
npm run browse run-protocol protocol.json
```

### `inspect-at <x> <y>` (Pinpoint Optimization)

Returns the tag name, text content, and bounding box of the specific element at coordinates using `elementFromPoint`.
**Why use this?** 99% token saving compared to `snapshot`.
```bash
npm run browse inspect-at 640 360
```

### `visual-map` (Visual Pruning)
Returns a pruned, interactivity-weighted list of all visible elements in the viewport.
**Features:**
- Filters non-visible (zero-size) nodes.
- Weights elements with `cursor: pointer` or active scripts.
- Highly token-efficient structural overview.
```bash
npm run browse visual-map
```

## 🛠️ Reliability & Debugging (Hierarchical)

This skill follows a hierarchical workspace schema for perfect traceability:
1. **Session-Based Isolation**: Every execution has its own folder in `browsing_dump/sessions/`.
2. **Screenshots & Logs**: Screenshots and JSON traces are separated within the session folder.
3. **Panic Support**: If a protocol fails, a `PANIC_stepN.png` and `panic_dump.json` are created in the session root.
4. **Final Reports**: Use the `report_` prefix in `screenshot` to save to the global `reports/` folder.

### `list-elements`
Lists interactive elements with their bounding boxes.

```bash
npm run browse list-elements
```

---

## 📂 Output Management (`browsing_dump`)
All artifacts generated during browsing are saved to the **root `browsing_dump` folder**:
- **Screenshots**: `browsing_dump/screenshot_TIMESTAMP.png`
- **Search Previews**: `browsing_dump/google_search_TIMESTAMP.png`

---

## 🛡️ CAPTCHA Strategy
When a CAPTCHA is encountered:
1.  **Snapshot/Screenshot**: Confirm the challenge type visually.
2.  **`list-elements`**: Locate the reCAPTCHA iframe and its coordinates.
3.  **Coordinate Calculation**: Use `VisualService` logic to map grid cells to page coordinates.
4.  **Sequential `click-at`**: Execute clicks on the required cells followed by the "Verify" button.

---

## 🚀 Efficiency Tips
- **Markdown over HTML**: Prefer `extract` over `snapshot` to minimize token consumption.
- **Human Search**: Always use `human-search` for Google queries to maintain a high session reputation.
- **Tab Reuse**: The skill uses a persistent context; avoid closing the browser unless necessary.
