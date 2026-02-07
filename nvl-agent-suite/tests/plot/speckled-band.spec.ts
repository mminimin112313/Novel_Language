import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { compileNVL } from "../../src/compiler/index.js";

const fixtureDir = path.join(process.cwd(), "tests", "plot", "speckled-band");

async function loadFixture(name: string): Promise<string> {
  return fs.readFile(path.join(fixtureDir, name), "utf8");
}

describe("Speckled Band plot compilation", () => {
  it("attempt 1 should fail with major consistency violations", async () => {
    const source = await loadFixture("attempt-01-rough.nvl");
    const result = compileNVL(source);
    const codes = new Set(result.diagnostics.filter((d) => d.level === "error").map((d) => d.code));

    expect(result.success).toBe(false);
    expect(codes.has("E_CAUSALITY_TIME")).toBe(true);
    expect(codes.has("E_SPATIAL_MISMATCH")).toBe(true);
    expect(codes.has("E_GIVE_ITEM")).toBe(true);
    expect(codes.has("E_EPISTEMIC")).toBe(true);
    expect(codes.has("E_ONTOLOGY_DEAD")).toBe(true);
  });

  it("attempt 2 should retain only localized unresolved action issues", async () => {
    const source = await loadFixture("attempt-02-partial-fix.nvl");
    const result = compileNVL(source);
    const errors = result.diagnostics.filter((d) => d.level === "error").map((d) => d.code);

    expect(result.success).toBe(false);
    expect(errors).toEqual(["E_SPATIAL_MISMATCH", "E_GIVE_ITEM"]);
  });

  it("attempt 3 should compile successfully after corrections", async () => {
    const source = await loadFixture("attempt-03-compile-pass.nvl");
    const result = compileNVL(source);

    expect(result.success).toBe(true);
    expect(result.diagnostics.filter((d) => d.level === "error")).toHaveLength(0);
  });
});

