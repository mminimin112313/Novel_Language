
import { Page } from 'playwright-core';
import { findFrame } from '../../logic/actions.js';
import path from 'path';

export async function captureSnapshot(page: Page, name: string, frameName?: string): Promise<string> {
    console.log(`>>> [Block] Capturing Snapshot: ${name}`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `snapshot_${name}_${timestamp}.png`;
    const outputPath = path.resolve(process.cwd(), filename);

    if (frameName) {
        const frame = await findFrame(page, frameName);
        if (frame) {
            await frame.locator('body').screenshot({ path: outputPath });
        } else {
            console.warn(`Frame ${frameName} not found for snapshot, using page.`);
            await page.screenshot({ path: outputPath });
        }
    } else {
        await page.screenshot({ path: outputPath });
    }
    console.log(`Saved to: ${outputPath}`);
    return outputPath;
}
