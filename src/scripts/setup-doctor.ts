import { formatDoctorResult, runSetupDoctor } from "../setup/doctor.js";

async function main() {
  const asJson = process.argv.includes("--json");
  const result = await runSetupDoctor();

  if (asJson) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write(`${formatDoctorResult(result)}\n`);
  }

  if (!result.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
