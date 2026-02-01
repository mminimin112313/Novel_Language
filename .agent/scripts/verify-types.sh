#!/bin/bash

# verify-types.sh
# Runs TypeScript compiler to check for type errors.

if ! command -v tsc &> /dev/null; then
    echo "⚠️ tsc not found. Skipping type check."
    exit 0
fi

echo "Running type verification..."
tsc --noEmit --skipLibCheck
