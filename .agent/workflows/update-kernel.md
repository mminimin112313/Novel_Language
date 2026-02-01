---
description: Update the Agent Kernel and Skills from the origin repository.
---

# Self-Update Workflow

Use this workflow to pull the latest changes from the `.agent` repository and re-apply the kernel configuration.

## Steps

1.  **Pull Latest Changes**
    ```bash
    git -C .agent pull origin main
    ```

2.  **Re-Bootstrap Kernel**
    ```bash
    # // turbo
    python3 .agent/scripts/bootstrap.py
    ```

3.  **Verify Status**
    - Ensure the bootstrap script output says "✅ Agent Hooks injected successfully!".
