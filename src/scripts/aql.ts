import fs from "node:fs/promises";
import path from "node:path";
import { compileNVL } from "../compiler/index.js";
import { runAql } from "../query/index.js";

async function main() {
  const inputPath = process.argv[2];
  const query = process.argv[3];
  if (!inputPath || !query) {
    process.stderr.write("usage: npm run aql -- <path-to-nvl> \"<AQL query>\"\n");
    process.exit(1);
  }

  const absolute = path.resolve(process.cwd(), inputPath);
  const source = await fs.readFile(absolute, "utf8");
  const compilation = compileNVL(source);

  if (!compilation.success) {
    const errors = compilation.diagnostics.filter((d) => d.level === "error").map((d) => d.code).join(", ");
    process.stderr.write(`[aql] compile failed (errors: ${errors || "unknown"}) - query runs on partial state\n`);
  }

  const out = runAql(compilation, query);
  process.stdout.write(out);
  process.stdout.write("\n");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});

