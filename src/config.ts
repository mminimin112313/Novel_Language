import path from "node:path";

export const APP_ROOT = path.resolve(process.cwd());
export const RUNS_DIR = path.join(APP_ROOT, ".runs");

export const DEFAULT_RETRY_LIMIT = 6;
