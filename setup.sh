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

# 2. Setup Memory Skill (and its venv)
echo "🧠 Setting up Memory Skill..."
if [ -f ".agent/skills/capabilities/memory/setup.py" ]; then
    python3 .agent/skills/capabilities/memory/setup.py
else
    echo "⚠️ Warning: Memory setup script not found at .agent/skills/capabilities/memory/setup.py"
fi

# 3. Setup Browsing Skill
echo "🌐 Setting up Browsing Skill..."
if [ -d ".agent/skills/capabilities/browsing" ]; then
    cd .agent/skills/capabilities/browsing
    if [ -f "package.json" ]; then
        npm install
    fi
    cd - > /dev/null
else
    echo "⚠️ Warning: Browsing skill directory not found."
fi

# 4. Initialize Memory Structure
echo "📁 Initializing project structure..."
mkdir -p .agent/memory/nodes

echo "✅ Setup complete! You are ready to go with everything-antigravity."
