
import { chromium } from 'playwright-core';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
    console.log('[SVP] Starting Robust Extraction Phase...');

    const browser = await chromium.launch({
        headless: true,
        executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });

    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
    const page = await context.newPage();

    try {
        console.log('[SVP] Navigating to Carbon React Docs...');
        await page.goto('https://carbondesignsystem.com/developing/frameworks/react/', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        console.log('[SVP] Waiting for Side Nav...');
        await page.waitForSelector('nav.cds--side-nav', { timeout: 15000 });

        console.log('[SVP] Expanding Submenus and Extracting Hierarchy...');

        const toc = await page.evaluate(() => {
            const sidebar = document.querySelector('nav.cds--side-nav');
            if (!sidebar) return "Sidebar not found";

            function getItems(container: Element, depth = 0) {
                const results: any[] = [];
                // Target list items within the current container
                const listItems = Array.from(container.querySelectorAll(':scope > ul > li, :scope > li')) as HTMLElement[];

                listItems.forEach(li => {
                    const button = li.querySelector(':scope > button.cds--side-nav__submenu') as HTMLElement;
                    const link = li.querySelector(':scope > a.cds--side-nav__link') as HTMLAnchorElement;
                    const subUl = li.querySelector(':scope > ul.cds--side-nav__menu');

                    if (button) {
                        results.push({
                            type: 'category',
                            text: button.textContent?.trim() || 'Unknown',
                            level: depth,
                            children: subUl ? getItems(subUl, depth + 1) : []
                        });
                    } else if (link) {
                        results.push({
                            type: 'link',
                            text: link.textContent?.trim() || 'Unknown',
                            href: link.href,
                            level: depth
                        });
                    }
                });
                return results;
            }

            const rootUl = sidebar.querySelector('ul.cds--side-nav__items');
            if (rootUl) {
                return getItems(rootUl);
            }
            return "Root items not found";
        });

        console.log('[SVP] Extraction Complete.');

        const outputPath = path.resolve('carbon_toc_full.json');
        fs.writeFileSync(outputPath, JSON.stringify(toc, null, 2));
        console.log(`[SVP] Saved Full TOC to ${outputPath}`);

    } catch (error) {
        console.error('[SVP] Error during extraction:', error);
    } finally {
        await browser.close();
    }
})();
