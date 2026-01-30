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

### `click-at <x> <y>`
Clicks at precise coordinates. Essential for CAPTCHA solving.
```bash
# Coordinate values are obtained via list-elements or visual analysis
npm run browse click-at 100 200
```

### `list-elements`
Lists interactive elements with their bounding boxes (x, y, width, height).
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
