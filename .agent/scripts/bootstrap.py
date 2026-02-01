#!/usr/bin/env python3
import os
import sys
import json
import shutil
from pathlib import Path

# --- Configuration ---
AGENT_ROOT = Path(__file__).parent.parent.parent.absolute()
CONFIG_TEMPLATE = AGENT_ROOT / ".agent/config/settings.hooks.json"

# Potential Settings Paths (Priority Order)
SETTINGS_PATHS = [
    Path.home() / "Library/Application Support/Antigravity/User/settings.json",
    Path.home() / "Library/Application Support/Code/User/settings.json",
    Path.home() / ".config/Code/User/settings.json",
    Path.home() / ".vscode-server/data/Machine/settings.json"
]

def find_settings_file():
    for path in SETTINGS_PATHS:
        if path.exists():
            return path
    return None

def merge_hooks(user_settings, agent_hooks):
    """
    Intelligently merges agent hooks into user settings.
    Overwrites conflicting hooks but preserves other user configs.
    """
    if "hooks" not in user_settings:
        user_settings["hooks"] = {}
    
    # Simple deep merge for the 'hooks' key
    # We replace the specific Pre/PostToolUse lists completely to ensure state consistency
    # (Future improvement: Append instead of replace if users have custom hooks)
    for key, value in agent_hooks["hooks"].items():
        user_settings["hooks"][key] = value
    
    return user_settings

def bootstrap():
    print(f"🚀 Bootstrapping Agent Kernel from: {AGENT_ROOT}")
    
    # 1. Locate Settings
    target_settings = find_settings_file()
    if not target_settings:
        print("❌ Could not find VSCode/Antigravity settings.json.")
        sys.exit(1)
    
    print(f"📂 Found settings file: {target_settings}")

    # 2. Load Template & Interpolate
    with open(CONFIG_TEMPLATE, "r") as f:
        template_str = f.read()
    
    # Interpolate ${AGENT_ROOT}
    template_str = template_str.replace("${AGENT_ROOT}", str(AGENT_ROOT))
    agent_config = json.loads(template_str)

    # 3. Backup & Load User Settings
    if target_settings.exists():
        backup_path = target_settings.with_suffix(".json.bak")
        shutil.copy(target_settings, backup_path)
        print(f"💾 Backed up settings to: {backup_path}")
        
        try:
            with open(target_settings, "r") as f:
                user_settings = json.load(f)
        except json.JSONDecodeError:
            print("⚠️  User settings.json was invalid JSON. Starting fresh.")
            user_settings = {}
    else:
        user_settings = {}

    # 4. Merge & Write
    new_settings = merge_hooks(user_settings, agent_config)
    
    with open(target_settings, "w") as f:
        json.dump(new_settings, f, indent=4)
    
    print("✅ Agent Hooks injected successfully!")
    print("🎉 System is active. Example: Run a tool to trigger observation.")

    # 5. Make Scripts Executable
    print("🔧 Setting permissions...")
    os.system(f"chmod +x '{AGENT_ROOT}/.agent/skills/core/continuous-learning/hooks/observe.sh'")
    os.system(f"chmod +x '{AGENT_ROOT}/.agent/skills/core/strategic-compact/suggest-compact.sh'")

if __name__ == "__main__":
    bootstrap()
