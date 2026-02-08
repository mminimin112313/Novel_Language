import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { runSetupDoctor } from "../src/setup/doctor.js";

const REQUIRED_SCRIPTS: Record<string, string> = {
  "setup:auto": "echo setup:auto",
  "setup:doctor": "echo setup:doctor",
  lint: "echo lint",
  test: "echo test",
  "plot:validate": "echo plot:validate",
  mcp: "echo mcp"
};

const tempDirs: string[] = [];

async function writeFile(targetPath: string, content: string) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content, "utf8");
}

async function createValidWorkspace(rootDir: string) {
  await fs.mkdir(path.join(rootDir, ".agent/skills"), { recursive: true });
  await fs.mkdir(path.join(rootDir, ".agent/workflows"), { recursive: true });
  await fs.mkdir(path.join(rootDir, ".agent/rules"), { recursive: true });

  await writeFile(
    path.join(rootDir, "package.json"),
    JSON.stringify({ name: "tmp", scripts: REQUIRED_SCRIPTS }, null, 2)
  );
  await writeFile(
    path.join(rootDir, ".agent/config/user-preferences.yaml"),
    "language: ko\nlocale: ko-KR\n"
  );
  await writeFile(
    path.join(rootDir, ".agent/mcp.json"),
    JSON.stringify(
      {
        mcpServers: {
          "nvl-agent-suite": {
            command: "npm",
            args: ["run", "mcp"],
            cwd: "."
          }
        }
      },
      null,
      2
    )
  );
  await writeFile(path.join(rootDir, "templates/episode-spec.example.json"), "{}\n");
  await writeFile(
    path.join(rootDir, "tests/plot/little-mermaid/attempt-03-compile-pass.nvl"),
    "SCENE Start worldTime=1 narrativeTime=1 location=Sea\n"
  );
}

async function createTempDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "nvl-doctor-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (!dir) {
      continue;
    }
    await fs.rm(dir, { recursive: true, force: true });
  }
});

describe("runSetupDoctor", () => {
  test("passes on a valid workspace", async () => {
    const rootDir = await createTempDir();
    await createValidWorkspace(rootDir);

    const result = await runSetupDoctor(rootDir);
    expect(result.ok).toBe(true);
    expect(result.checks.find((check) => check.id === "mcp-cwd")?.status).toBe("pass");
  });

  test("fails when required path is missing", async () => {
    const rootDir = await createTempDir();
    await createValidWorkspace(rootDir);
    await fs.rm(path.join(rootDir, ".agent/workflows"), { recursive: true, force: true });

    const result = await runSetupDoctor(rootDir);
    expect(result.ok).toBe(false);
    expect(
      result.checks.find((check) => check.id === "path:.agent/workflows")?.status
    ).toBe("fail");
  });

  test("fails when MCP uses absolute cwd", async () => {
    const rootDir = await createTempDir();
    await createValidWorkspace(rootDir);
    await writeFile(
      path.join(rootDir, ".agent/mcp.json"),
      JSON.stringify(
        {
          mcpServers: {
            "nvl-agent-suite": {
              command: "npm",
              args: ["run", "mcp"],
              cwd: "/abs/path"
            }
          }
        },
        null,
        2
      )
    );

    const result = await runSetupDoctor(rootDir);
    expect(result.ok).toBe(false);
    expect(result.checks.find((check) => check.id === "mcp-cwd")?.status).toBe("fail");
  });
});
