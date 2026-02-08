
import { CommandContext } from '../core/CommandRegistry.js';
import * as path from 'path';

export const AgentCommands = {
    'human-search': async (ctx: CommandContext) => {
        const query = ctx.args.join(' ');
        const page = await ctx.browser.getPage();
        await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
        const searchBoxSelector = 'textarea[name="q"], input[name="q"]';
        // Need to use command execution for other commands? 
        // Or access services directly. Services is better for internal composition.
        await page.waitForSelector(searchBoxSelector);
        await ctx.interaction.humanType(page, searchBoxSelector, query);
        await page.keyboard.press('Enter');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => { });
        const shotPath = path.join(ctx.paths.dump, `google_search_${Date.now()}.png`);
        await page.screenshot({ path: shotPath });
        return { ok: true, url: page.url(), title: await page.title(), screenshot: shotPath };
    }
};
