import { DEFAULT_RETRY_LIMIT } from "../config.js";
import { generateArchitectDraft, repairArchitectCode } from "../agents/architect.js";
import { writeNovel } from "../agents/novelist.js";
import { compileNVL } from "../compiler/index.js";
import type { CompilationResult } from "../shared/types.js";
import { appendRunFile, initRun, saveRunFile } from "../storage/runStore.js";

export type PipelineRequest = {
  direction: string;
  style: string;
  maxAttempts?: number;
};

export type PipelineResponse = {
  runId: string;
  success: boolean;
  attempts: number;
  finalCode: string;
  compile: CompilationResult;
  novelText?: string;
  architectHistory: Array<{
    attempt: number;
    provider: string;
    model: string;
    notes: string[];
  }>;
  novelist?: {
    provider: string;
    model: string;
  };
};

export async function runPipeline(req: PipelineRequest): Promise<PipelineResponse> {
  const maxAttempts = req.maxAttempts ?? DEFAULT_RETRY_LIMIT;
  const run = await initRun(req.direction, req.style);

  const history: PipelineResponse["architectHistory"] = [];

  let attempt = 0;
  let code = "";
  let compile = compileNVL("");

  while (attempt < maxAttempts) {
    attempt += 1;

    const architect =
      attempt === 1
        ? await generateArchitectDraft({
            direction: req.direction
          })
        : await repairArchitectCode({
            direction: req.direction,
            previousCode: code,
            diagnostics: compile.diagnostics
          });

    code = architect.dsl;
    compile = compileNVL(code);

    history.push({
      attempt,
      provider: architect.provider,
      model: architect.model,
      notes: architect.notes
    });

    await appendRunFile(
      run.runDir,
      "architect-attempts.log",
      [
        `\n=== ATTEMPT ${attempt} ===`,
        `provider=${architect.provider} model=${architect.model}`,
        `notes=${architect.notes.join(" | ")}`,
        "--- code ---",
        code,
        "--- diagnostics ---",
        compile.diagnostics.map((d) => `[${d.level}] ${d.code} line=${d.line} ${d.message}`).join("\n") || "none",
        ""
      ].join("\n")
    );

    if (compile.success) {
      break;
    }
  }

  await saveRunFile(run.runDir, "final.nvl", code);
  await saveRunFile(run.runDir, "compile-log.txt", compile.logText);
  await saveRunFile(run.runDir, "compile.json", JSON.stringify(safeCompilationForDisk(compile), null, 2));

  if (!compile.success) {
    return {
      runId: run.runId,
      success: false,
      attempts: attempt,
      finalCode: code,
      compile,
      architectHistory: history
    };
  }

  const novelist = await writeNovel({
    direction: req.direction,
    style: req.style,
    logText: compile.logText
  });

  await saveRunFile(run.runDir, "novel.txt", novelist.text);

  return {
    runId: run.runId,
    success: true,
    attempts: attempt,
    finalCode: code,
    compile,
    novelText: novelist.text,
    architectHistory: history,
    novelist: {
      provider: novelist.provider,
      model: novelist.model
    }
  };
}

function safeCompilationForDisk(compile: CompilationResult) {
  return {
    success: compile.success,
    diagnostics: compile.diagnostics,
    events: compile.events,
    logText: compile.logText,
    normalizedSource: compile.normalizedSource,
    state: {
      actors: [...compile.state.actors.entries()].map(([name, actor]) => ({
        name,
        alive: actor.alive,
        location: actor.location,
        hp: actor.hp,
        components: [...actor.components],
        inventory: [...actor.inventory],
        knowledge: [...actor.knowledge],
        personality: actor.personality,
        emotions: actor.emotions,
        memory: actor.memory,
        goals: actor.goals
      })),
      relations: [...compile.state.relations.entries()],
      clues: [...compile.state.clues.entries()],
      scenes: compile.state.scenes,
      currentScene: compile.state.currentScene,
      itemTransfers: compile.state.itemTransfers,
      knowledgeEvents: compile.state.knowledgeEvents
    }
  };
}
