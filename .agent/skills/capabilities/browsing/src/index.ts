
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { BrowserManager } from './core/BrowserManager.js';
import { InteractionService } from './core/InteractionService.js';
import { VisualService } from './core/VisualService.js';
import { DiscoveryService } from './core/DiscoveryService.js';
import { RefinementService } from './core/RefinementService.js';
import { VisionService } from './core/VisionService.js';
import { NetworkService } from './core/NetworkService.js';
import { CommandRegistry, CommandContext } from './core/CommandRegistry.js';

// Commands
import { NavigationCommands } from './commands/NavigationCommands.js';
import { InteractionCommands } from './commands/InteractionCommands.js';
import { DiscoveryCommands } from './commands/DiscoveryCommands.js';
import { VisionCommands } from './commands/VisionCommands.js';
import { ProtocolCommands } from './commands/ProtocolCommands.js';
import { AgentCommands } from './commands/AgentCommands.js';
import { BrowsingLib } from './BrowsingLib.js';

const __filename = fileURLToPath(import.meta.url);
const cwd = process.cwd();

// --- Path Setup ---
// Find project root (assumes we are inside .agent)
let projectRoot = cwd;
const agentIndex = cwd.indexOf('.agent');
if (agentIndex !== -1) {
    projectRoot = cwd.substring(0, agentIndex);
}

const DUMP_DIR = path.join(projectRoot, 'browsing_dump');
const sessionId = `Session_${new Date().toISOString().replace(/[:.]/g, '-')}`;
const SESSION_DIR = path.join(DUMP_DIR, 'sessions', sessionId);
const SHOT_DIR = path.join(SESSION_DIR, 'screenshots');
const LOG_DIR = path.join(SESSION_DIR, 'logs');
const REPORT_DIR = path.join(DUMP_DIR, 'reports');

[DUMP_DIR, path.join(DUMP_DIR, 'sessions'), SESSION_DIR, SHOT_DIR, LOG_DIR, REPORT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const paths = {
    dump: DUMP_DIR,
    session: SESSION_DIR,
    shots: SHOT_DIR,
    logs: LOG_DIR,
    reports: REPORT_DIR
};

// --- Service Initialization ---
const browser = new BrowserManager(cwd);
const interaction = new InteractionService();
const visual = new VisualService();
const discovery = new DiscoveryService();
const refinement = new RefinementService();
const vision = new VisionService();
const network = new NetworkService();
const registry = new CommandRegistry();

const browsingLib = new BrowsingLib(
    browser, interaction, discovery, visual, vision, refinement, network,
    { dump: DUMP_DIR, session: SESSION_DIR, reports: REPORT_DIR }
);

// --- Command Registration ---
function registerModule(module: any) {
    for (const [name, handler] of Object.entries(module)) {
        registry.register(name, handler as any);
    }
}

registerModule(NavigationCommands);
registerModule(InteractionCommands);
registerModule(DiscoveryCommands);
registerModule(VisionCommands);
registerModule(ProtocolCommands);
registerModule(AgentCommands);

// --- Execution Logic ---
async function executeBatch(commands: any[]): Promise<any> {
    const results = [];
    for (const item of commands) {
        let cmd: string;
        let cmdArgs: any[];

        if (Array.isArray(item)) {
            [cmd, ...cmdArgs] = item;
        } else {
            cmd = item.command || item.cmd;
            cmdArgs = item.args || item.arguments || [];
        }

        try {
            const ctx: CommandContext = {
                browser, interaction, visual, discovery, refinement, vision, network, browsingLib,
                paths, registry, args: cmdArgs.map(String)
            };
            const res = await registry.execute(cmd, ctx);
            results.push(res);
            if (!res.ok) break;
        } catch (e) {
            results.push({ ok: false, error: String(e) });
            break;
        }
    }
    return { ok: true, content: JSON.stringify(results) };
}

async function main() {
    const args = process.argv.slice(2);
    const action = args[0];

    if (!action || action === '--help' || action === '-h') {
        process.stderr.write(`Browsing Skill CLI (SOLID + Memory Subskill)\nAvailable Commands: ${registry.getAvailableCommands().join(', ')}\n`);
        process.exit(0);
    }

    let result: any;
    const cmdArgs = args.slice(1);

    // Create Configured Context
    const ctx: CommandContext = {
        browser, interaction, visual, discovery, refinement, vision, network, browsingLib,
        paths, registry, args: cmdArgs
    };

    try {
        if (action === 'run') {
            result = await executeBatch(JSON.parse(cmdArgs[0] || '[]'));
        } else if (action === 'run-file') {
            const fileContent = fs.readFileSync(cmdArgs[0], 'utf8');
            result = await executeBatch(JSON.parse(fileContent));
        } else if (action === 'script') {
            const scriptPath = cmdArgs[0];
            if (!scriptPath || !fs.existsSync(scriptPath)) {
                throw new Error(`Script file not found: ${scriptPath}`);
            }

            // Execute TS script using npx tsx and pass browsingLib context
            // For simplicity and safety, we'll use a dynamic evaluation approach
            // or a sub-process execution that uses the same session.
            // Since we want to share the persistent session, we should run it in-process if possible,
            // or pass the session ID.

            // In-process execution of TS:
            // We can use a trick: require 'tsx/cjs' and then require the script, 
            // but scripts usually export a function.

            // Let's assume the script exports a default function or a 'run' function
            // that accepts browsingLib.

            // For now, let's use a more robust approach:
            const { run } = await import(path.resolve(scriptPath));
            if (typeof run === 'function') {
                result = { ok: true, data: await run(browsingLib) };
            } else {
                throw new Error("Script must export a 'run' function.");
            }
        } else if (action === 'system-dump') {
            result = await browsingLib.systemDump();
        } else {
            result = await registry.execute(action, ctx);
        }
    } catch (e) {
        result = { ok: false, error: String(e) };
    }

    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    fs.writeFileSync(path.join(cwd, 'last_result.json'), JSON.stringify(result, null, 2));

    // Log Outcome
    const status = result.ok ? 'SUCCESS' : 'FAILURE';
    const outcome = result.ok ? 'Browsing session completed successfully.' : `Browsing session failed: ${result.error}`;
    const logScriptPath = path.join(projectRoot, '.agent/skills/knowledge/work-logger/log_work.py');

    if (fs.existsSync(logScriptPath)) {
        try {
            const execAsync = promisify(exec);
            const cmd = `python3 "${logScriptPath}" --status "${status}" --task "Browsing Session ${sessionId}" --outcome "${outcome.replace(/"/g, '\\"')}" --artifacts "${REPORT_DIR}"`;
            await execAsync(cmd);
        } catch (logErr) {
            console.error("Failed to log work:", logErr);
        }
    }

    // Explicit exit to close all CDP handles
    process.exit(result.ok ? 0 : 1);
}

main().catch(err => {
    process.stderr.write(`Fatal error: ${err.message}\n`);
    process.exit(1);
});
