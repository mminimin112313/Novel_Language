# AGENTS.md

## First-Run Bootstrap (Mandatory)

When this repository is cloned and opened, run this before any task:

```bash
bash scripts/bootstrap.sh
```

This command installs dependencies, prepares local env placeholders, runs lint/tests, and generates baseline plot-validation logs.

For environment diagnosis only:

```bash
npm run setup:doctor
```

## Novel Writing Commands

- Full novel workflow:

```bash
npm run novel:write -- --concept "..." --title "..." --chapters 5 --style Cinematic
```

- Single chapter pipeline:

```bash
npm run pipeline -- "chapter direction" Cinematic
```

## Quality Gate

Before commit, run:

```bash
npm run lint
npm run test
npm run plot:validate
```
