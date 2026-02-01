
import { CommandContext } from '../core/CommandRegistry.js';

export const InteractionCommands = {
    'click': async (ctx: CommandContext) => {
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
    },
    'click-at': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const x = parseFloat(ctx.args[0]);
        const y = parseFloat(ctx.args[1]);
        await ctx.interaction.clickAt(page, x, y);
        return { ok: true, url: page.url() };
    },
    'multi-click-at': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const clicks = [];
        for (let i = 0; i < ctx.args.length; i += 2) {
            const x = parseFloat(ctx.args[i]);
            const y = parseFloat(ctx.args[i + 1]);
            if (!isNaN(x) && !isNaN(y)) {
                await ctx.interaction.clickAt(page, x, y);
                clicks.push({ x, y });
            }
        }
        return { ok: true, clicks };
    },
    'type': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        await ctx.interaction.humanType(page, ctx.args[0], ctx.args.slice(1).join(' '));
        return { ok: true, url: page.url() };
    },
    'press': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        await page.keyboard.press(ctx.args[0]);
        return { ok: true, url: page.url() };
    },
    'click-mod': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const selector = ctx.args[0];
        const modifiers = ctx.args.slice(1) as any[]; // e.g. ['Control'] or ['Meta']
        await page.click(selector, { modifiers });
        return { ok: true, url: page.url() };
    },
    'mouseMove': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const x = parseFloat(ctx.args[0]);
        const y = parseFloat(ctx.args[1]);
        await page.mouse.move(x, y);
        return { ok: true };
    },
    'keyboardType': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        await page.keyboard.type(ctx.args.join(' '));
        return { ok: true, url: page.url() };
    },
    'click-iframe': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const frameSelector = ctx.args[0];
        const selector = ctx.args[1];
        const frame = page.frame({ name: frameSelector }) || page.frames().find(f => f.url().includes(frameSelector));
        if (!frame) return { ok: false, error: `Frame not found: ${frameSelector}` };

        await frame.click(selector);
        return { ok: true };
    },
    'type-iframe': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const frameSelector = ctx.args[0];
        const selector = ctx.args[1];
        const text = ctx.args.slice(2).join(' ');
        const frame = page.frame({ name: frameSelector }) || page.frames().find(f => f.url().includes(frameSelector));
        if (!frame) return { ok: false, error: `Frame not found: ${frameSelector}` };

        await frame.click(selector);
        await frame.type(selector, text, { delay: 50 });
        return { ok: true };
    }
};
