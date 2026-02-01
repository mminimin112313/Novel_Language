#!/bin/bash

# check-console-log.sh
# Scans git-modified files for 'console.log' statements.
# Returns exit code 1 if found (blocking), 0 if clean.

# detected_files=$(git diff --name-only --cached --diff-filter=ACMR | grep -E "\.(js|ts|tsx|jsx)$" || true)
# Also check non-staged modified files
modified_files=$(git diff --name-only --diff-filter=ACMR | grep -E "\.(js|ts|tsx|jsx)$" || true)
staged_files=$(git diff --name-only --cached --diff-filter=ACMR | grep -E "\.(js|ts|tsx|jsx)$" || true)

# Combine and deduplicate
files=$(echo "$modified_files
$staged_files" | sort | uniq | grep -v "^$")

if [ -z "$files" ]; then
  # echo "No JS/TS files modified."
  exit 0
fi

found_log=0

for file in $files; do
  if [ -f "$file" ]; then
    if grep -n "console.log" "$file" > /dev/null; then
       echo "❌ console.log detected in $file"
       grep -n "console.log" "$file"
       found_log=1
    fi
  fi
done

if [ "$found_log" -eq 1 ]; then
  echo "⚠️  Please remove console.log before finishing (or use console.info/error if intended)."
  exit 1
fi

echo "✅ No console.log found in modified files."
exit 0
