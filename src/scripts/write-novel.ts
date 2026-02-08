import { runNovelWorkflow } from "../workflows/novelWriter.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const concept = args.concept;
  if (!concept) {
    printUsage();
    process.exit(1);
  }

  const result = await runNovelWorkflow({
    concept,
    titleHint: args.title,
    projectId: args.project,
    chapterCount: args.chapters ? Number(args.chapters) : undefined,
    style: args.style,
    worldBuild: args["world-build"] === "true"
  });

  process.stdout.write(JSON.stringify(result, null, 2));
  process.stdout.write("\n");

  if (!result.success) {
    process.exit(2);
  }
}

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      out[key] = "true";
      continue;
    }

    out[key] = value;
    i += 1;
  }

  return out;
}

function printUsage() {
  process.stderr.write(
    [
      "usage:",
      "npm run novel:write -- \\",
      "  --concept \"현대 서울에서 기억을 잃은 탐정의 추리극\" \\",
      "  --title \"잃어버린 진술\" \\",
      "  --chapters 5 \\",
      "  --style Noir \\",
      "  --world-build",
      "",
      "optional:",
      "  --project <project-id>"
    ].join("\n") + "\n"
  );
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
