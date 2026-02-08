
import { chromium } from 'playwright-core';
import { openEditor, handlePopup, writePost } from '../src/blocks/naver/editor.js';
import { captureSnapshot } from '../src/blocks/common/utils.js';

(async () => {
    console.log('--- Starting Verification Journey ---');

    // Launch Browser
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    try {
        // Step 1: Open Editor
        await openEditor(page);

        // Step 2: Handle Popup (Optional but handled safely)
        await handlePopup(page);

        // Step 3: Write Post
        await writePost(page, {
            title: "Verification: TS Modules Architecture",
            content: "This post confirms that the new TypeScript Module architecture is working correctly.\n\nIt supports dynamic composition!",
            components: { hr: true, quote: true }
        });

        // Step 4: Verify via Snapshot
        await captureSnapshot(page, 'verification_success', 'PostWriteForm');

        console.log('--- Verification Complete: SUCCESS ---');

    } catch (error) {
        console.error('--- Verification Failed ---');
        console.error(error);
        await captureSnapshot(page, 'verification_failure');
    } finally {
        await browser.close();
    }
})();
