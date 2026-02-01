
import { Page, Frame, Locator } from 'playwright-core';

/**
 * Enhanced interaction primitives for the Browsing Skill.
 * Wraps Playwright actions with consistent logging and error handling.
 */

export async function safeClick(pageOrFrame: Page | Frame, selector: string, description?: string): Promise<void> {
    console.log(`[Action] Click: ${description || selector}`);
    try {
        await pageOrFrame.waitForSelector(selector, { state: 'visible', timeout: 5000 });
        await pageOrFrame.click(selector);
    } catch (error: any) {
        console.error(`[Error] Failed to click '${selector}': ${error.message}`);
        throw error;
    }
}

export async function safeType(pageOrFrame: Page | Frame, selector: string, text: string, description?: string): Promise<void> {
    console.log(`[Action] Type: "${text}" into ${description || selector}`);
    try {
        await pageOrFrame.waitForSelector(selector, { state: 'visible', timeout: 5000 });
        await pageOrFrame.fill(selector, text);
    } catch (error: any) {
        console.error(`[Error] Failed to type into '${selector}': ${error.message}`);
        throw error;
    }
}

export async function wait(ms: number): Promise<void> {
    console.log(`[Action] Wait: ${ms}ms`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function findFrame(page: Page, urlPartOrName: string, retries = 5): Promise<Frame | null> {
    console.log(`[Action] Finding Frame: '${urlPartOrName}' (Retries: ${retries})`);

    for (let i = 0; i <= retries; i++) {
        let frame = page.frame({ name: urlPartOrName });
        if (!frame) {
            frame = page.frames().find(f => f.url().includes(urlPartOrName)) || null;
        }

        if (frame) {
            console.log(`[Action] Found Frame: '${frame.name() || "unnamed"}' (${frame.url()})`);
            return frame;
        }

        if (i < retries) {
            console.log(`[Wait] Frame not found, retrying... (${i + 1}/${retries})`);
            await wait(1000);
        }
    }

    console.warn(`[Warn] Frame '${urlPartOrName}' NOT found after ${retries} retries.`);
    // Debug: List all frames
    console.log('[Debug] Available Frames:');
    page.frames().forEach(f => console.log(`  - Name: "${f.name()}", URL: "${f.url()}"`));

    return null;
}
