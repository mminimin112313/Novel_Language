import fs from "node:fs/promises";
import path from "node:path";
import { lintManuscript } from "../lint/index.js";

async function main() {
  const packPath = process.argv[2];
  const manuscriptPath = process.argv[3];

  if (!packPath || !manuscriptPath) {
    process.stderr.write("usage: npm run manuscript:lint -- <episode-pack.json> <manuscript.txt>\n");
    process.exit(1);
  }

  const packAbsolute = path.resolve(process.cwd(), packPath);
  const manuscriptAbsolute = path.resolve(process.cwd(), manuscriptPath);

  const [packRaw, manuscript] = await Promise.all([
    fs.readFile(packAbsolute, "utf8"),
    fs.readFile(manuscriptAbsolute, "utf8")
  ]);

  const pack = JSON.parse(packRaw) as unknown;
  const result = lintManuscript(pack as any, manuscript);
  process.stdout.write(JSON.stringify(result, null, 2));
  process.stdout.write("\n");

  if (!result.ok) {
    process.exit(2);
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});

