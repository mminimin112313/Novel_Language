import fs from "node:fs/promises";
import path from "node:path";
import { planNovel } from "../agents/planner.js";
import { runPipeline } from "../orchestrator/pipeline.js";

export type NovelWorkflowRequest = {
  concept: string;
  titleHint?: string;
  projectId?: string;
  chapterCount?: number;
  style?: string;
};

export type NovelWorkflowChapterResult = {
  chapterIndex: number;
  chapterTitle: string;
  direction: string;
  runId: string;
  success: boolean;
  attempts: number;
  diagnosticsCount: number;
  outputPath: string;
};

export type NovelWorkflowResult = {
  projectId: string;
  title: string;
  summary: string;
  style: string;
  chapterCount: number;
  success: boolean;
  manuscriptPath: string;
  chapterResults: NovelWorkflowChapterResult[];
};

export async function runNovelWorkflow(req: NovelWorkflowRequest): Promise<NovelWorkflowResult> {
  const chapterCount = Math.max(1, Math.min(req.chapterCount ?? 5, 24));
  const style = req.style?.trim() || "Cinematic";

  const plan = await planNovel({
    concept: req.concept,
    titleHint: req.titleHint,
    chapterCount,
    baseStyle: style
  });

  const projectId = await resolveProjectId(req.projectId || plan.title);
  const novelRoot = path.join(process.cwd(), "novels", projectId);
  const logRoot = path.join(process.cwd(), "logs", "novel-writing", projectId);

  await fs.mkdir(novelRoot, { recursive: true });
  await fs.mkdir(logRoot, { recursive: true });

  await fs.writeFile(
    path.join(novelRoot, "plan.json"),
    JSON.stringify(
      {
        title: plan.title,
        summary: plan.summary,
        concept: req.concept,
        chapterCount,
        style,
        provider: plan.provider,
        model: plan.model,
        chapters: plan.chapters
      },
      null,
      2
    ),
    "utf8"
  );

  const chapterResults: NovelWorkflowChapterResult[] = [];
  const manuscriptParts: string[] = [`# ${plan.title}`, "", plan.summary, ""];

  for (const chapter of plan.chapters.slice(0, chapterCount)) {
    const chapterNo = String(chapter.index).padStart(2, "0");
    const chapterFileBase = `chapter-${chapterNo}-${slugify(chapter.title)}`;

    const pipeline = await runPipeline({
      direction: chapter.direction,
      style: chapter.style || style
    });

    const chapterOutputPath = path.join(novelRoot, `${chapterFileBase}.md`);
    const chapterLogPath = path.join(logRoot, `${chapterFileBase}.compile-log.txt`);

    const chapterText = pipeline.novelText ?? "[chapter generation failed]";
    await fs.writeFile(
      chapterOutputPath,
      [`## Chapter ${chapterNo}: ${chapter.title}`, "", chapterText, ""].join("\n"),
      "utf8"
    );

    await fs.writeFile(chapterLogPath, pipeline.compile.logText, "utf8");
    await fs.writeFile(
      path.join(logRoot, `${chapterFileBase}.result.json`),
      JSON.stringify(
        {
          chapter,
          pipeline: {
            runId: pipeline.runId,
            success: pipeline.success,
            attempts: pipeline.attempts,
            diagnostics: pipeline.compile.diagnostics,
            architectHistory: pipeline.architectHistory,
            novelist: pipeline.novelist
          }
        },
        null,
        2
      ),
      "utf8"
    );

    chapterResults.push({
      chapterIndex: chapter.index,
      chapterTitle: chapter.title,
      direction: chapter.direction,
      runId: pipeline.runId,
      success: pipeline.success,
      attempts: pipeline.attempts,
      diagnosticsCount: pipeline.compile.diagnostics.length,
      outputPath: chapterOutputPath
    });

    manuscriptParts.push(`## Chapter ${chapterNo}: ${chapter.title}`);
    manuscriptParts.push("");
    manuscriptParts.push(chapterText);
    manuscriptParts.push("");
  }

  const manuscriptPath = path.join(novelRoot, "manuscript.md");
  await fs.writeFile(manuscriptPath, manuscriptParts.join("\n"), "utf8");

  const result: NovelWorkflowResult = {
    projectId,
    title: plan.title,
    summary: plan.summary,
    style,
    chapterCount: chapterResults.length,
    success: chapterResults.every((item) => item.success),
    manuscriptPath,
    chapterResults
  };

  await fs.writeFile(path.join(logRoot, "run-summary.json"), JSON.stringify(result, null, 2), "utf8");
  return result;
}

async function resolveProjectId(seed: string): Promise<string> {
  const base = slugify(seed) || "novel-project";
  const root = path.join(process.cwd(), "novels");
  await fs.mkdir(root, { recursive: true });

  let candidate = base;
  let suffix = 2;
  while (await exists(path.join(root, candidate))) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}
