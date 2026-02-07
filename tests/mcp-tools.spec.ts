import { describe, expect, it } from "vitest";
import { toolCompileNVL, toolRunPipeline } from "../src/mcp/tools.js";

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
});
