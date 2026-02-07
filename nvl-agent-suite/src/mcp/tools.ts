import fs from "node:fs/promises";
import path from "node:path";
import { compileNVL } from "../compiler/index.js";
import { runPipeline } from "../orchestrator/pipeline.js";
import { RUNS_DIR } from "../config.js";
import { runAql } from "../query/index.js";
import { EpisodeSpecSchema, buildEpisodePack } from "../episode/index.js";
import { lintManuscript } from "../lint/index.js";

export async function toolCompileNVL(source: string) {
  const result = compileNVL(source);
  return {
    success: result.success,
    diagnostics: result.diagnostics,
    logText: result.logText,
    normalizedSource: result.normalizedSource
  };
}

export async function toolRunPipeline(params: {
  direction: string;
  style?: string;
  apiKey?: string;
  architectModel?: string;
  novelistModel?: string;
  maxAttempts?: number;
}) {
  const out = await runPipeline({
    direction: params.direction,
    style: params.style ?? "Cinematic",
    apiKey: params.apiKey,
    architectModel: params.architectModel,
    novelistModel: params.novelistModel,
    maxAttempts: params.maxAttempts
  });

  return {
    runId: out.runId,
    success: out.success,
    attempts: out.attempts,
    diagnostics: out.compile.diagnostics,
    hasNovel: Boolean(out.novelText)
  };
}

export async function toolReadRunFile(runId: string, fileName: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(runId)) {
    throw new Error("invalid runId");
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
    throw new Error("invalid fileName");
  }

  const target = path.join(RUNS_DIR, runId, fileName);
  const content = await fs.readFile(target, "utf8");
  return { runId, fileName, content };
}

export async function toolAqlQuery(params: { source: string; query: string }) {
  const compilation = compileNVL(params.source);
  const output = runAql(compilation, params.query);

  return {
    compileSuccess: compilation.success,
    diagnostics: compilation.diagnostics,
    output
  };
}

export async function toolEpisodePack(params: { source: string; spec: unknown }) {
  const spec = EpisodeSpecSchema.parse(params.spec);
  const pack = buildEpisodePack(params.source, spec);
  return pack;
}

export async function toolManuscriptLint(params: { episodePack: unknown; manuscript: string }) {
  const pack = params.episodePack as any;
  return lintManuscript(pack, params.manuscript);
}
