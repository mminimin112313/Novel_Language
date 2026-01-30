#!/usr/bin/env python3
import subprocess
import os
import sys
from pathlib import Path

def run_command(cmd, cwd=None):
    try:
        subprocess.run(cmd, cwd=cwd, check=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command {' '.join(cmd)}: {e.stderr}", file=sys.stderr)
        return False

def setup():
    skill_dir = Path(os.path.dirname(os.path.realpath(__file__)))
    venv_dir = skill_dir / ".venv"
    pip_bin = venv_dir / ("Scripts" if os.name == "nt" else "bin") / ("pip.exe" if os.name == "nt" else "pip")
    python_bin = venv_dir / ("Scripts" if os.name == "nt" else "bin") / ("python.exe" if os.name == "nt" else "python3")

    print(f"Setting up environment in {venv_dir}...")

    # 1. Create venv if not exists
    if not venv_dir.exists():
        if not run_command([sys.executable, "-m", "venv", str(venv_dir)]):
            return False

    # 2. Install dependencies
    dependencies = ["numpy", "sentence-transformers"]
    print(f"Installing dependencies: {', '.join(dependencies)}...")
    # Use python -m pip instead of calling pip directly
    if not run_command([str(python_bin), "-m", "pip", "install"] + dependencies):
        return False

    # 3. Verify
    print("Verifying installation...")
    verification_code = "import numpy; import sentence_transformers; print('Success')"
    if not run_command([str(python_bin), "-c", verification_code]):
        return False

    print("Setup completed successfully.")
    return True

if __name__ == "__main__":
    if setup():
        sys.exit(0)
    else:
        sys.exit(1)
