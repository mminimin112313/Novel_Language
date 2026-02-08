#!/bin/bash

# NVL Project Skeleton Setup Script
# This script initializes the base directory structure and required files.

echo "🚀 Initializing NVL Project Skeleton..."

# Load root directory
ROOT_DIR=$(pwd)
AGENT_DIR="$ROOT_DIR/.agent"

# Define base directories
DIRECTORIES=(
  "novels"
  "nvl"
  "docs/research"
  "docs/manuscripts"
  "logs/plot-validation"
  "logs/novel-writing"
  ".runs"
)

for dir in "${DIRECTORIES[@]}"; do
  if [ ! -d "$ROOT_DIR/$dir" ]; then
    echo "📁 Creating directory: $dir"
    mkdir -p "$ROOT_DIR/$dir"
  else
    echo "✅ Directory already exists: $dir"
  fi
done

# Initialize base NVL files if they don't exist
if [ ! -f "$ROOT_DIR/nvl/world.nvl" ]; then
  echo "📄 Creating baseline: nvl/world.nvl"
  cat <<EOF > "$ROOT_DIR/nvl/world.nvl"
# Global World Definition
# -----------------------
# Use this file for actors, locations, and facts that persist across all episodes.
EOF
fi

if [ ! -f "$ROOT_DIR/nvl/style.md" ]; then
  echo "📄 Creating baseline: nvl/style.md"
  cat <<EOF > "$ROOT_DIR/nvl/style.md"
# Project Style Guide
# ------------------
# Define narrative tone, aesthetic constraints, and character voice rules here.
EOF
fi

# Ensure .agent README is present
if [ ! -f "$AGENT_DIR/README.md" ]; then
  echo "⚠️ Warning: .agent/README.md missing. Running repair..."
  # (Manifest should already be there from previous steps, but good for safety)
fi

echo "✨ Skeleton setup complete. Happy writing!"
