import { describe, expect, it } from "vitest";
import { compileNVL } from "../src/compiler/index.js";

describe("compileNVL", () => {
  it("compiles a valid minimal script", () => {
    const source = `
ACTOR Ariel
ACTOR Prince
SET Ariel.location = Sea
SET Prince.location = Sea
GIVE Ariel Dagger
ACTION GIVE subject=Ariel target=Prince item=Dagger
`;

    const result = compileNVL(source);
    expect(result.success).toBe(true);
    expect(result.diagnostics.filter((d) => d.level === "error")).toHaveLength(0);
  });

  it("catches epistemic and spatial violations", () => {
    const source = `
ACTOR Ariel
ACTOR Prince
SET Ariel.location = Sea
SET Prince.location = Ship
ACTION GIVE subject=Ariel target=Prince item=Dagger
ACTION SPEAK subject=Ariel fact=SecretIdentity
`;

    const result = compileNVL(source);
    expect(result.success).toBe(false);
    expect(result.diagnostics.some((d) => d.code === "E_SPATIAL_MISMATCH")).toBe(true);
    expect(result.diagnostics.some((d) => d.code === "E_EPISTEMIC")).toBe(true);
  });

  it("flags backward world time without flashback", () => {
    const source = `
SCENE Intro worldTime=2024-01-01T00:00:00Z narrative=1
SCENE Past worldTime=2020-01-01T00:00:00Z narrative=2
`;
    const result = compileNVL(source);
    expect(result.diagnostics.some((d) => d.code === "E_CAUSALITY_TIME")).toBe(true);
  });
});
