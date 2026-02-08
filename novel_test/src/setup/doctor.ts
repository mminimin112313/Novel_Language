import fs from "node:fs/promises";
import path from "node:path";

export type DoctorStatus = "pass" | "fail";

export interface DoctorCheck {
  id: string;
  status: DoctorStatus;
  message: string;
  detail?: string;
}

export interface DoctorResult {
  ok: boolean;
  rootDir: string;
  checks: DoctorCheck[];
}

const REQUIRED_PATHS = [
  ".agent",
  ".agent/config/user-preferences.yaml",
  ".agent/mcp.json",
  ".agent/skills",
  ".agent/workflows",
  ".agent/rules",
  "templates/episode-spec.example.json",
  "tests/plot/little-mermaid/attempt-03-compile-pass.nvl"
];

const REQUIRED_SCRIPTS = ["setup:auto", "setup:doctor", "lint", "test", "plot:validate", "mcp"];

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function readNodeMajor(version: string): number {
  const major = Number.parseInt(version.split(".")[0] ?? "", 10);
  return Number.isNaN(major) ? 0 : major;
}

function pass(id: string, message: string, detail?: string): DoctorCheck {
  return { id, status: "pass", message, detail };
}

function fail(id: string, message: string, detail?: string): DoctorCheck {
  return { id, status: "fail", message, detail };
}

export async function runSetupDoctor(rootDir = process.cwd()): Promise<DoctorResult> {
  const checks: DoctorCheck[] = [];

  const nodeVersion = process.versions.node;
  const nodeMajor = readNodeMajor(nodeVersion);
  if (nodeMajor >= 20) {
    checks.push(pass("node-version", "Node version is supported", `v${nodeVersion}`));
  } else {
    checks.push(fail("node-version", "Node >= 20 is required", `v${nodeVersion}`));
  }

  for (const relPath of REQUIRED_PATHS) {
    const absPath = path.join(rootDir, relPath);
    const exists = await pathExists(absPath);
    if (exists) {
      checks.push(pass(`path:${relPath}`, "Required path exists"));
    } else {
      checks.push(fail(`path:${relPath}`, "Required path is missing"));
    }
  }

  const packageJsonPath = path.join(rootDir, "package.json");
  if (!(await pathExists(packageJsonPath))) {
    checks.push(fail("package-json", "package.json is missing"));
  } else {
    const raw = await fs.readFile(packageJsonPath, "utf8");
    let packageJson: { scripts?: Record<string, string> };
    try {
      packageJson = JSON.parse(raw) as { scripts?: Record<string, string> };
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      checks.push(fail("package-json", "package.json is not valid JSON", detail));
      return finalize(rootDir, checks);
    }

    const scripts = packageJson.scripts ?? {};
    for (const scriptName of REQUIRED_SCRIPTS) {
      if (scripts[scriptName]) {
        checks.push(pass(`script:${scriptName}`, "Required npm script exists"));
      } else {
        checks.push(fail(`script:${scriptName}`, "Required npm script is missing"));
      }
    }
  }

  const mcpPath = path.join(rootDir, ".agent/mcp.json");
  if (await pathExists(mcpPath)) {
    const raw = await fs.readFile(mcpPath, "utf8");
    try {
      const parsed = JSON.parse(raw) as {
        mcpServers?: Record<string, { cwd?: string }>;
      };
      const server = parsed.mcpServers?.["nvl-agent-suite"];
      if (server) {
        checks.push(pass("mcp-server", "nvl-agent-suite MCP server entry exists"));
      } else {
        checks.push(fail("mcp-server", "nvl-agent-suite MCP server entry is missing"));
      }

      const cwd = server?.cwd;
      if (cwd === undefined || cwd === ".") {
        checks.push(pass("mcp-cwd", "MCP cwd is clone-portable"));
      } else if (path.isAbsolute(cwd)) {
        checks.push(
          fail("mcp-cwd", "MCP cwd must not be absolute", `found absolute cwd: ${cwd}`)
        );
      } else {
        checks.push(pass("mcp-cwd", "MCP cwd is relative", `cwd=${cwd}`));
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      checks.push(fail("mcp-json", ".agent/mcp.json is not valid JSON", detail));
    }
  }

  return finalize(rootDir, checks);
}

function finalize(rootDir: string, checks: DoctorCheck[]): DoctorResult {
  const ok = checks.every((check) => check.status === "pass");
  return { ok, rootDir, checks };
}

export function formatDoctorResult(result: DoctorResult): string {
  const lines: string[] = [];
  lines.push("NVL Setup Doctor");
  lines.push(`root: ${result.rootDir}`);
  lines.push("");

  for (const check of result.checks) {
    const icon = check.status === "pass" ? "PASS" : "FAIL";
    lines.push(`[${icon}] ${check.id}: ${check.message}`);
    if (check.detail) {
      lines.push(`       ${check.detail}`);
    }
  }

  lines.push("");
  lines.push(result.ok ? "Result: HEALTHY" : "Result: ACTION REQUIRED");
  return lines.join("\n");
}
