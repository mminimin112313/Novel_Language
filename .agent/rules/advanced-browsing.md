# Advanced Browsing Protocols

## 1. Zero-Failure Verification (SVP+)
For complex UI interactions (Login, Multi-step forms), ALWAYS use the advanced dump for verification:
- **Before Action**: Run `inspect-at` or `visual-map` to confirm state.
- **After Action**: Run `system-dump` and check `dom_structure.json` to verify state transition.

## 2. Vision Fallback Strategy
When a CSS selector fails or is unstable:
1. Capture a `screenshot`.
2. Use `vision-analyze` with a text description to locate the element.
3. If vision returns coordinates, use `click-at` or `move-mouse`.
4. Use `annotate` to mark the target for debugging logs.

## 3. Network-Aware Automation
For AJAX-heavy applications:
- After an action, check `get-network-logs` to ensure pending requests are finished.
- Analyze `network_logs.json` in dumps to identify API endpoints used by the site for more direct data extraction if possible.

## 4. Deep Inspection
If an element is unclickable or "hidden":
- Use `inspect-at` to check `computedStyle` (visibility, pointer-events).
- Check `hasListeners` to see if the element is interactive via JS.
- If blocked, use `execute-js` to force the action as a last resort.

## 5. Security & Privacy
- **Truncation**: `NetworkService` truncates payloads over 1000 characters.
- **Sensitive Data**: Avoid dumping network logs on pages with passwords or PII unless strictly necessary for debugging.
