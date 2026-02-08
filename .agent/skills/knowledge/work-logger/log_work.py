import argparse
import os
import datetime
import re

def slugify(text):
    text = text.lower()
    return re.sub(r'[\W_]+', '-', text).strip('-')

def main():
    parser = argparse.ArgumentParser(description="Log work outcome to history.")
    parser.add_argument("--status", required=True, choices=["SUCCESS", "FAILURE", "PARTIAL"])
    parser.add_argument("--task", required=True)
    parser.add_argument("--outcome", required=True)
    parser.add_argument("--context", default="")
    parser.add_argument("--artifacts", default="")
    parser.add_argument("--reflection", default="")

    args = parser.parse_args()

    # Setup paths
    history_dir = os.path.join(os.getcwd(), ".agent/contexts/history/work_logs")
    os.makedirs(history_dir, exist_ok=True)

    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_slug = datetime.datetime.now().strftime("%Y-%m-%d")
    task_slug = slugify(args.task)[:50]
    filename = f"{date_slug}_{task_slug}.md"
    filepath = os.path.join(history_dir, filename)

    # Content construction
    content = f"# [{args.status}] {args.task}\n\n"
    content += f"**Date**: {timestamp}\n"
    content += f"**Status**: {args.status}\n\n"
    
    content += "## Outcome\n"
    content += f"{args.outcome}\n\n"

    if args.context:
        content += "## Context\n"
        content += f"{args.context}\n\n"

    if args.reflection:
        content += "## Reflections\n"
        content += f"{args.reflection}\n\n"
    
    if args.artifacts:
        content += "## Artifacts\n"
        for artifact in args.artifacts.split(','):
            content += f"- `{artifact.strip()}`\n"
        content += "\n"
    
    # Append if file exists (for multi-step logs) or write new
    mode = "a" if os.path.exists(filepath) else "w"
    if mode == "a":
        content = f"\n---\n\n{content}"

    with open(filepath, mode) as f:
        f.write(content)
    
    print(f"Work log saved to: {filepath}")

if __name__ == "__main__":
    main()
