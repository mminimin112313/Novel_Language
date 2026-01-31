
import { CommandContext } from '../core/CommandRegistry.js';

export const NavigationCommands = {
    'open': async (ctx: CommandContext) => {
        const page = await ctx.browser.ensureBrowser();
        await page.goto(ctx.args[0], { waitUntil: 'domcontentloaded', timeout: 30000 });
        return { ok: true, url: page.url(), title: await page.title() };
    },
    'newTab': async (ctx: CommandContext) => {
        const p = await ctx.browser.newTab(ctx.args[0]);
        return { ok: true, url: p.url() };
    },
    'close-tab': async (ctx: CommandContext) => {
        await ctx.browser.closeTab();
        const p = await ctx.browser.getPage();
        return { ok: true, url: p?.url() };
    },
    'switch-tab': async (ctx: CommandContext) => {
        const index = parseInt(ctx.args[0] || '0');
        const p = await ctx.browser.switchTab(index);
        return { ok: p !== null, url: p?.url() };
    },
    'close': async (ctx: CommandContext) => {
        await ctx.browser.close();
        return { ok: true };
    },
    'wait': async (ctx: CommandContext) => {
        const ms = parseInt(ctx.args[0] || '1000');
        await ctx.interaction.sleep(ms);
        const p = await ctx.browser.getPage();
        return { ok: true, url: p.url() };
    }
};
