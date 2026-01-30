import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { BrowserManager } from './core/BrowserManager.js';
import { InteractionService } from './core/InteractionService.js';
import { VisualService } from './core/VisualService.js';
import { DiscoveryService } from './core/DiscoveryService.js';
import { RefinementService } from './core/RefinementService.js';
import { CommandRegistry, CommandContext } from './core/CommandRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();

const DUMP_DIR = path.join(cwd, '..', '..', 'browsing_dump');
if (!fs.existsSync(DUMP_DIR)) fs.mkdirSync(DUMP_DIR, { recursive: true });

const browser = new BrowserManager(cwd);
const interaction = new InteractionService();
const visual = new VisualService();
const discovery = new DiscoveryService();
const refinement = new RefinementService();
const registry = new CommandRegistry();


// Command Registrations
registry.register('open', async (ctx) => {
    const page = await ctx.browser.ensureBrowser();
    await page.goto(ctx.args[0], { waitUntil: 'domcontentloaded', timeout: 30000 });
    return { ok: true, url: page.url(), title: await page.title() };
});

registry.register('snapshot', async (ctx) => {
    const page = await ctx.browser.getPage();

    // Smart Truncation: Remove scripts, styles and large hidden elements
    const cleanContent = await page.evaluate(() => {
        const clone = document.documentElement.cloneNode(true) as HTMLElement;
        const toRemove = clone.querySelectorAll('script, style, link, svg, noscript');
        toRemove.forEach(el => el.remove());
        return clone.outerHTML;
    });

    return { ok: true, url: page.url(), content: cleanContent.slice(0, 500000) }; // 500KB limit
});

registry.register('screenshot', async (ctx) => {
    const page = await ctx.browser.getPage();
    const filename = ctx.args[0] || `screenshot_${Date.now()}.png`;
    const fullPage = ctx.args[1] === 'true';
    const shotPath = path.isAbsolute(filename) ? filename : path.join(DUMP_DIR, filename);
    await page.screenshot({ path: shotPath, fullPage });
    return { ok: true, url: page.url(), screenshot: shotPath };
});


registry.register('click', async (ctx) => {
    const page = await ctx.browser.getPage();
    const selector = ctx.args[0];
    const element = await page.waitForSelector(selector, { timeout: 10000 });
    const box = await element?.boundingBox();
    if (box) {
        await ctx.interaction.moveMouseHumanlike(page, box.x + box.width / 2, box.y + box.height / 2);
        await ctx.interaction.sleep(100 + Math.random() * 200);
        await page.click(selector);
    }
    return { ok: true, url: page.url() };
});

registry.register('click-at', async (ctx) => {
    const page = await ctx.browser.getPage();
    const x = parseFloat(ctx.args[0]);
    const y = parseFloat(ctx.args[1]);
    await ctx.interaction.clickAt(page, x, y);
    return { ok: true, url: page.url() };
});

registry.register('type', async (ctx) => {
    const page = await ctx.browser.getPage();
    await ctx.interaction.humanType(page, ctx.args[0], ctx.args.slice(1).join(' '));
    return { ok: true, url: page.url() };
});

registry.register('press', async (ctx) => {
    const page = await ctx.browser.getPage();
    await page.keyboard.press(ctx.args[0]);
    return { ok: true, url: page.url() };
});

registry.register('keyboardType', async (ctx) => {
    const page = await ctx.browser.getPage();
    await page.keyboard.type(ctx.args.join(' '));
    return { ok: true, url: page.url() };
});

registry.register('getText', async (ctx) => {
    const page = await ctx.browser.getPage();
    const text = await page.innerText(ctx.args[0]);
    return { ok: true, content: text };
});

registry.register('extract', async (ctx) => {
    const page = await ctx.browser.getPage();
    const url = ctx.args[0];
    const selector = ctx.args[1] || 'body';
    if (url && url !== page.url()) await page.goto(url, { waitUntil: 'domcontentloaded' });
    const html = await page.innerHTML(selector);
    const md = ctx.refinement.convertToMarkdown(html);
    return { ok: true, url: page.url(), content: md, title: await page.title() };
});

