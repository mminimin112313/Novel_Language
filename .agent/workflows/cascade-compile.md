---
description: Cascade compile world + prior episodes + target, then write prose using style/voice files
---

# Cascade Compile & Write Workflow

This workflow compiles the cumulative NVL state and generates prose.

## Prerequisites
- `world.nvl` exists in `<project>/nvl/`
- Prior episodes are in `<project>/phase_XX/chapter_XX/epXX.nvl` format
- `character_voices.md` and `cyberfunk-noir-style.md` exist

## Steps

// turbo-all

### 1. Cascade Compile

```bash
npm run compile:cascade -- "<project-dir>" "<target-episode.nvl>"
```

Example:
```bash
npm run compile:cascade -- "cyberfunk noir" phase_01/chapter_01/ep03.nvl
```

**Expected Output**: `[CASCADE] ✅ Compilation PASSED`

If compilation fails, fix the errors in the target NVL before proceeding.

---

### 2. Load Style Context

Before writing prose, load:
1. `.agent/rules/cyberfunk-noir-style.md` → Aesthetic guide
2. `<project>/nvl/character_voices.md` → Voice profiles

---

### 3. Write Prose

Use `nvl-episode-writer` skill with:
- The compiled NVL events as source-of-truth
- Style constraints from the loaded files
- Pacing metrics from `cyberfunk-noir-style.md`

Output: `<project>/phase_XX/chapter_XX/epXX.txt`

---

### 4. Review & Proofread

Run `nvl-episode-reviewer` and `nvl-korean-proofreader` on the output.

---

## Quick Command Reference

| Step | Command |
|:-----|:--------|
| Cascade Compile | `npm run compile:cascade -- "cyberfunk noir" phase_01/chapter_01/ep03.nvl` |
| Single Compile | `npm run compile:file -- <path>` |
| AQL Query | `npm run aql -- <path> "<query>"` |
