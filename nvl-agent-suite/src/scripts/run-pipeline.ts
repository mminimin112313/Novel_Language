import { runPipeline } from "../orchestrator/pipeline.js";

async function main() {
  const direction = process.argv[2];
  const style = process.argv[3] ?? "Cinematic";
  if (!direction) {
    process.stderr.write("usage: npm run pipeline -- \"story direction\" [style]\n");
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;

  const result = await runPipeline({
    direction,
    style,
    apiKey
  });

  process.stdout.write(JSON.stringify(result, null, 2));
  process.stdout.write("\n");

  if (!result.success) {
    process.exit(2);
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
