import fs from "node:fs/promises";
import path from "node:path";
import { EpisodeSpecSchema, buildEpisodePack } from "../episode/index.js";

async function main() {
  const nvlPath = process.argv[2];
  const specPath = process.argv[3];
  const outPath = process.argv[4];

  if (!nvlPath || !specPath) {
    process.stderr.write("usage: npm run episode:pack -- <path-to.nvl> <path-to-episode-spec.json> [output.json]\n");
    process.exit(1);
  }

  const nvlAbsolute = path.resolve(process.cwd(), nvlPath);
  const specAbsolute = path.resolve(process.cwd(), specPath);

  const [nvlSource, specRaw] = await Promise.all([
    fs.readFile(nvlAbsolute, "utf8"),
    fs.readFile(specAbsolute, "utf8")
  ]);

  const parsed = JSON.parse(specRaw) as unknown;
  const spec = EpisodeSpecSchema.parse(parsed);
  const pack = buildEpisodePack(nvlSource, spec);
  const json = JSON.stringify(pack, null, 2);

  if (outPath) {
    const outAbsolute = path.resolve(process.cwd(), outPath);
    await fs.writeFile(outAbsolute, json, "utf8");
    process.stdout.write(`${outAbsolute}\n`);
    return;
  }

  process.stdout.write(json);
  process.stdout.write("\n");
}

main().catch((error) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "unknown episode pack error";
  process.stderr.write(`${message}\n`);
  process.exit(1);
});

