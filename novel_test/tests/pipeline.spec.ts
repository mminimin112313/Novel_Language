import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RUNS_DIR } from "../src/config.js";
import { runPipeline } from "../src/orchestrator/pipeline.js";

describe("runPipeline", () => {
  it("completes with mock providers when api key is absent", async () => {
    const result = await runPipeline({
      direction: "인어공주가 왕자를 구하는 이야기",
      style: "Cinematic"
    });

    expect(result.runId).toBeTruthy();
    expect(result.attempts).toBeGreaterThan(0);

    const compileLogPath = path.join(RUNS_DIR, result.runId, "compile-log.txt");
    const content = await fs.readFile(compileLogPath, "utf8");
    expect(content).toContain("NVL COMPILATION LOG");
  });
});
