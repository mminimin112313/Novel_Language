
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { BrowserManager } from './core/BrowserManager.js';
import { InteractionService } from './core/InteractionService.js';
import { VisualService } from './core/VisualService.js';
import { DiscoveryService } from './core/DiscoveryService.js';
import { RefinementService } from './core/RefinementService.js';
import { VisionService } from './core/VisionService.js';
import { CommandRegistry, CommandContext } from './core/CommandRegistry.js';

// Commands
import { NavigationCommands } from './commands/NavigationCommands.js';
import { InteractionCommands } from './commands/InteractionCommands.js';
import { DiscoveryCommands } from './commands/DiscoveryCommands.js';
import { VisionCommands } from './commands/VisionCommands.js';
import { ProtocolCommands } from './commands/ProtocolCommands.js';
import { AgentCommands } from './commands/AgentCommands.js';
import { MemoryCommands } from './commands/MemoryCommands.js';

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
const registry = new CommandRegistry();

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
registerModule(MemoryCommands); // New Subskill

// --- Execution Logic ---
async function executeBatch(commands: any[]): Promise<any> {
    const results = [];
    for (const [cmd, ...cmdArgs] of commands) {
        try {
            const ctx: CommandContext = {
                browser, interaction, visual, discovery, refinement, vision,
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
        browser, interaction, visual, discovery, refinement, vision,
        paths, registry, args: cmdArgs
    };

    try {
        if (action === 'run') {
            result = await executeBatch(JSON.parse(cmdArgs[0] || '[]'));
        } else if (action === 'run-file') {
            const fileContent = fs.readFileSync(cmdArgs[0], 'utf8');
            result = await executeBatch(JSON.parse(fileContent));
        } else {
            result = await registry.execute(action, ctx);
        }
    } catch (e) {
        result = { ok: false, error: String(e) };
    }

    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    fs.writeFileSync(path.join(cwd, 'last_result.json'), JSON.stringify(result, null, 2));

    // Explicit exit to close all CDP handles
    process.exit(result.ok ? 0 : 1);
}

main().catch(err => {
    process.stderr.write(`Fatal error: ${err.message}\n`);
    process.exit(1);
});
