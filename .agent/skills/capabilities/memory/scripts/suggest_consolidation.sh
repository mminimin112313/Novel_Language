#!/bin/bash
# Suggests consolidation if STM is not empty.

AGENT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../" && pwd)"
MEMORY_SCRIPT="${AGENT_ROOT}/capabilities/memory/memory_core.py"

CONTENT=$(python3 "$MEMORY_SCRIPT" stm_read)

if [[ "$CONTENT" == *"\"status\": \"empty\""* ]]; then
    exit 0
fi

echo ""
echo "🧠 [Memory Hygiene] You have items in Short-Term Memory."
echo "   Run 'python3 .agent/skills/capabilities/memory/memory_core.py consolidate' to save them to Long-Term Memory and clear the buffer."
echo "   Or use the alias: 'consolidate'"
