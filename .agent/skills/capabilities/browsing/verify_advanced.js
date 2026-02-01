import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

async function runExperiment() {
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 } // WIDER VIEWPORT
    });

    const page = await context.newPage();
    console.log('Navigating to Naver Blog Editor...');
    await page.goto('https://blog.naver.com/kmg9463?Redirect=Write&', { waitUntil: 'domcontentloaded' });

    await page.waitForTimeout(5000);

    console.log('Attempting to clear popups...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    const frame = page.frame({ name: 'mainFrame' }) || page.frames().find(f => f.url().includes('PostWriteForm'));
    if (frame) {
        try {
            await frame.click('.se-popup-alert-confirm button >> text="취소"', { timeout: 2000 });
            console.log('Popup cleared via click');
        } catch (e) {
            console.log('Popup cancel button not found (Escape might have worked)');
        }
    } else {
        console.warn('Main frame not found for popup clearing, proceeding...');
    }

    console.log('Clicking Publish Button...');
    // Using a more robust selector or text match for the publish button
    try {
        await page.click('.publish_btn__m9KHH', { timeout: 5000 });
        console.log('Publish layer opened');
    } catch (e) {
        console.log('Publish button click failed, trying text match...');
        await page.click('button:has-text("발행")', { timeout: 5000 });
    }

    await page.waitForTimeout(3000);

    console.log('Capturing Publish Layer Screenshot and HTML...');
    await page.screenshot({ path: '/Users/gimminseog/Projects/everything antigravity/naver_blog/publish_results.png' });
    const fullHtml = await page.content();
    fs.writeFileSync('/Users/gimminseog/Projects/everything antigravity/naver_blog/publish_layer.html', fullHtml);

    console.log('Publish analysis completed successfully');
    await browser.close();
}

runExperiment().catch(console.error);
