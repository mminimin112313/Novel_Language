#!/bin/bash
# Checks if there is anything in Short-Term Memory and reminds the agent.

AGENT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../" && pwd)"
MEMORY_SCRIPT="${AGENT_ROOT}/capabilities/memory/memory_core.py"

# Read STM
CONTENT=$(python3 "$MEMORY_SCRIPT" stm_read)

# If it returns generic "empty" (json), ignore.
if [[ "$CONTENT" == *"\"status\": \"empty\""* ]]; then
    exit 0
fi

# Otherwise, print it to remind the agent
echo ""
echo "🧠 [Short-Term Memory] Active Context found:"
echo "$CONTENT"
echo "---------------------------------------------------"
