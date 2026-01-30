
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
const SETUP_SCRIPT_PATH = path.resolve(__dirname, '../../../../memory/setup.py');

export interface MemoryNode {
    id: string;
    title: string;
    path: string;
    tags: string[];
}

export class MemorySubskill {
    private isInitialized: boolean = false;
    private queue: Promise<void> = Promise.resolve();

    private async enqueue<T>(operation: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue = this.queue.then(async () => {
                try {
                    const result = await operation();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    constructor() {
        if (!fs.existsSync(MEMORY_SCRIPT_PATH)) {
            console.warn(`Memory script not found at ${MEMORY_SCRIPT_PATH}`);
        }
        // Background initialization
        this.ensureSetup().catch(err => console.error("Memory auto-setup failed", err));
    }

    private async ensureSetup(): Promise<void> {
        if (this.isInitialized) return;

        const venvPath = path.resolve(path.dirname(MEMORY_SCRIPT_PATH), '.venv');
        if (!fs.existsSync(venvPath)) {
            console.log("Memory environment missing. Starting auto-setup...");
            const isWin = process.platform === "win32";
            const pythonCommand = isWin ? "python" : "python3";
            try {
                const { stdout } = await execAsync(`${pythonCommand} "${SETUP_SCRIPT_PATH}"`);
                console.log(stdout);
                this.isInitialized = true;
            } catch (error) {
                console.error("Auto-setup failed:", error);
                throw error;
            }
        } else {
            this.isInitialized = true;
        }
    }

    private getPythonCommand(): string {
        const venvPath = path.resolve(path.dirname(MEMORY_SCRIPT_PATH), '.venv', process.platform === 'win32' ? 'Scripts' : 'bin', process.platform === 'win32' ? 'python.exe' : 'python3');
        if (fs.existsSync(venvPath)) {
            return `"${venvPath}"`;
        }
        return process.platform === "win32" ? "python" : "python3";
    }

    async record(content: string, tags: string[] = [], title?: string): Promise<string> {
        return this.enqueue(async () => {
            await this.ensureSetup();
            const tagStr = tags.join(',');
            const titleArg = title ? `--title "${title.replace(/"/g, '\\"')}"` : '';
            const pythonCommand = this.getPythonCommand();
            const cmd = `${pythonCommand} "${MEMORY_SCRIPT_PATH}" record "${content.replace(/"/g, '\\"')}" --tags "${tagStr}" ${titleArg}`;

            const { stdout } = await execAsync(cmd);
            return stdout.trim();
        });
    }

    async update(id: string, content?: string, tags?: string[], title?: string): Promise<string> {
        return this.enqueue(async () => {
            await this.ensureSetup();
            const tagArg = tags ? `--tags "${tags.join(',')}"` : '';
            const titleArg = title ? `--title "${title.replace(/"/g, '\\"')}"` : '';
            const contentArg = content ? `--content "${content.replace(/"/g, '\\"')}"` : '';

            const pythonCommand = this.getPythonCommand();
            const cmd = `${pythonCommand} "${MEMORY_SCRIPT_PATH}" update "${id}" ${contentArg} ${tagArg} ${titleArg}`;
            const { stdout } = await execAsync(cmd);
            return stdout.trim();
        });
    }

    async search(query: string, tag?: string): Promise<MemoryNode[]> {
        return this.enqueue(async () => {
            await this.ensureSetup();
            const tagArg = tag ? `--tag "${tag}"` : '';
            const pythonCommand = this.getPythonCommand();
            const cmd = `${pythonCommand} "${MEMORY_SCRIPT_PATH}" search "${query.replace(/"/g, '\\"')}" ${tagArg}`;

            try {
                const { stdout } = await execAsync(cmd);
                return JSON.parse(stdout);
            } catch (e) {
                console.error("Memory search failed", e);
                return [];
            }
        });
    }

    async connect(sourceId: string, targetId: string, relation: string): Promise<string> {
        return this.enqueue(async () => {
            await this.ensureSetup();
            const pythonCommand = this.getPythonCommand();
            const cmd = `${pythonCommand} "${MEMORY_SCRIPT_PATH}" connect "${sourceId}" "${targetId}" "${relation}"`;
            const { stdout } = await execAsync(cmd);
            return stdout.trim();
        });
    }
}
