#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "[bootstrap] node is required" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[bootstrap] npm is required" >&2
  exit 1
fi

echo "[bootstrap] installing dependencies..." >&2
npm install

echo "[bootstrap] running typecheck/lint..." >&2
npm run lint

echo "[bootstrap] running tests..." >&2
npm test

echo "[bootstrap] generating plot-validation logs..." >&2
npm run plot:validate

echo "[bootstrap] done" >&2

