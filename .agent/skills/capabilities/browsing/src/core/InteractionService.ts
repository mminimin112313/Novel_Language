import { Page } from 'playwright-core';

export class InteractionService {
    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async moveMouseHumanlike(page: Page, targetX: number, targetY: number) {
        const mouse = page.mouse;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const steps = 20 + Math.floor(Math.random() * 10);

        const cp1x = startX + (targetX - startX) * Math.random();
        const cp1y = startY + (targetY - startY) * Math.random();
        const cp2x = startX + (targetX - startX) * Math.random();
        const cp2y = startY + (targetY - startY) * Math.random();

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = Math.pow(1 - t, 3) * startX +
                3 * Math.pow(1 - t, 2) * t * cp1x +
                3 * (1 - t) * Math.pow(t, 2) * cp2x +
                Math.pow(t, 3) * targetX;
            const y = Math.pow(1 - t, 3) * startY +
                3 * Math.pow(1 - t, 2) * t * cp1y +
                3 * (1 - t) * Math.pow(t, 2) * cp2y +
                Math.pow(t, 3) * targetY;

            const jitterX = (Math.random() - 0.5) * 2;
            const jitterY = (Math.random() - 0.5) * 2;

            await mouse.move(x + jitterX, y + jitterY);
            if (i % 5 === 0) await this.sleep(10 + Math.random() * 20);
        }
    }

    async humanType(page: Page, selector: string, text: string) {
        const element = await page.waitForSelector(selector, { timeout: 10000 });
        if (!element) throw new Error(`Element not found: ${selector}`);

        const box = await element.boundingBox();
        if (box) {
            await this.moveMouseHumanlike(page, box.x + box.width / 2, box.y + box.height / 2);
            await this.sleep(100 + Math.random() * 200);
            await page.click(selector);
        }

        for (const char of text) {
            await page.keyboard.type(char, { delay: 50 + Math.random() * 150 });
        }
    }

    async clickAt(page: Page, x: number, y: number) {
        await this.moveMouseHumanlike(page, x, y);
        await this.sleep(100 + Math.random() * 200);
        await page.mouse.click(x, y);
    }
}
