# Browsing Skill Comparison: Ours vs BrowserMCP

## Architecture Comparison

| Aspect | Our Browsing Skill | BrowserMCP |
|--------|-------------------|------------|
| **Core Technology** | Playwright-core (direct control) | MCP SDK + WebSocket (extension relay) |
| **Entry Point** | CLI (`node dist/index.js`) | MCP Server (`mcp-server-browsermcp`) |
| **Communication** | Direct IPC / CLI args | WebSocket to browser extension |
| **Input Validation** | Manual / Ad-hoc | Zod schemas with JSON Schema export |
| **State Representation** | Screenshots + DOM dumps | ARIA snapshots (accessibility tree) |
| **Session Management** | BrowserManager (persistent) | Context class (WebSocket-based) |

---

## Feature Comparison

| Feature | Ours | BrowserMCP | Gap Action |
|---------|------|-----------|------------|
| Navigate | ✅ | ✅ | - |
| Click | ✅ | ✅ | - |
| Type/Fill | ✅ | ✅ | - |
| Screenshot | ✅ | ✅ | - |
| **Snapshot (ARIA)** | ❌ | ✅ | **Add** |
| Hover | ✅ | ✅ | - |
| **Drag & Drop** | ❌ | ✅ | **Add** |
| **Select Option** | ❌ | ✅ | **Add** |
| Go Back/Forward | ❌ | ✅ | **Add** |
| Wait | ✅ | ✅ | - |
| **Press Key** | ❌ | ✅ | **Add** |
| **Console Logs** | ❌ | ✅ | **Add** |
| Execute JS | ✅ | ❌ | Keep |
| Network Logs | ✅ | ❌ | Keep |
| Vision/OCR | ✅ | ❌ | Keep |
| System Dump | ✅ | ❌ | Keep |
| DOM Structure | ✅ | ❌ | Keep |
| Visual Map | ✅ | ❌ | Keep |
| Content Extraction (Markdown) | ✅ | ❌ | Keep |

---

## Service Layer Comparison

| Our Services | Purpose | BrowserMCP Equivalent |
|--------------|---------|----------------------|
| BrowserManager | Browser lifecycle | Context (WebSocket) |
| InteractionService | Click, type, hover | snapshot.ts tools |
| DiscoveryService | DOM, accessibility, visual map | aria-snapshot.ts |
| VisualService | Screenshot annotation | - |
| VisionService | OCR, image analysis | - |
| NetworkService | Request/response capture | - |
| RefinementService | HTML → Markdown | - |
| CacheService | Response caching | - |

---

## Key Takeaways

### BrowserMCP Strengths to Adopt:
1. **Zod Schema Validation** - Type-safe, self-documenting
2. **ARIA Snapshots** - Semantic state representation for AI
3. **Modular Tool Pattern** - Clean separation of concerns
4. **Console Logs Capture** - Debugging support

### Our Unique Strengths to Preserve:
1. **Playwright Direct Control** - More powerful, no extension needed
2. **Vision/OCR Integration** - Unique capability
3. **System Dump** - Comprehensive state capture
4. **Network Interception** - Full request/response logging
5. **Content Extraction** - Markdown conversion
