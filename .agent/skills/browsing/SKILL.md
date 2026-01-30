---
name: browsing
description: Control a web browser locally to navigate, snapshot, and interact with websites using a cognitive architecture.
---

# Browsing Skill

This skill allows you to control a local web browser using Playwright. It is designed to mimic a human cognitive process, separating "Memory/Knowledge" (Brain) from "Work Output" (Workspace).

## 🧠 Cognitive Architecture

This skill uses a bio-inspired memory structure located in `.agent/skills/browsing/brain/`. You must use this to maintain context and learn from your interactions.

- **Sensory Memory** (`brain/sensory/`):
    - **Usage**: When you capture a snapshot or see something temporary, think of it here.
    - **Action**: "I see X on the page."

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
cd .agent/skills/browsing
npm install
npm run build
```

## Usage

### Full Command List

| Command | Arguments | Description |
|---|---|---|
| `open` | `<url>` | Opens a URL in the persistent context. |
| `click` | `<selector>` | Selector-based click. |
| `click-at` | `<x> <y>` | **Pinpoint**: Absolute coordinate click (Human-like). |
| `type` | `<selector> <text>` | Human-like typing with jitter. |
| `inspect-at`| `<x> <y>` | **Optimization**: Hit-test element at coordinates (99% token saving). |
| `visual-map`| - | **Optimization**: Pruned, weighted visual tree for navigation. |
| `snapshot` | - | **Optimization**: Cleaned HTML (Scripts/Styles removed). |
| `extract` | `<url> [sel]` | Markdown-first content extraction. |
| `list-elements`| - | Recursive discovery of interactive elements + bounds. |
| `human-search`| `<query>` | Anti-bot Google search flow. |
| `screenshot` | `<name>` | **Saves to root `browsing_dump/`**. |

## 🧬 Memory Maintenance & Cleanup

To maintain cognitive efficiency and prevent token bloat, follow the **Bio-inspired Cleanup Protocol**:

1. **Episodic Compression**: At the end of each session, summarize long episodic logs in `brain/long_term/episodic/` and archive old raw JSONs to `browsing_dump/archive/`.
2. **Semantic Extraction**: Move repeatedly successful patterns (selectors, coordinates) from episodic memory to `brain/long_term/semantic/`.
3. **Sensory Flush**: Clear `brain/sensory/` contents after the current task is completed.
4. **Dump Management**: Periodically purge the root `browsing_dump/` directory of temporary screenshots.



## 🛠️ Tools Directory

This skill includes a `tools/` folder for specialized data processing.

- **Markdown Extraction**: Automatically converts complex HTML into clean, readable Markdown using `turndown`.
- **Structural Discovery**: Uses specialized scripts (`element_discovery.ts`) to map the page's interactive surface area, making it easier for agents to select the right buttons.



### Running External Workflows

You can run JSON command files located anywhere on your system. This allows you to keep project-specific workflows separate from the generic skill.

```bash
# Example: Run a specific workflow from your project root
npm run browse run-file c:/Users/mskim/projects/naverblog/naver_workflows/core/login_humanlike.json
```

### Generic Example

```bash
# Run the built-in example
npm run browse run-file commands/examples/google_search.json
```

## Learning Protocol

1. **Before Action**: Check `brain/long_term/semantic` for known selectors/rules for the current domain.
2. **After Success**: If you found a new reliable selector/pattern, create a new file in `brain/long_term/semantic/` (e.g., `duckduckgo_rules.json`) to "learn" it.
3. **After Failure**: Log the failure in `brain/long_term/episodic/` so you don't repeat the mistake.
