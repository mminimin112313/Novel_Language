import { describe, expect, it } from "vitest";
import { compileNVL } from "../src/compiler/index.js";
import { runAql } from "../src/query/index.js";

describe("AQL", () => {
  it("traces item ownership through GIVE transfers", () => {
    const source = `
ACTOR Ariel
ACTOR Prince
SCENE Rescue worldTime=2024-06-01T00:00:00Z narrative=1 mode=normal
SET Ariel.location = Sea
SET Prince.location = Sea
GIVE Ariel Dagger
ACTION GIVE subject=Ariel target=Prince item=Dagger
`;
    const compilation = compileNVL(source);
    const out = runAql(compilation, "TRACE OWNERSHIP OF 'Dagger'");
    expect(out).toContain("TRACE OWNERSHIP: Dagger");
    expect(out).toContain("__WORLD__ -> Ariel");
    expect(out).toContain("Ariel -> Prince");
    expect(out).toContain("Current owner: Prince");
  });

  it("supports SELECT queries on Actors and Knowledge tables", () => {
    const source = `
ACTOR Ariel
ACTOR Prince
SCENE Talk worldTime=2024-06-01T00:00:00Z narrative=1 mode=normal
SET Ariel.location = Beach
SET Prince.location = Beach
KNOWS Ariel SecretIdentity
ACTION SPEAK subject=Ariel target=Prince fact=SecretIdentity
`;
    const compilation = compileNVL(source);

    const actors = runAql(compilation, "SELECT name, status, location FROM Actors WHERE status = 'Alive'");
    expect(actors.split("\n")[0]).toBe("name\tstatus\tlocation");
    expect(actors).toContain("Ariel\tAlive\tBeach");
    expect(actors).toContain("Prince\tAlive\tBeach");

    const knowledge = runAql(
      compilation,
      "SELECT actor, fact, kind, sourceActor FROM Knowledge WHERE actor = 'Prince' AND fact = 'SecretIdentity'"
    );
    expect(knowledge).toContain("Prince\tSecretIdentity\tHEAR\tAriel");
  });
});

