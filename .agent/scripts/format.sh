#!/bin/bash

# format.sh
# Formats code using Prettier.

if ! command -v prettier &> /dev/null; then
    echo "⚠️ prettier not found. Skipping format."
    exit 0
fi

echo "Formatting modified files..."
# Basic implementation: format everything, or just modified files if more complex logic added.
# For now, let's keep it simple and safe - user might not want to reformat whole repo.
# We will just verify or format if args provided.

if [ "$#" -eq 0 ]; then
    echo "Usage: ./format.sh <files>"
    exit 1
fi

prettier --write "$@"
