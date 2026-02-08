#!/usr/bin/env bash
set -euo pipefail

echo "[verify] setup doctor"
npm run setup:doctor

echo "[verify] type checks"
npm run lint

echo "[verify] unit/integration tests"
npm run test

echo "[verify] plot validation"
npm run plot:validate

echo "[verify] done"
