---
trigger: always_on
---

# Hooks System

## Hook Types

- **PreToolUse**: Before tool execution (validation, parameter modification)
- **PostToolUse**: After tool execution (auto-format, checks)
- **Stop**: When session ends (final verification)

## Current Hooks (in ~/.claude/settings.json)

### PreToolUse
- **tmux reminder**: Suggests tmux for long-running commands (npm, pnpm, yarn, cargo, etc.)
- **git push review**: Opens Zed for review before push
- **doc blocker**: Blocks creation of unnecessary .md/.txt files
- **Memory First**: Always run `remem "context"` before starting complex tasks.

### PostToolUse
- **PR creation**: Logs PR URL and GitHub Actions status
- **Prettier**: Auto-formats JS/TS files after edit
- **TypeScript check**: Runs tsc after editing .ts/.tsx files
- **console.log warning**: Warns about console.log in edited files

### Stop
- **console.log audit**: Checks all modified files for console.log before session ends
- **Memory Last**: Always run `memo "summary"` or `memo "lesson learned"` before ending a session.
    - Run manually: `./.agent/scripts/check-console-log.sh`

## Executable Helpers
The agent can use the following scripts to enforce these hooks:
- **Type Check**: `./.agent/scripts/verify-types.sh`
- **Format**: `./.agent/scripts/format.sh <files>`
- **Console Log**: `./.agent/scripts/check-console-log.sh`

## Auto-Accept Permissions

Use with caution:
- Enable for trusted, well-defined plans
- Disable for exploratory work
- Never use dangerously-skip-permissions flag
- Configure `allowedTools` in `~/.claude.json` instead

## TodoWrite Best Practices

Use TodoWrite tool to:
- Track progress on multi-step tasks
- Verify understanding of instructions
- Enable real-time steering
- Show granular implementation steps

Todo list reveals:
- Out of order steps
- Missing items
- Extra unnecessary items
- Wrong granularity
- Misinterpreted requirements
