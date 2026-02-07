import fs from "node:fs/promises";
import path from "node:path";
import { compileNVL } from "../compiler/index.js";

type AttemptPlan = {
  id: string;
  file: string;
  intent: string;
  expectedSuccess: boolean;
};

const attempts: AttemptPlan[] = [
  {
    id: "01",
    file: "attempt-01-rough.nvl",
    intent: "raw conversion from internet plot summary",
    expectedSuccess: false
  },
  {
    id: "02",
    file: "attempt-02-partial-fix.nvl",
    intent: "fix timeline, knowledge, and item ownership partially",
    expectedSuccess: false
  },
  {
    id: "03",
    file: "attempt-03-compile-pass.nvl",
    intent: "final consistency pass",
    expectedSuccess: true
  }
];

async function main() {
  const fixtureRoot = path.join(process.cwd(), "tests", "plot", "little-mermaid");
  const logRoot = path.join(process.cwd(), "logs", "plot-validation", "little-mermaid");
  await fs.mkdir(logRoot, { recursive: true });

  const summaryRows: string[] = [];
  summaryRows.push("# Little Mermaid Plot Compilation Log");
  summaryRows.push("");
  summaryRows.push(`Generated at: ${new Date().toISOString()}`);
  summaryRows.push("");
  summaryRows.push("| Attempt | Expect | Success | Error Codes | Warning Codes |");
  summaryRows.push("|---|---:|---:|---|---|");

  for (const attempt of attempts) {
    const source = await fs.readFile(path.join(fixtureRoot, attempt.file), "utf8");
    const result = compileNVL(source);

    const errors = result.diagnostics.filter((d) => d.level === "error");
    const warnings = result.diagnostics.filter((d) => d.level === "warning");

    const logPrefix = `attempt-${attempt.id}`;
    await fs.writeFile(path.join(logRoot, `${logPrefix}.nvl`), source, "utf8");
    await fs.writeFile(path.join(logRoot, `${logPrefix}.compile.txt`), result.logText, "utf8");
    await fs.writeFile(
      path.join(logRoot, `${logPrefix}.diagnostics.json`),
      JSON.stringify(result.diagnostics, null, 2),
      "utf8"
    );

    summaryRows.push(
      `| ${attempt.id} | ${attempt.expectedSuccess ? "pass" : "fail"} | ${result.success ? "pass" : "fail"} | ${
        errors.map((d) => d.code).join(", ") || "-"
      } | ${warnings.map((d) => d.code).join(", ") || "-"} |`
    );

    if (result.success !== attempt.expectedSuccess) {
      throw new Error(
        `attempt ${attempt.id} expected success=${attempt.expectedSuccess}, got ${result.success}. check ${logPrefix}.compile.txt`
      );
    }
  }

  summaryRows.push("");
  summaryRows.push("## Notes");
  summaryRows.push("");
  summaryRows.push("- Attempt 1 demonstrates causality/spatial/inventory/epistemic/dead-actor failures.");
  summaryRows.push("- Attempt 2 narrows failures to a single late-stage action inconsistency.");
  summaryRows.push("- Attempt 3 resolves all error-level issues and passes compilation.");

  await fs.writeFile(path.join(logRoot, "summary.md"), summaryRows.join("\n"), "utf8");

  process.stdout.write(`logs written to ${logRoot}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
