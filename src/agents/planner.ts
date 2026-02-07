import { mockNovelPlan } from "./mock.js";
import type { NovelPlanOutput, NovelPlanRequest } from "./types.js";

export async function planNovel(req: NovelPlanRequest): Promise<NovelPlanOutput> {
  return mockNovelPlan(req.concept, req.chapterCount, req.baseStyle, req.titleHint);
}

