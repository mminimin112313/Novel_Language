import { describe, expect, it } from "vitest";
import { planNovel } from "../src/agents/planner.js";

describe("planNovel", () => {
  it("returns mock plan without api key", async () => {
    const result = await planNovel({
      concept: "멸망 직전 도시에서 기록 보관사가 진실을 찾는다",
      chapterCount: 3,
      baseStyle: "Noir"
    });

    expect(result.provider).toBe("mock");
    expect(result.chapters).toHaveLength(3);
    expect(result.chapters[0].direction.length).toBeGreaterThan(0);
  });
});
