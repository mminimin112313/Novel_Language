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

# 2. Setup Environment Variables
echo "🔑 Setting up environment variables..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env from .env.example. Please update your API keys in .env"
    else
        touch .env
        echo "⚠️ .env.example not found, created empty .env"
    fi
else
    echo "ℹ️ .env already exists, skipping creation."
fi

# 3. Setup All Skills
echo "🔧 Setting up Skills..."

# Node.js Skills: Find all package.json files (excluding node_modules)
find .agent/skills -name "package.json" -not -path "*/node_modules/*" | while read package_file; do
    skill_dir=$(dirname "$package_file")
    echo "📦 Installing Node dependencies for: $skill_dir"
    (cd "$skill_dir" && npm install && npm run build --if-present || true)
done

# Python Skills: Find all requirements.txt files and setup .venv
find .agent/skills -name "requirements.txt" -not -path "*/node_modules/*" -not -path "*/.venv/*" | while read req_file; do
    skill_dir=$(dirname "$req_file")
    echo "🐍 Setting up Python Virtual Environment for: $skill_dir"
    (cd "$skill_dir" && \
     python3 -m venv .venv && \
     source .venv/bin/activate && \
     pip install --upgrade pip && \
     pip install -r requirements.txt && \
     deactivate)
done

echo "✅ Setup complete! You are ready to go with everything-antigravity."
