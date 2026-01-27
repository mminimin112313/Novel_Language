import { chromium, Browser, Page } from 'playwright-core';

interface BrowseOptions {
    headless?: boolean;
    executablePath?: string;
}

interface BrowseResult {
    ok: boolean;
    url?: string;
    title?: string;
    content?: string;
    error?: string;
    screenshot?: string;
}

let browser: Browser | null = null;
let page: Page | null = null;

async function ensureBrowser(opts: BrowseOptions = {}): Promise<Page> {
    if (page && !page.isClosed()) return page;

    browser = await chromium.launch({
        headless: opts.headless ?? true,
        executablePath: opts.executablePath,
    });

    page = await browser.newPage();
    return page;
}

async function closeBrowser(): Promise<void> {
    if (page) {
        await page.close().catch(() => { });
        page = null;
    }
    if (browser) {
        await browser.close().catch(() => { });
        browser = null;
    }
}

export async function open(url: string, opts: BrowseOptions = {}): Promise<BrowseResult> {
    try {
        const p = await ensureBrowser(opts);
        await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        return {
            ok: true,
            url: p.url(),
            title: await p.title(),
        };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

export async function snapshot(): Promise<BrowseResult> {
    try {
        if (!page || page.isClosed()) {
            return { ok: false, error: 'No page open. Call open() first.' };
        }
        const content = await page.content();
        const title = await page.title();
        return {
            ok: true,
            url: page.url(),
            title,
            content: content.slice(0, 50000), // Limit to 50k chars
        };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

export async function screenshot(path?: string): Promise<BrowseResult> {
    try {
        if (!page || page.isClosed()) {
            return { ok: false, error: 'No page open. Call open() first.' };
        }
        const screenshotPath = path || `screenshot-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        return {
            ok: true,
            url: page.url(),
            screenshot: screenshotPath,
        };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

export async function click(selector: string): Promise<BrowseResult> {
    try {
        if (!page || page.isClosed()) {
            return { ok: false, error: 'No page open. Call open() first.' };
        }
        await page.click(selector, { timeout: 10000 });
        return { ok: true, url: page.url() };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

export async function type(selector: string, text: string): Promise<BrowseResult> {
    try {
        if (!page || page.isClosed()) {
            return { ok: false, error: 'No page open. Call open() first.' };
        }
        await page.fill(selector, text, { timeout: 10000 });
        return { ok: true, url: page.url() };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

export async function getText(selector: string): Promise<BrowseResult> {
    try {
        if (!page || page.isClosed()) {
            return { ok: false, error: 'No page open. Call open() first.' };
        }
        const element = await page.$(selector);
        if (!element) {
            return { ok: false, error: `Element not found: ${selector}` };
        }
        const text = await element.innerText();
        return { ok: true, content: text };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

export async function close(): Promise<BrowseResult> {
    await closeBrowser();
    return { ok: true };
}

// CLI Entry Point
async function main() {
    const args = process.argv.slice(2);
    const action = args[0];

    if (!action || action === '--help' || action === '-h') {
        console.log(`
Browsing Skill CLI

Usage:
  npm run browse open <url>
  npm run browse snapshot
  npm run browse screenshot [path]
  npm run browse click <selector>
  npm run browse type <selector> <text>
  npm run browse getText <selector>
  npm run browse close
`);
        process.exit(0);
    }

    let result: BrowseResult;

    switch (action) {
        case 'open':
            result = await open(args[1] || 'about:blank');
            break;
        case 'snapshot':
            result = await snapshot();
            break;
        case 'screenshot':
            result = await screenshot(args[1]);
            break;
        case 'click':
            result = await click(args[1] || '');
            break;
        case 'type':
            result = await type(args[1] || '', args.slice(2).join(' '));
            break;
        case 'getText':
            result = await getText(args[1] || '');
            break;
        case 'close':
            result = await close();
            break;
        default:
            console.error(`Unknown action: ${action}`);
            process.exit(1);
    }

    console.log(JSON.stringify(result, null, 2));

    // Auto-close browser after single command
    await closeBrowser();
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
