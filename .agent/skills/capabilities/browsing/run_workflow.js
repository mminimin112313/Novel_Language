
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOCKS_DIR = path.join(__dirname, 'blocks');

async function runWorkflow(workflowPath) {
    if (!workflowPath) {
        console.error('Please provide a workflow JSON file path.');
        process.exit(1);
    }

    const absolutePath = path.resolve(workflowPath);
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }

    const workflow = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    console.log(`Starting Workflow: ${workflow.name}`);
    console.log(`Description: ${workflow.description}`);

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    const sessionReport = {
        workflow: workflow.name,
        timestmap: new Date().toISOString(),
        blocks: []
    };

    try {
        for (const blockName of workflow.blocks) {
            const blockPath = path.join(BLOCKS_DIR, `${blockName}.json`);
            if (!fs.existsSync(blockPath)) {
                console.error(`Block not found: ${blockName} (checked ${blockPath})`);
                throw new Error(`Block ${blockName} missing`);
            }

            const block = JSON.parse(fs.readFileSync(blockPath, 'utf8'));
            console.log(`\n>>> Executing Block: ${block.name}`);

            const blockResult = { name: blockName, status: 'pending', logs: [] };

            try {
                await executeSteps(page, block.steps);
                blockResult.status = 'success';
                console.log(`>>> Block ${block.name} COMPLETED`);
            } catch (e) {
                blockResult.status = 'failed';
                blockResult.error = e.message;
                console.error(`>>> Block ${block.name} FAILED: ${e.message}`);
                throw e; // Stop workflow on failure
            }

            sessionReport.blocks.push(blockResult);
        }
    } catch (error) {
        console.error('\nWorkflow execution failed or stopped.');
    } finally {
        console.log('\n--- Session Report ---');
        console.log(JSON.stringify(sessionReport, null, 2));

        const reportPath = path.join(__dirname, `report_${workflow.name}_${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(sessionReport, null, 2));
        console.log(`Report saved to ${reportPath}`);

        setTimeout(() => browser.close(), 2000);
    }
}

async function executeSteps(page, steps) {
    for (const step of steps) {
        console.log(`  -> ${step.command}`, step.args || []);
        try {
            switch (step.command) {
                case 'open':
                    await page.goto(step.args[0], { waitUntil: 'domcontentloaded' });
                    break;
                case 'wait':
                    await page.waitForTimeout(parseInt(step.args[0], 10));
                    break;
                case 'click-iframe':
                    await performInFrame(page, step.args[0], async (frame) => {
                        await frame.waitForSelector(step.args[1], { timeout: 5000 });
                        await frame.click(step.args[1]);
                    });
                    break;
                case 'type-iframe':
                    await performInFrame(page, step.args[0], async (frame) => {
                        await frame.waitForSelector(step.args[1], { timeout: 5000 });
                        await frame.fill(step.args[1], step.args[2]);
                    });
                    break;
                case 'keyboardType':
                    await page.keyboard.type(step.args[0]);
                    break;
                case 'snapshot-iframe':
                    await performInFrame(page, step.args[0], async (frame) => {
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        const screenshotPath = path.join(__dirname, `snapshot_${step.args[0]}_${timestamp}.png`);
                        await frame.locator('body').screenshot({ path: screenshotPath });
                        console.log(`     Saved snapshot: ${screenshotPath}`);
                    });
                    break;
                default:
                    console.warn(`     Unknown command: ${step.command}`);
            }
        } catch (e) {
            if (step.optional) {
                console.log(`     Optional step failed (ignoring): ${e.message}`);
            } else {
                throw e;
            }
        }
    }
}

async function performInFrame(page, frameIdentifier, action) {
    let frame = page.frame({ name: 'mainFrame' });
    if (!frame) {
        // Retry used in V1 logic
        frame = page.frames().find(f => f.url().includes('PostWriteForm'));
    }

    // Debug info if still missing
    if (!frame && frameIdentifier === 'PostWriteForm') {
        process.stdout.write('     Debug: Searching for frame... ');
        // Sometimes reloading frames helps? or just wait?
        // Let's implement a small retry loop for the frame itself
        for (let i = 0; i < 3; i++) {
            frame = page.frames().find(f => f.url().includes('PostWriteForm'));
            if (frame) break;
            await page.waitForTimeout(1000);
        }
    }

    if (frame) {
        await action(frame);
    } else {
        throw new Error(`Frame ${frameIdentifier} not found`);
    }
}

// Get the workflow file from command line args
const args = process.argv.slice(2);
if (args.length > 0) {
    runWorkflow(args[0]);
} else {
    console.log('Usage: node run_workflow.js <path_to_workflow.json>');
}
