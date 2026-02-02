import { Page } from 'playwright-core';
import * as fs from 'fs';
import * as path from 'path';
import { BrowserManager } from './core/BrowserManager.js';
import { InteractionService } from './core/InteractionService.js';
import { DiscoveryService } from './core/DiscoveryService.js';
import { VisualService } from './core/VisualService.js';
import { VisionService } from './core/VisionService.js';
import { RefinementService } from './core/RefinementService.js';
import { NetworkService } from './core/NetworkService.js';

import { CacheService } from './core/CacheService.js';

export interface BrowsingPathConfig {
    dump: string;
    session: string;
    reports: string;
}

export class BrowsingLib {
    private cache: CacheService;

    constructor(
        private browser: BrowserManager,
        private interaction: InteractionService,
        private discovery: DiscoveryService,
        private visual: VisualService,
        private vision: VisionService,
        private refinement: RefinementService,
        private network: NetworkService,
        private paths: BrowsingPathConfig
    ) {
        this.cache = new CacheService(paths.dump); // Use dump dir (project root based) for cache base
    }

    async getPage(): Promise<Page> {
        return await this.browser.getPage();
    }

    async open(url: string) {
        const page = await this.getPage();
        this.network.setupInterception(page);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        return { ok: true, url: page.url() };
    }

    async click(selector: string) {
        const page = await this.getPage();
        await page.click(selector);
        return { ok: true };
    }

    async type(selector: string, text: string) {
        const page = await this.getPage();
        await page.fill(selector, text);
        return { ok: true };
    }

    async systemDump() {
        const page = await this.getPage();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const dumpId = `dump_${timestamp}`;
        // Ensure dump directory is in the project root's browsing_dump/system_dumps
        const dumpDir = path.join(this.paths.dump, 'system_dumps', dumpId);

        if (!fs.existsSync(dumpDir)) {
            fs.mkdirSync(dumpDir, { recursive: true });
        }

        // 1. Screenshot
        const screenshotPath = path.join(dumpDir, 'screenshot.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // 2. Accessibility Tree
        const accessibilityTree = await this.discovery.getAccessibilityTree(page);
        fs.writeFileSync(path.join(dumpDir, 'accessibility_tree.json'), JSON.stringify(accessibilityTree, null, 2));

        // 3. Visual Map
        const visualMap = await this.discovery.getVisualMap(page);
        fs.writeFileSync(path.join(dumpDir, 'visual_map.json'), JSON.stringify(visualMap, null, 2));

        // 4. Advanced DOM Structure
        const domStructure = await this.discovery.getAdvancedDomStructure(page);
        fs.writeFileSync(path.join(dumpDir, 'dom_structure.json'), JSON.stringify(domStructure, null, 2));

        // 5. HTML
        const html = await page.content();
        fs.writeFileSync(path.join(dumpDir, 'page.html'), html);

        // 5. Network Logs
        const networkLogs = this.network.getLogs();
        fs.writeFileSync(path.join(dumpDir, 'network_logs.json'), JSON.stringify(networkLogs, null, 2));

        // 6. Metadata
        const metadata = {
            url: page.url(),
            title: await page.title(),
            timestamp,
            viewport: page.viewportSize(),
            dumpId
        };
        fs.writeFileSync(path.join(dumpDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

        return {
            ok: true,
            dumpId,
            path: dumpDir,
            screenshot: screenshotPath,
            url: page.url()
        };
    }

    async visionClick(description: string) {
        // ... previous implementation ...
        return { ok: false };
    }

    async visionAnalyze(description: string, area?: { x: number, y: number, width: number, height: number }) {
        const page = await this.getPage();
        const screenshotPath = path.join(this.paths.session, `vision_analyze_${Date.now()}.png`);
        await page.screenshot({ path: screenshotPath });

        const cropPath = path.join(this.paths.session, `vision_crop_${Date.now()}.png`);
        const rect = area || { x: 0, y: 0, width: 1280, height: 720 };
        const result = await this.vision.cropAndAnalyze(screenshotPath, cropPath, rect);

        return { ok: true, analysis: result, image: cropPath };
    }

    async inspectAt(x: number, y: number) {
        const page = await this.getPage();
        const elementInfo = await this.discovery.inspectAtPoint(page, x, y);
        return { ok: true, element: elementInfo };
    }

    async executeJS(code: string) {
        const page = await this.getPage();
        const result = await page.evaluate((js) => {
            return eval(js);
        }, code);
        return { ok: true, result };
    }

    async getNetworkLogs() {
        return { ok: true, logs: this.network.getLogs() };
    }

    async extractContent(useCache: boolean = true) {
        const page = await this.getPage();
        const url = page.url();

        if (useCache) {
            const cached = this.cache.get<string>(url);
            if (cached) {
                return { ok: true, content: cached, cached: true };
            }
        }

        const markdown = await this.refinement.toMarkdown(page);

        if (useCache) {
            this.cache.set(url, markdown);
        }

        return { ok: true, content: markdown, cached: false };
    }

    // Expose core services for advanced usage
    getServices() {
        return {
            browser: this.browser,
            interaction: this.interaction,
            discovery: this.discovery,
            visual: this.visual,
            vision: this.vision,
            refinement: this.refinement
        };
    }
}
