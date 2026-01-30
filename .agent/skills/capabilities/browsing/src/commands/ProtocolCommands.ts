
import { CommandContext } from '../core/CommandRegistry.js';
import * as fs from 'fs';
import * as path from 'path';

function logToDump(paths: { logs: string }, data: any, name: string = 'log') {
    const logPath = path.join(paths.logs, `${name}.json`);
    fs.writeFileSync(logPath, JSON.stringify(data, null, 2));
    return logPath;
}

export const ProtocolCommands = {
    'run-protocol': async (ctx: CommandContext) => {
        const protocolData = ctx.args[0];
        let steps: any[] = [];
        try {
            steps = JSON.parse(protocolData);
        } catch (e) {
            if (fs.existsSync(protocolData)) {
                steps = JSON.parse(fs.readFileSync(protocolData, 'utf8'));
            } else {
                return { ok: false, error: "Invalid JSON or file path" };
            }
        }

        const results = [];
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const cmd = step.command || step.cmd;
            const args = (step.arguments || step.args || []).map(String);

            try {
                // Clone context with new args
                const stepCtx: CommandContext = { ...ctx, args };
                const res = await ctx.registry.execute(cmd, stepCtx);

                if (step.screenshot) {
                    const page = await ctx.browser.getPage();
                    const shotName = `step_${i}_${Date.now()}.png`;
                    const shotPath = path.join(ctx.paths.shots, shotName);
                    await page.screenshot({ path: shotPath });
                    res.step_screenshot = shotPath;
                }
                results.push({ step: i, command: cmd, result: res });
                if (res.ok === false) {
                    const page = await ctx.browser.getPage();
                    const panicShot = path.join(ctx.paths.session, `PANIC_step${i}.png`);
                    await page.screenshot({ path: panicShot });
                    const panicState = {
                        ok: false,
                        lastStep: i,
                        lastCommand: cmd,
                        error: res.error,
                        url: page.url(),
                        screenshot: panicShot
                    };
                    logToDump(ctx.paths, panicState, `panic_dump`);
                    if (!step.ignoreError) break;
                }
            } catch (e) {
                const errorState = { step: i, command: cmd, error: String(e) };
                logToDump(ctx.paths, errorState, `fatal_error`);
                results.push(errorState);
                break;
            }
        }
        const finalResult = { ok: true, session: path.basename(ctx.paths.session), path: ctx.paths.session, protocol_results: results };
        logToDump(ctx.paths, finalResult, 'execution_summary');
        return finalResult;
    }
};