registry.register('list-elements', async (ctx) => {
    const page = await ctx.browser.getPage();
    const elements = await ctx.discovery.listInteractiveElements(page);
    return { ok: true, url: page.url(), result: elements };
});

registry.register('list-links', async (ctx) => {
    const page = await ctx.browser.getPage();
    const links = await ctx.discovery.listLinksAndButtons(page);
    return { ok: true, url: page.url(), result: links };
});

registry.register('inspect-at', async (ctx) => {
    const page = await ctx.browser.getPage();
    const x = parseFloat(ctx.args[0]);
    const y = parseFloat(ctx.args[1]);
    const info = await ctx.discovery.inspectAtPoint(page, x, y);
    return { ok: true, url: page.url(), result: info };
});

registry.register('visual-map', async (ctx) => {
    const page = await ctx.browser.getPage();
    const map = await ctx.discovery.getVisualMap(page);
    return { ok: true, url: page.url(), result: map };
});

registry.register('human-search', async (ctx) => {

    const query = ctx.args.join(' ');
    const page = await ctx.browser.getPage();
    await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
    const searchBoxSelector = 'textarea[name="q"], input[name="q"]';
    await page.waitForSelector(searchBoxSelector);
    await ctx.interaction.humanType(page, searchBoxSelector, query);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => { });
    const shotPath = path.join(DUMP_DIR, `google_search_${Date.now()}.png`);
    await page.screenshot({ path: shotPath });
    return { ok: true, url: page.url(), title: await page.title(), screenshot: shotPath };
});


registry.register('newTab', async (ctx) => {
    const p = await ctx.browser.newTab(ctx.args[0]);
    return { ok: true, url: p.url() };
});

registry.register('close', async (ctx) => {
    await ctx.browser.close();
    return { ok: true };
});

registry.register('wait', async (ctx) => {
    const ms = parseInt(ctx.args[0] || '1000');
    await interaction.sleep(ms);
    const p = await ctx.browser.getPage();
    return { ok: true, url: p.url() };
});

async function executeBatch(commands: any[]): Promise<any> {
    const results = [];
    for (const [cmd, ...cmdArgs] of commands) {
        try {
            const ctx: CommandContext = { browser, interaction, visual, discovery, refinement, args: cmdArgs };
            const res = await registry.execute(cmd, ctx);
            results.push(res);
            if (!res.ok) break;
        } catch (e) {
            results.push({ ok: false, error: String(e) });
            break;
        }
    }
    return { ok: true, content: JSON.stringify(results) };
}

async function main() {
    const args = process.argv.slice(2);
    const action = args[0];

    if (!action || action === '--help' || action === '-h') {
        console.log(`
Browsing Skill CLI (SOLID Modular)

Usage:
  npm run browse <command> [args...]

Commands:
  open <url>
  snapshot
  screenshot <path> [fullPage]
  extract <url> [selector]
  click <selector>
  click-at <x> <y>
  type <selector> <text>
  press <key>
  keyboardType <text>
  getText <selector>
  list-elements
  list-links
  human-search <query>
  newTab [url]
  wait <ms>
  run <json_string>
  run-file <path>
  close
`);
        process.exit(0);
    }

    let result: any;
    const cmdArgs = args.slice(1);
    const ctx: CommandContext = { browser, interaction, visual, discovery, refinement, args: cmdArgs };

    try {
        if (action === 'run') {
            result = await executeBatch(JSON.parse(cmdArgs[0] || '[]'));
        } else if (action === 'run-file') {
            const fileContent = fs.readFileSync(cmdArgs[0], 'utf8');
            result = await executeBatch(JSON.parse(fileContent));
        } else {
            result = await registry.execute(action, ctx);
        }
    } catch (e) {
        result = { ok: false, error: String(e) };
    }

    console.log(JSON.stringify(result, null, 2));
    fs.writeFileSync(path.join(cwd, 'last_result.json'), JSON.stringify(result, null, 2));
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
