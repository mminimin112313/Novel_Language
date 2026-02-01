
import { chromium } from 'playwright-core';
import { captureSnapshot } from '../src/blocks/common/utils.js';
import { drawBox, addMemo, crop, analyzeText } from '@agent/vision';
import path from 'path';

(async () => {
    console.log('--- Vision Integration Verification ---');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // 1. Visit Google (simple page)
        await page.goto('https://www.google.com');

        // 2. Capture Screenshot (Browsing Skill)
        const snapshotPath = await captureSnapshot(page, 'vision_test_source');
        const annotatedPath = snapshotPath.replace('.png', '_annotated.png');
        const croppedPath = snapshotPath.replace('.png', '_cropped.png');

        // 3. Annotate (Vision Skill)
        console.log('>>> Drawing Box & Memo...');
        // Draw box around the logo area (approximate)
        await drawBox(snapshotPath, annotatedPath, { left: 500, top: 100, width: 400, height: 150 }, 'red');
        await addMemo(annotatedPath, annotatedPath, 'Visual Check: Google Logo', 'top-left');

        // 4. Crop & OCR (Vision Skill)
        console.log('>>> Cropping & OCR...');
        // Crop the button area (approximate)
        await crop(snapshotPath, croppedPath, { left: 0, top: 0, width: 200, height: 100 });

        // OCR the cropped image
        const text = await analyzeText(croppedPath);
        console.log(`>>> OCR Result: "${text}"`);

        console.log('--- Verification Complete: SUCCESS ---');
        console.log(`Outputs: \n - ${annotatedPath} \n - ${croppedPath}`);

    } catch (e) {
        console.error('--- Verification Failed ---', e);
    } finally {
        await browser.close();
    }
})();
