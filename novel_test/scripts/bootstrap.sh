#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "[bootstrap] node is required (>=20)" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[bootstrap] npm is required" >&2
  exit 1
fi

NODE_MAJOR="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "[bootstrap] node >=20 is required. current: $(node -v)" >&2
  exit 1
fi

echo "[bootstrap] installing dependencies..."
npm install

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
  echo "[bootstrap] created .env from .env.example"
fi

mkdir -p .runs logs novels

echo "[bootstrap] running checks..."
npm run setup:doctor
npm run lint
npm run test
npm run plot:validate

echo "[bootstrap] done"
echo "next: npm run dev"
echo "for long-form writing: npm run novel:write -- --concept \"...\" --title \"...\" --chapters 5"
