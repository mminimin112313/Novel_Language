import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { toolCompileNVL, toolRunPipeline, toolWriteNovel } from "../src/mcp/tools.js";

describe("mcp tools", () => {
  it("compiles via tool wrapper", async () => {
    const out = await toolCompileNVL("ACTOR Hero");
    expect(out.success).toBe(true);
  });

  it("runs pipeline via tool wrapper", async () => {
    const out = await toolRunPipeline({
      direction: "인어공주가 왕자를 구하는 이야기"
    });
    expect(out.runId).toBeTruthy();
    expect(out.attempts).toBeGreaterThan(0);
  });

  it("runs long-form novel workflow via mcp wrapper", async () => {
    const projectId = `mcp-novel-${Date.now()}`;
    const out = await toolWriteNovel({
      concept: "사라진 신호를 좇는 심해 조사선의 기록",
      title: "심해의 백색소음",
      chapters: 2,
      style: "Cinematic",
      projectId
    });

    expect(out.projectId).toBe(projectId);
    expect(out.chapterCount).toBe(2);
    expect(out.manuscriptPath.endsWith("manuscript.md")).toBe(true);

    await fs.rm(path.join(process.cwd(), "novels", projectId), { recursive: true, force: true });
    await fs.rm(path.join(process.cwd(), "logs", "novel-writing", projectId), {
      recursive: true,
      force: true
    });
  });
});
