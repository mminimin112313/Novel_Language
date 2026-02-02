/**
 * Persistent Browser Server
 * Keeps the browser open continuously in the background.
 * Other CLI commands connect to this server via CDP.
 * 
 * Usage: node dist/browser-server.js
 */

import { chromium } from 'playwright-core';
import * as path from 'path';
import * as fs from 'fs';

const DEBUG_PORT = 9222;
const SESSION_DIR = path.join(process.cwd(), '.session');

async function startServer() {
    console.log('[BrowserServer] Starting persistent browser...');
    console.log(`[BrowserServer] Debug Port: ${DEBUG_PORT}`);
    console.log(`[BrowserServer] Session Dir: ${SESSION_DIR}`);

    if (!fs.existsSync(SESSION_DIR)) {
        fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    const isHeadless = process.env.HEADLESS === 'true';

    const context = await chromium.launchPersistentContext(SESSION_DIR, {
        headless: isHeadless,
        viewport: { width: 1280, height: 720 },
        args: [
            `--remote-debugging-port=${DEBUG_PORT}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

    console.log('[BrowserServer] Browser started successfully!');
    console.log('[BrowserServer] Press Ctrl+C to stop the server and close the browser.');
    console.log(`[BrowserServer] Current page: ${page.url()}`);

    // Keep the process alive
    process.on('SIGINT', async () => {
        console.log('\n[BrowserServer] Shutting down...');
        await context.close();
        process.exit(0);
    });

    // Heartbeat to keep alive
    setInterval(() => {
        // Just keep alive
    }, 60000);
}

startServer().catch(err => {
    console.error('[BrowserServer] Failed to start:', err);
    process.exit(1);
});
