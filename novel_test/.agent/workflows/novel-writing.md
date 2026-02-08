
# Workflow: Novel Writing (AI-Direct)

This workflow is designed for the AI agent to follow directly using the core NVL engine.

## Step 1: Research & Plan
1.  Search for genre-specific tropes.
2.  Define the story concept and title.
3.  Create/Update `world.nvl` in the project directory.

## Step 2: Architecture (NVL Scripting)
1.  Follow instructions in `nvl-architect` skill.
2.  Write `chapter-XX.nvl` based on story beats.
3.  **Validate**: Run `npm run compile:file -- <path-to-nvl>`.
4.  **Repair**: If errors exist, fix them until `result=SUCCESS`.

## Step 3: Novelist (Prose Rendering)
1.  Follow instructions in `nvl-novelist` skill.
2.  Read the **Compilation Log** from the previous step.
3.  Render the prose into `chapter-XX.md` using the log as the absolute source of truth.
4.  Ensure **5x expansion** ratio and requested style.

## Step 4: Verification
1.  Run `nvl-consistency-auditor` or AQL queries to check plot holes.
2.  Run `nvl-korean-proofreader` on the final prose.
