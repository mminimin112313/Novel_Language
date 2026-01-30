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

        try {
            const browser = await chromium.connectOverCDP(`http://localhost:${this.debugPort}`);
            const contexts = browser.contexts();
            this.context = contexts.length > 0 ? contexts[0] : await browser.newContext();
            const pages = this.context.pages();
            this.currentPage = pages.length > 0 ? pages[0] : await this.context.newPage();
            return this.currentPage;
        } catch (e) {
            this.context = await chromium.launchPersistentContext(this.sessionDir, {
                headless: opts.headless ?? false,
                executablePath: opts.executablePath,
                viewport: { width: 1280, height: 720 },
                args: [`--remote-debugging-port=${this.debugPort}`]
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
        if (url) await newPage.goto(url);
        this.currentPage = newPage;
        return newPage;
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
