import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runNovelWorkflow } from "../src/workflows/novelWriter.js";

describe("runNovelWorkflow", () => {
  it("writes manuscript artifacts with mock pipeline", async () => {
    const projectId = `test-project-${Date.now()}`;

    const result = await runNovelWorkflow({
      concept: "빙해 탐사대가 잃어버린 신호를 추적한다",
      titleHint: "빙해의 주파수",
      projectId,
      chapterCount: 2,
      style: "Cinematic"
    });

    expect(result.projectId).toBe(projectId);
    expect(result.chapterCount).toBe(2);

    const manuscriptPath = path.join(process.cwd(), "novels", projectId, "manuscript.md");
    const manuscript = await fs.readFile(manuscriptPath, "utf8");
    expect(manuscript).toContain("# ");
    expect(manuscript).toContain("## Chapter 01");

    await fs.rm(path.join(process.cwd(), "novels", projectId), { recursive: true, force: true });
    await fs.rm(path.join(process.cwd(), "logs", "novel-writing", projectId), {
      recursive: true,
      force: true
    });
  });
});
