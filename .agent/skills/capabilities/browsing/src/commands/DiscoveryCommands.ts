
import { CommandContext } from '../core/CommandRegistry.js';

export const DiscoveryCommands = {
    'snapshot': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const cleanContent = await page.evaluate(() => {
            const clone = document.documentElement.cloneNode(true) as HTMLElement;
            const toRemove = clone.querySelectorAll('script, style, link, svg, noscript');
            toRemove.forEach(el => el.remove());
            return clone.outerHTML;
        });
        return { ok: true, url: page.url(), content: cleanContent.slice(0, 500000) };
    },
    'snapshot-iframe': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const selector = ctx.args[0] || 'mainFrame';
        const frames = page.frames();
        const frame = frames.find(f => f.name() === selector || f.url().includes(selector)) || page.mainFrame().childFrames().find(f => f.name() === selector);

        if (!frame) return { ok: false, error: `Frame not found for identifier: ${selector}` };

        const cleanContent = await frame.evaluate(() => {
            const clone = document.documentElement.cloneNode(true) as HTMLElement;
            const toRemove = clone.querySelectorAll('script, style, link, svg, noscript');
            toRemove.forEach(el => el.remove());
            return clone.outerHTML;
        });
        return { ok: true, content: cleanContent.slice(0, 500000) };
    },
    'getText': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const text = await page.innerText(ctx.args[0]);
        return { ok: true, content: text };
    },
    'extract': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const url = ctx.args[0];
        const selector = ctx.args[1] || 'body';
        if (url && url !== page.url()) await page.goto(url, { waitUntil: 'domcontentloaded' });
        const html = await page.innerHTML(selector);
        const md = ctx.refinement.convertToMarkdown(html);
        return { ok: true, url: page.url(), content: md, title: await page.title() };
    },
    'list-elements': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const elements = await ctx.discovery.listInteractiveElements(page);
        return { ok: true, url: page.url(), result: elements };
    },
    'list-links': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const links = await ctx.discovery.listLinksAndButtons(page);
        return { ok: true, url: page.url(), result: links };
    },
    'inspect-at': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const x = parseFloat(ctx.args[0]);
        const y = parseFloat(ctx.args[1]);
        const info = await ctx.discovery.inspectAtPoint(page, x, y);
        return { ok: true, url: page.url(), result: info };
    },
    'visual-map': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const map = await ctx.discovery.getVisualMap(page);
        return { ok: true, url: page.url(), result: map };
    }
};
