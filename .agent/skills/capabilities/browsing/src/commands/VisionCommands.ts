
import { CommandContext } from '../core/CommandRegistry.js';
import * as path from 'path';
import * as fs from 'fs';

export const VisionCommands = {
    'screenshot': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const filename = ctx.args[0] || `shot_${Date.now()}.png`;
        const fullPage = ctx.args[1] === 'true';

        let shotPath;
        if (path.isAbsolute(filename)) {
            shotPath = filename;
        } else if (filename.startsWith('report_') || filename.includes('final')) {
            shotPath = path.join(ctx.paths.reports, filename);
        } else {
            shotPath = path.join(ctx.paths.shots, filename);
        }

        await page.screenshot({ path: shotPath, fullPage });
        return { ok: true, url: page.url(), screenshot: shotPath };
    },
    'crop': async (ctx: CommandContext) => {
        const inputArg = ctx.args[0];
        const inputPath = path.isAbsolute(inputArg) ? inputArg : path.join(ctx.paths.shots, inputArg);
        const outputArg = ctx.args[1];
        const outputPath = path.isAbsolute(outputArg) ? outputArg : path.join(ctx.paths.shots, outputArg);
        const x = parseFloat(ctx.args[2]);
        const y = parseFloat(ctx.args[3]);
        const w = parseFloat(ctx.args[4]);
        const h = parseFloat(ctx.args[5]);

        const result = await ctx.vision.cropImage(inputPath, outputPath, x, y, w, h);
        return { ok: true, cropped_image: result };
    },
    'find-click': async (ctx: CommandContext) => {
        const page = await ctx.browser.getPage();
        const templateName = ctx.args[0];

        let templatePath;
        if (path.isAbsolute(templateName)) {
            templatePath = templateName;
        } else {
            templatePath = path.join(ctx.paths.shots, templateName);
            if (!fs.existsSync(templatePath)) {
                // Try cwd as fallback
                if (fs.existsSync(path.join(process.cwd(), templateName))) {
                    templatePath = path.join(process.cwd(), templateName);
                }
            }
        }

        if (!fs.existsSync(templatePath)) {
            return { ok: false, error: `Template image not found: ${templatePath}` };
        }

        const searchShotPath = path.join(ctx.paths.shots, `search_${Date.now()}.png`);
        await page.screenshot({ path: searchShotPath });

        const center = await ctx.vision.findImageMatch(searchShotPath, templatePath);

        if (center) {
            await ctx.interaction.clickAt(page, center.x, center.y);
            return { ok: true, match: center, url: page.url() };
        } else {
            return { ok: false, error: "Image not found on screen" };
        }
    }
};
