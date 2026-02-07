import path from "node:path";

export const APP_ROOT = path.resolve(process.cwd());
export const RUNS_DIR = path.join(APP_ROOT, ".runs");

export const DEFAULT_MODELS = {
  planner: process.env.GEMINI_MODEL_PLANNER ?? "gemini-2.5-flash",
  architect: process.env.GEMINI_MODEL_ARCHITECT ?? "gemini-2.5-flash",
  novelist: process.env.GEMINI_MODEL_NOVELIST ?? "gemini-2.5-pro"
};

export const DEFAULT_RETRY_LIMIT = 6;
