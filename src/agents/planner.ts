import { DEFAULT_MODELS } from "../config.js";
import { GeminiClient } from "./gemini.js";
import { mockNovelPlan } from "./mock.js";
import { novelPlanPrompt } from "./prompts.js";
import type { NovelPlanOutput, NovelPlanRequest } from "./types.js";

const planSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    chapters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "number" },
          title: { type: "string" },
          direction: { type: "string" },
          style: { type: "string" }
        },
        required: ["index", "title", "direction", "style"]
      }
    }
  },
  required: ["title", "summary", "chapters"]
} as const;

export async function planNovel(req: NovelPlanRequest): Promise<NovelPlanOutput> {
  const model = req.model ?? DEFAULT_MODELS.planner;
  const client = new GeminiClient({ apiKey: req.apiKey, model });

  if (!client.ready) {
    return mockNovelPlan(req.concept, req.chapterCount, req.baseStyle, req.titleHint);
  }

  try {
    const payload = await client.generateJson<{
      title: string;
      summary: string;
      chapters: Array<{ index: number; title: string; direction: string; style: string }>;
    }>({
      prompt: novelPlanPrompt(req.concept, req.titleHint, req.chapterCount, req.baseStyle),
      schema: planSchema,
      temperature: 0.5
    });

    const normalizedChapters = payload.chapters
      .slice(0, req.chapterCount)
      .map((chapter, idx) => ({
        index: idx + 1,
        title: chapter.title,
        direction: chapter.direction,
        style: chapter.style || req.baseStyle
      }));

    if (normalizedChapters.length === 0) {
      return mockNovelPlan(req.concept, req.chapterCount, req.baseStyle, req.titleHint);
    }

    return {
      title: payload.title || req.titleHint || "무제 장편 프로젝트",
      summary: payload.summary || "요약 없음",
      chapters: normalizedChapters,
      model,
      provider: "gemini"
    };
  } catch {
    return mockNovelPlan(req.concept, req.chapterCount, req.baseStyle, req.titleHint);
  }
}
