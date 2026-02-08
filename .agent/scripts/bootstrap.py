import os
import sys

def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"[CREATED] Directory: {path}")
    else:
        print(f"[EXISTS] Directory: {path}")

def update_gitignore():
    gitignore_path = ".gitignore"
    entries = [
        "# Agent Contexts",
        ".agent/contexts/active/",
        ".agent/scripts/"
    ]
    
    existing_lines = []
    if os.path.exists(gitignore_path):
        with open(gitignore_path, "r") as f:
            existing_lines = [line.strip() for line in f.readlines()]
    
    new_entries = [e for e in entries if e not in existing_lines]
    
    if new_entries:
        with open(gitignore_path, "a") as f:
            f.write("\n" + "\n".join(new_entries) + "\n")
        print(f"[UPDATED] .gitignore with {len(new_entries)} new entries.")
    else:
        print("[OK] .gitignore is up to date.")

def main():
    root_dir = os.getcwd()
    agent_dir = os.path.join(root_dir, ".agent")
    
    print(f"Bootstrapping Agent Environment in: {root_dir}")
    
    # 1. Define Directory Structure
    dirs = [
        ".agent/contexts/active",
        ".agent/contexts/history/work_logs",
        ".agent/contexts/history/decisions",
        ".agent/contexts/reference",
        ".agent/contexts/project",
        ".agent/contexts/personas",
        ".agent/scripts",
        ".agent/workflows",
        ".agent/rules"
    ]
    
    # 2. Create Directories
    for d in dirs:
        create_directory(os.path.join(root_dir, d))
        
    # 3. Git Configuration
    update_gitignore()
    
    # 4. Check for Skills (Optional Warning)
    work_logger_path = os.path.join(agent_dir, "skills/knowledge/work-logger/SKILL.md")
    if not os.path.exists(work_logger_path):
        print("[WARN] WorkLogger skill is missing. You may needed to run: /update-kernel")
    else:
        print("[OK] WorkLogger skill detected.")
        
    print("\nBootstrap Complete. Environment is ready.")

if __name__ == "__main__":
    main()
