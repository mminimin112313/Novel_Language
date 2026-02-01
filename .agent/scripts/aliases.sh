#!/bin/bash

# Memory Aliases
# Source this file in your ~/.zshrc or similar to get shortcuts

ALIAS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../" && pwd)"
MEMORY_SCRIPT="$ALIAS_ROOT/.agent/skills/capabilities/memory/memory_core.py"

# Quick Shortcuts
alias remem="python3 \"$MEMORY_SCRIPT\" search"
alias memo="python3 \"$MEMORY_SCRIPT\" record"
alias forget="python3 \"$MEMORY_SCRIPT\" reset"

echo "🧠 Memory aliases loaded: remem, memo, forget"
