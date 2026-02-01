
import { chromium } from 'playwright-core';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
    const browser = await chromium.launch({
        headless: true,
        executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
    const page = await context.newPage();
    try {
        await page.goto('https://carbondesignsystem.com/developing/frameworks/react/', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await page.waitForSelector('nav.cds--side-nav', { timeout: 15000 });
        const html = await page.$eval('nav.cds--side-nav', el => el.innerHTML);
        fs.writeFileSync(path.resolve('carbon_sidebar.html'), html);
        console.log('[SVP] Saved sidebar HTML to carbon_sidebar.html');
    } catch (error) {
        console.error('[SVP] Error:', error);
    } finally {
        await browser.close();
    }
})();
