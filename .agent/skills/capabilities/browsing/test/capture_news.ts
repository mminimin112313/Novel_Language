
import { chromium } from 'playwright-core';
import { drawBox, crop } from '@agent/vision';
import path from 'path';

(async () => {
    console.log('--- Capturing Naver News Button ---');

    // 1. Browsing: Navigate and locate
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.naver.com');

    const outputDir = process.cwd();
    const screenshotPath = path.join(outputDir, 'naver_main.png');
    const cropPath = path.join(outputDir, 'naver_news_button.png');
    const annotatedPath = path.join(outputDir, 'naver_main_annotated.png');

    try {
        // Locate "News" (뉴스) button
        // Naver's nav is usually a list. exact text match is safest.
        const newsBtn = page.getByRole('link', { name: '뉴스', exact: true }).first();

        if (!await newsBtn.isVisible()) {
            throw new Error('News button not found');
        }

        const box = await newsBtn.boundingBox();
        if (!box) throw new Error('No bounding box found for News button');

        console.log(`Found "News" button at: x=${box.x}, y=${box.y}, w=${box.width}, h=${box.height}`);

        // Take full screenshot
        await page.screenshot({ path: screenshotPath });

        // 2. Vision: Crop
        console.log('Cropping button image...');
        await crop(screenshotPath, cropPath, {
            left: Math.floor(box.x),
            top: Math.floor(box.y),
            width: Math.floor(box.width),
            height: Math.floor(box.height)
        });

        // 3. Vision: Annotation (for context)
        console.log('Annotating source image...');
        await drawBox(screenshotPath, annotatedPath, {
            left: Math.floor(box.x),
            top: Math.floor(box.y),
            width: Math.floor(box.width),
            height: Math.floor(box.height)
        }, 'red');

        console.log('--- Capture Complete ---');
        console.log(`Cropped Image: ${cropPath}`);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
