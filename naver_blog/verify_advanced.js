const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runExperiment() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
    });

    // Attempt to load cookies if session exists (optional)
    // For now, assume a fresh session or interactive login was done

    const page = await context.newPage();
    console.log('Navigating to Naver Blog Editor...');
    await page.goto('https://blog.naver.com/kmg9463?Redirect=Write&', { waitUntil: 'domcontentloaded' });

    await page.waitForTimeout(5000);

    const frame = page.frame({ name: 'mainFrame' }) || page.frames().find(f => f.url().includes('PostWriteForm'));
    if (!frame) {
        console.error('Main frame not found');
        await browser.close();
        return;
    }

    console.log('Attempting to clear popups...');
    // Try Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Try clicking "취소" in popup if it exists
    try {
        await frame.click('.se-popup-alert-confirm button:text("취소")', { timeout: 2000 });
        console.log('Popup cleared via click');
    } catch (e) {
        console.log('Popup cancel button not found/clickable (may be already cleared)');
    }

    // Try closing help panel
    try {
        await frame.click('button.se-help-panel-close-button', { timeout: 2000 });
        console.log('Help panel closed');
    } catch (e) {
        console.log('Help panel not found');
    }

    console.log('Entering Title...');
    await frame.type('.se-title-text', 'Advanced Automation Verification V7', { delay: 50 });

    console.log('Clicking content area...');
    await frame.click('.se-content');

    console.log('Inserting Horizontal Line...');
    await frame.click('button.se-insert-horizontal-line-default-toolbar-button');
    await page.waitForTimeout(1000);

    console.log('Inserting Quotation...');
    await frame.click('button.se-insert-quotation-default-toolbar-button');
    await page.waitForTimeout(1000);
    await page.keyboard.type('Verified Block Quotation Content');

    console.log('Opening Subtitle Dropdown...');
    await frame.click('button.se-text-format-toolbar-button');
    await page.waitForTimeout(2000);

    console.log('Capturing Screenshot and HTML...');
    await page.screenshot({ path: '/Users/gimminseog/Projects/everything antigravity/naver_blog/v7_results.png' });
    const frameHtml = await frame.content();
    fs.writeFileSync('/Users/gimminseog/Projects/everything antigravity/naver_blog/v7_frame.html', frameHtml);

    console.log('Experiment completed successfully');
    await browser.close();
}

runExperiment().catch(console.error);
