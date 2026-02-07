import { describe, expect, it } from "vitest";
import { toolAqlQuery, toolCompileNVL, toolEpisodePack, toolManuscriptLint, toolRunPipeline } from "../src/mcp/tools.js";

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

  it("queries via AQL tool wrapper", async () => {
    const out = await toolAqlQuery({
      source: "ACTOR Hero\nSET Hero.location = Town\n",
      query: "SELECT name, location, status FROM Actors"
    });
    expect(out.compileSuccess).toBe(true);
    expect(out.output).toContain("Hero");
    expect(out.output).toContain("Town");
  });

  it("builds episode pack and lints manuscript", async () => {
    const pack = await toolEpisodePack({
      source: "ACTOR Hero\nSCENE S1 worldTime=2024-01-01T00:00:00Z narrative=1 mode=normal\nSET Hero.location = Town\n",
      spec: {
        id: "demo-ep",
        storyId: "demo",
        title: "Demo",
        direction: "간단한 데모",
        selection: { sceneIds: ["S1"] },
        requirements: { citeEvents: true, style: "Classic", pov: "third_person_limited", tense: "past", language: "ko" }
      }
    });

    const lint = await toolManuscriptLint({
      episodePack: pack,
      manuscript: "짧은 문장. [[EVT:002]]"
    });
    expect(lint.ok).toBe(true);
  });
});
