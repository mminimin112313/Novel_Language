#!/bin/bash

# everything-antigravity Root Setup Script
# This script initializes the environment for all skills and core components.

set -e

echo "🚀 Starting everything-antigravity setup..."

# 1. Environment Check
echo "🔍 Checking runtimes..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18+) to continue."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.9+ to continue."
    exit 1
fi

# 2. Setup All Skills
echo "🔧 Setting up Skills..."

# Find all package.json files in .agent/skills (excluding node_modules) and run npm install
find .agent/skills -name "package.json" -not -path "*/node_modules/*" | while read package_file; do
    skill_dir=$(dirname "$package_file")
    echo "📦 Installing Node dependencies for: $skill_dir"
    (cd "$skill_dir" && npm install)
done

# Find all setup.py files in .agent/skills (excluding node_modules/venv) and run python setup
find .agent/skills -name "setup.py" -not -path "*/node_modules/*" -not -path "*/.venv/*" | while read setup_file; do
    skill_dir=$(dirname "$setup_file")
    echo "🐍 Installing Python dependencies for: $skill_dir"
    (cd "$skill_dir" && python3 setup.py)
done

# 4. (Memory Structure init removed by user request)

echo "✅ Setup complete! You are ready to go with everything-antigravity."
