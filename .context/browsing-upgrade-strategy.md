# Browsing Skill Upgrade Strategy

## Executive Summary
Upgrade our browsing skill by incorporating proven patterns from BrowserMCP while maintaining our existing CLI-first, Playwright-based architecture.

---

## Phase 1: Core Architecture & Persistence (Priority: CRITICAL)

### 1.1 MCP Server Mode Implementation
**Goal**: Convert the skill from a stateless CLI to a long-lived MCP Server to maintain browser sessions in memory.
- **New File**: `src/server.ts` - Implements MCP Stdio transport and tool handlers.
- **Modify**: `package.json` - Add `@modelcontextprotocol/sdk`.

### 1.2 Enhanced Browser Persistence
- **Modify**: `BrowserManager.ts` to better handle CDP reconnection and persistent user data.
- Ensure the browser instance is manageable as a singleton within the server process.

### 1.3 Zod Schema Validation
(Existing plan)

### 1.4 ARIA Snapshot System
(Existing plan)

---

## Phase 2: New Features

### 2.1 Drag & Drop Support
**Source**: BrowserMCP `tools/snapshot.ts` (drag tool)
**Action**: Add to InteractionCommands.

### 2.2 Select Option Tool
**Source**: BrowserMCP `tools/snapshot.ts` (selectOption)
**Action**: Add dropdown selection support.

### 2.3 Console Logs Capture
**Source**: BrowserMCP `tools/custom.ts` (getConsoleLogs)
**Action**: Add persistent console log capture to NetworkService.

### 2.4 Press Key Tool
**Source**: BrowserMCP `tools/common.ts`
**Action**: Add keyboard key press command.

---

## Phase 3: Communication Layer (Optional)

### 3.1 MCP Server Mode
**Consideration**: Add optional MCP server mode for direct agent integration.
**Complexity**: HIGH - requires new entry point.

### 3.2 WebSocket Transport
**Consideration**: For browser extension integration.
**Defer**: Until concrete use case emerges.

---

## Implementation Order

| Step | Item | Files to Modify | Est. Effort |
|------|------|-----------------|-------------|
| 1 | Add Zod dependency | `package.json` | 5 min |
| 2 | Create `zod-schemas.ts` | `src/core/` | 30 min |
| 3 | Add AriaSnapshotService | `src/core/` | 45 min |
| 4 | Update all commands with schemas | `src/commands/*.ts` | 2 hrs |
| 5 | Add drag, selectOption | `InteractionCommands.ts` | 1 hr |
| 6 | Add consoleLogs, pressKey | New commands | 1 hr |
| 7 | Integrate ARIA into action flow | `BrowsingLib.ts` | 1 hr |

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Breaking existing CLI interface | Keep backward compatibility, add new methods |
| Performance overhead from ARIA | Make ARIA capture opt-in |
| Zod bundle size | Use tree-shaking in build |
