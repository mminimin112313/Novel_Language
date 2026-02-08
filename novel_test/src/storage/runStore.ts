import fs from "node:fs/promises";
import path from "node:path";
import { RUNS_DIR } from "../config.js";

export type RunMetadata = {
  runId: string;
  runDir: string;
};

export async function initRun(direction: string, style: string): Promise<RunMetadata> {
  await fs.mkdir(RUNS_DIR, { recursive: true });
  const runId = buildRunId();
  const runDir = path.join(RUNS_DIR, runId);
  await fs.mkdir(runDir, { recursive: true });

  await fs.writeFile(
    path.join(runDir, "input.json"),
    JSON.stringify(
      {
        runId,
        createdAt: new Date().toISOString(),
        direction,
        style
      },
      null,
      2
    ),
    "utf8"
  );

  return { runId, runDir };
}

export async function saveRunFile(runDir: string, name: string, content: string): Promise<void> {
  await fs.writeFile(path.join(runDir, name), content, "utf8");
}

export async function appendRunFile(runDir: string, name: string, content: string): Promise<void> {
  await fs.appendFile(path.join(runDir, name), content, "utf8");
}

function buildRunId(): string {
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[:-]/g, "")
    .replace(/\..+/, "")
    .replace("T", "_");
  const random = Math.random().toString(36).slice(2, 8);
  return `${stamp}_${random}`;
}
