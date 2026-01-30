
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the python script
// dist/subskills/memory/MemorySkill.js -> ../../../../memory/memory_core.py
// src/subskills/memory/MemorySkill.ts -> ../../../../memory/memory_core.py
// Correct structure:
// .agent/skills/capabilities/browsing/src/subskills/memory/MemorySkill.ts
// .agent/skills/capabilities/memory/memory_core.py
// Relative path from browsing/src/subskills/memory to capabilities/memory is:
// ../../../memory/memory_core.py? No.
// browsing/src/subskills/memory -> (..)-> subskills -> (..)-> src -> (..)-> browsing -> (..)-> capabilities -> memory
// So it is ../../../../memory/memory_core.py

const MEMORY_SCRIPT_PATH = path.resolve(__dirname, '../../../../memory/memory_core.py');

export interface MemoryNode {
    id: string;
    title: string;
    path: string;
    tags: string[];
}

export class MemorySubskill {
    constructor() {
        if (!fs.existsSync(MEMORY_SCRIPT_PATH)) {
            console.warn(`Memory script not found at ${MEMORY_SCRIPT_PATH}`);
        }
    }

    async record(content: string, tags: string[] = [], title?: string): Promise<string> {
        const tagStr = tags.join(',');
        const titleArg = title ? `--title "${title.replace(/"/g, '\\"')}"` : '';
        const isWin = process.platform === "win32";
        const pythonCommand = isWin ? "python" : "python3";
        const cmd = `${pythonCommand} "${MEMORY_SCRIPT_PATH}" record "${content.replace(/"/g, '\\"')}" --tags "${tagStr}" ${titleArg}`;

        const { stdout } = await execAsync(cmd);
        return stdout.trim();
    }

    async update(id: string, content?: string, tags?: string[], title?: string): Promise<string> {
        const tagArg = tags ? `--tags "${tags.join(',')}"` : '';
        const titleArg = title ? `--title "${title.replace(/"/g, '\\"')}"` : '';
        const contentArg = content ? `--content "${content.replace(/"/g, '\\"')}"` : '';

        const isWin = process.platform === "win32";
        const pythonCommand = isWin ? "python" : "python3";
        const cmd = `${pythonCommand} "${MEMORY_SCRIPT_PATH}" update "${id}" ${contentArg} ${tagArg} ${titleArg}`;
        const { stdout } = await execAsync(cmd);
        return stdout.trim();
    }

    async search(query: string, tag?: string): Promise<MemoryNode[]> {
        const tagArg = tag ? `--tag "${tag}"` : '';
        const isWin = process.platform === "win32";
        const pythonCommand = isWin ? "python" : "python3";
        const cmd = `${pythonCommand} "${MEMORY_SCRIPT_PATH}" search "${query.replace(/"/g, '\\"')}" ${tagArg}`;

        try {
            const { stdout } = await execAsync(cmd);
            return JSON.parse(stdout);
        } catch (e) {
            console.error("Memory search failed", e);
            return [];
        }
    }

    async connect(sourceId: string, targetId: string, relation: string): Promise<string> {
        const isWin = process.platform === "win32";
        const pythonCommand = isWin ? "python" : "python3";
        const cmd = `${pythonCommand} "${MEMORY_SCRIPT_PATH}" connect "${sourceId}" "${targetId}" "${relation}"`;
        const { stdout } = await execAsync(cmd);
        return stdout.trim();
    }
}
