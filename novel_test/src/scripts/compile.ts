import fs from "node:fs/promises";
import path from "node:path";
import { compileNVL } from "../compiler/index.js";

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    process.stderr.write("usage: npm run compile:file -- <path-to-nvl>\n");
    process.exit(1);
  }

  const absolute = path.resolve(process.cwd(), inputPath);
  const source = await fs.readFile(absolute, "utf8");
  const result = compileNVL(source);
  process.stdout.write(`${result.logText}\n`);

  if (!result.success) {
    process.exit(2);
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
