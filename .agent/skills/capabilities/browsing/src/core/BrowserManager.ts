import { chromium, BrowserContext, Page } from 'playwright-core';
import * as path from 'path';

export interface BrowserOptions {
    headless?: boolean;
    executablePath?: string;
}

export class BrowserManager {
    private context: BrowserContext | null = null;
    private currentPage: Page | null = null;
    private readonly sessionDir: string;
    private readonly debugPort = 9222;

    constructor(cwd: string) {
        this.sessionDir = path.join(cwd, '.session');
    }

    async ensureBrowser(opts: BrowserOptions = {}): Promise<Page> {
        if (this.currentPage && !this.currentPage.isClosed()) return this.currentPage;

        const isHeadless = process.env.HEADLESS === 'true' || (opts.headless ?? false);
        console.error(`[*] Launching browser (Headless: ${isHeadless})`);

        try {
            // Add a timeout to the CDP connection attempt
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const browser = await chromium.connectOverCDP(`http://localhost:${this.debugPort}`);
            clearTimeout(timeoutId);

            console.error(`[*] Connected to existing browser via CDP`);
            const contexts = browser.contexts();
            this.context = contexts.length > 0 ? contexts[0] : await browser.newContext();

            // Wait for pages with timeout
            const pages = this.context.pages();
            this.currentPage = pages.length > 0 ? pages[0] : await this.context.newPage();

            return this.currentPage;
        } catch (e) {
            console.error(`[*] CDP Connection failed or timed out, launching fresh context: ${e}`);
            this.context = await chromium.launchPersistentContext(this.sessionDir, {
                headless: isHeadless,
                executablePath: opts.executablePath,
                viewport: { width: 1280, height: 720 },
                args: [
                    `--remote-debugging-port=${this.debugPort}`,
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
            const pages = this.context.pages();
            this.currentPage = pages.length > 0 ? pages[0] : await this.context.newPage();
            return this.currentPage;
        }
    }

    async getPage(): Promise<Page> {
        return await this.ensureBrowser();
    }

    async newTab(url?: string): Promise<Page> {
        if (!this.context) await this.ensureBrowser();
        const newPage = await this.context!.newPage();
        if (url) await newPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        this.currentPage = newPage;
        return newPage;
    }

    async closeTab(): Promise<void> {
        if (this.currentPage) {
            await this.currentPage.close();
            const pages = this.context?.pages() || [];
            this.currentPage = pages.length > 0 ? pages[pages.length - 1] : null;
        }
    }

    async switchTab(index: number): Promise<Page | null> {
        if (!this.context) return null;
        const pages = this.context.pages();
        if (index >= 0 && index < pages.length) {
            this.currentPage = pages[index];
            return this.currentPage;
        }
        return null;
    }

    async close(): Promise<void> {
        if (this.context) {
            await this.context.close().catch(() => { });
            this.context = null;
            this.currentPage = null;
        }
    }

    getContext(): BrowserContext | null {
        return this.context;
    }
}
