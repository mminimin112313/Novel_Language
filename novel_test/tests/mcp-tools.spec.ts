import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { toolAqlQuery, toolCompileNVL, toolEpisodePack, toolManuscriptLint, toolRunPipeline, toolWriteNovel } from "../src/mcp/tools.js";

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

  it("queries compiled state via AQL tool wrapper", async () => {
    const out = await toolAqlQuery({
      source: [
        "ACTOR Ariel",
        "ACTOR Prince",
        "SCENE Rescue worldTime=2024-06-01T00:00:00Z narrative=1 mode=normal",
        "SET Ariel.location = Sea",
        "SET Prince.location = Sea",
        "GIVE Ariel Dagger",
        "ACTION GIVE subject=Ariel target=Prince item=Dagger"
      ].join("\n"),
      query: "TRACE OWNERSHIP OF 'Dagger'"
    });

    expect(out.compileSuccess).toBe(true);
    expect(out.output).toContain("Current owner: Prince");
  });

  it("builds an episode pack and lints a manuscript deterministically", async () => {
    const fixturesDir = path.join(process.cwd(), "tests", "plot", "little-mermaid");
    const templateSpecPath = path.join(process.cwd(), "templates", "episode-spec.example.json");

    const [nvlSource, rawSpec] = await Promise.all([
      fs.readFile(path.join(fixturesDir, "attempt-03-compile-pass.nvl"), "utf8"),
      fs.readFile(templateSpecPath, "utf8")
    ]);

    const pack = await toolEpisodePack({
      source: nvlSource,
      spec: JSON.parse(rawSpec) as unknown
    });

    expect(pack.spec.storyId).toBe("little-mermaid");
    expect(pack.events.length).toBeGreaterThan(0);

    const firstEventId = pack.events[0]?.globalIndex ?? 1;
    const manuscript = `첫 문단. [[EVT:${firstEventId}]]\n\n둘째 문단. [[EVT:${firstEventId}]]`;

    const lint = await toolManuscriptLint({ episodePack: pack, manuscript });
    expect(lint.ok).toBe(true);
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
