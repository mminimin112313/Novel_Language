/**
 * Cascade Compile: Compiles world.nvl + all prior episodes + target episode
 * Usage: npm run compile:cascade -- <project-dir> <target-episode.nvl>
 * Example: npm run compile:cascade -- "cyberfunk noir" phase_01/chapter_01/ep03.nvl
 */
import fs from "node:fs/promises";
import path from "node:path";
import { compileNVL } from "../compiler/index.js";

async function findPriorEpisodes(projectDir: string, targetPath: string): Promise<string[]> {
    const episodes: string[] = [];

    // Extract episode number from target (e.g., ep03.nvl -> 3)
    const targetMatch = targetPath.match(/ep(\d+)\.nvl$/i);
    if (!targetMatch) {
        throw new Error(`Invalid episode filename: ${targetPath}. Expected format: epXX.nvl`);
    }
    const targetNum = parseInt(targetMatch[1], 10);

    // Find all episode directories
    const phaseDirs = await fs.readdir(projectDir, { withFileTypes: true });

    for (const phaseDir of phaseDirs.filter(d => d.isDirectory() && d.name.startsWith("phase_"))) {
        const chapterPath = path.join(projectDir, phaseDir.name);
        const chapterDirs = await fs.readdir(chapterPath, { withFileTypes: true });

        for (const chapterDir of chapterDirs.filter(d => d.isDirectory() && d.name.startsWith("chapter_"))) {
            const episodePath = path.join(chapterPath, chapterDir.name);
            const files = await fs.readdir(episodePath);

            for (const file of files.filter(f => f.match(/^ep\d+\.nvl$/i))) {
                const epMatch = file.match(/^ep(\d+)\.nvl$/i);
                if (epMatch) {
                    const epNum = parseInt(epMatch[1], 10);
                    if (epNum < targetNum) {
                        episodes.push(path.join(episodePath, file));
                    }
                }
            }
        }
    }

    // Sort by episode number
    episodes.sort((a, b) => {
        const aNum = parseInt(a.match(/ep(\d+)\.nvl$/i)?.[1] || "0", 10);
        const bNum = parseInt(b.match(/ep(\d+)\.nvl$/i)?.[1] || "0", 10);
        return aNum - bNum;
    });

    return episodes;
}

async function main() {
    const projectDir = process.argv[2];
    const targetPath = process.argv[3];

    if (!projectDir || !targetPath) {
        process.stderr.write("usage: npm run compile:cascade -- <project-dir> <target-episode.nvl>\n");
        process.stderr.write("example: npm run compile:cascade -- \"cyberfunk noir\" phase_01/chapter_01/ep03.nvl\n");
        process.exit(1);
    }

    const absProjectDir = path.resolve(process.cwd(), projectDir);
    const absTargetPath = path.resolve(absProjectDir, targetPath);

    // 1. Load world.nvl
    const worldPath = path.join(absProjectDir, "nvl", "world.nvl");
    let combinedSource = "";

    try {
        combinedSource += await fs.readFile(worldPath, "utf8");
        combinedSource += "\n\n# --- END world.nvl ---\n\n";
        process.stderr.write(`[CASCADE] Loaded: world.nvl\n`);
    } catch {
        process.stderr.write(`[CASCADE] Warning: world.nvl not found at ${worldPath}\n`);
    }

    // 2. Load prior episodes
    const priorEpisodes = await findPriorEpisodes(absProjectDir, targetPath);
    for (const epPath of priorEpisodes) {
        const epSource = await fs.readFile(epPath, "utf8");
        combinedSource += epSource;
        combinedSource += `\n\n# --- END ${path.basename(epPath)} ---\n\n`;
        process.stderr.write(`[CASCADE] Loaded: ${path.relative(absProjectDir, epPath)}\n`);
    }

    // 3. Load target episode
    const targetSource = await fs.readFile(absTargetPath, "utf8");
    combinedSource += targetSource;
    process.stderr.write(`[CASCADE] Loaded: ${targetPath} (TARGET)\n`);

    // 4. Compile combined source
    process.stderr.write(`[CASCADE] Compiling ${priorEpisodes.length + 2} files...\n`);
    const result = compileNVL(combinedSource);

    process.stdout.write(`${result.logText}\n`);

    if (result.success) {
        process.stderr.write(`\n[CASCADE] ✅ Compilation PASSED\n`);
        process.stderr.write(`[CASCADE] Total events: ${result.events.length}\n`);
    } else {
        process.stderr.write(`\n[CASCADE] ❌ Compilation FAILED\n`);
        process.stderr.write(`[CASCADE] Errors: ${result.diagnostics.filter(d => d.level === "error").length}\n`);
        process.exit(2);
    }
}

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
});
