
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runProtocol(protocolPath) {
    if (!protocolPath) {
        console.error('Please provide a protocol JSON file path.');
        process.exit(1);
    }

    const absolutePath = path.resolve(protocolPath);
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        process.exit(1);
    }

    const protocol = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    console.log(`Loaded protocol with ${protocol.length} steps from ${path.basename(absolutePath)}`);

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized'] // Try to start maximized
    });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
        for (const step of protocol) {
            console.log(`Executing: ${step.command}`, step.args);

            switch (step.command) {
                case 'open':
                    await page.goto(step.args[0], { waitUntil: 'domcontentloaded' });
                    // Handle initial popup if it appears immediately
                    await handlePopup(page);
                    break;

                case 'wait':
                    await page.waitForTimeout(parseInt(step.args[0], 10));
                    break;

                case 'click-iframe':
                    {
                        const frameName = step.args[0];
                        const selector = step.args[1];
                        const frame = await getFrame(page, frameName);
                        if (frame) {
                            try {
                                await frame.waitForSelector(selector, { timeout: 5000 });
                                await frame.click(selector);
                            } catch (e) {
                                console.warn(`Failed to click ${selector} in frame ${frameName}: ${e.message}`);
                            }
                        }
                    }
                    break;

                case 'type-iframe':
                    {
                        const frameName = step.args[0];
                        const selector = step.args[1];
                        const text = step.args[2];
                        const frame = await getFrame(page, frameName);
                        if (frame) {
                            try {
                                await frame.waitForSelector(selector, { timeout: 5000 });
                                await frame.fill(selector, text);
                            } catch (e) {
                                console.warn(`Failed to type into ${selector} in frame ${frameName}: ${e.message}`);
                            }
                        }
                    }
                    break;

                case 'keyboardType':
                    await page.keyboard.type(step.args[0]);
                    break;

                case 'snapshot-iframe':
                    {
                        const frameName = step.args[0];
                        const frame = await getFrame(page, frameName);
                        if (frame) {
                            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                            const screenshotPath = path.join(__dirname, `snapshot_${frameName}_${timestamp}.png`);
                            await frame.locator('body').screenshot({ path: screenshotPath });
                            console.log(`Saved snapshot to ${screenshotPath}`);
                        }
                    }
                    break;

                default:
                    console.warn(`Unknown command: ${step.command}`);
            }
        }
    } catch (error) {
        console.error('Error during protocol execution:', error);
    } finally {
        console.log('Protocol execution finished.');
        // await browser.close(); // Keep open for inspection if needed, or close
        setTimeout(() => browser.close(), 2000);
    }
}

async function getFrame(page, frameIdentifier) {
    if (frameIdentifier === 'PostWriteForm') {
        // Specific logic for Naver Blog Editor main frame
        let frame = page.frame({ name: 'mainFrame' });
        if (!frame) {
            frame = page.frames().find(f => f.url().includes('PostWriteForm'));
        }
        if (!frame) {
            console.warn(`Frame with identifier '${frameIdentifier}' (mainFrame/PostWriteForm) not found.`);
            console.log('Available frames:');
            page.frames().forEach(f => console.log(` - Name: "${f.name()}", URL: "${f.url()}"`));
        }
        return frame;
    }
    // Fallback for other frames if needed
    return page.frame({ name: frameIdentifier });
}

async function handlePopup(page) {
    // Attempt to dismiss 'saved draft' popup
    console.log('Checking for popups...');
    try {
        // Option 1: Press Escape
        await page.keyboard.press('Escape');

        // Option 2: Look for button in main frame (sometimes it's there)
        const frame = await getFrame(page, 'PostWriteForm');
        if (frame) {
            const cancelBtn = await frame.$('button:has-text("취소")');
            if (cancelBtn) {
                await cancelBtn.click();
                console.log('Clicked Cancel on popup');
            }
        }
    } catch (e) {
        console.log('Popup handling error (ignorable):', e.message);
    }
}

// Get the protocol file from command line args
const args = process.argv.slice(2);
if (args.length > 0) {
    runProtocol(args[0]);
} else {
    console.log('Usage: node run_protocol.js <path_to_protocol.json>');
}
