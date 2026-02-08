import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { EpisodeSpecSchema, buildEpisodePack } from "../src/episode/index.js";

const fixturesDir = path.join(process.cwd(), "tests", "plot", "little-mermaid");
const templateSpecPath = path.join(process.cwd(), "templates", "episode-spec.example.json");

describe("episode pack", () => {
  it("builds a pack filtered by selected scenes", async () => {
    const [nvlSource, rawSpec] = await Promise.all([
      fs.readFile(path.join(fixturesDir, "attempt-03-compile-pass.nvl"), "utf8"),
      fs.readFile(templateSpecPath, "utf8")
    ]);

    const spec = EpisodeSpecSchema.parse(JSON.parse(rawSpec));
    const pack = buildEpisodePack(nvlSource, spec);

    expect(pack.compilation.sceneCount).toBeGreaterThan(0);
    expect(pack.scenes.map((s) => s.id)).toEqual(["ShipFestival", "WitchDeal"]);
    expect(pack.events.length).toBeGreaterThan(0);
    expect(pack.events.every((e) => e.scene && (e.scene.id === "ShipFestival" || e.scene.id === "WitchDeal"))).toBe(true);
  });
});

