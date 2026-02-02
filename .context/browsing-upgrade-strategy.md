# Browsing Skill Upgrade Strategy

## Executive Summary
Upgrade our browsing skill by incorporating proven patterns from BrowserMCP while maintaining our existing CLI-first, Playwright-based architecture.

---

## Phase 1: Core Architecture Improvements

### 1.1 Zod Schema Validation (Priority: HIGH)
**Source**: BrowserMCP `tools/*.ts`
**Action**: Add Zod-based input validation to all commands.

```typescript
// Example: NavigationCommands.ts
import { z } from 'zod';
const NavigateParams = z.object({
    url: z.string().url(),
    waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle']).optional()
});
```

**Benefits**:
- Type-safe runtime validation
- Auto-generated JSON schemas for documentation
- Better error messages

---

### 1.2 ARIA Snapshot System (Priority: HIGH)
**Source**: BrowserMCP `utils/aria-snapshot.ts`
**Action**: Implement ARIA snapshot capture after each action.

```typescript
// New file: src/core/AriaSnapshotService.ts
export class AriaSnapshotService {
    async capture(page: Page): Promise<AriaSnapshot> {
        const url = page.url();
        const title = await page.title();
        const snapshot = await page.accessibility.snapshot();
        return { url, title, snapshot };
    }
}
```

**Benefits**:
- Semantic page state for AI agents
- Better action verification
- Reduced reliance on visual screenshots

---

### 1.3 Unified Tool Pattern (Priority: MEDIUM)
**Source**: BrowserMCP `tools/tool.ts`
**Action**: Standardize command interface.

```typescript
interface Tool {
    schema: {
        name: string;
        description: string;
        inputSchema: JsonSchema;
    };
    handle: (ctx: CommandContext, params: unknown) => Promise<ToolResult>;
}
```

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
