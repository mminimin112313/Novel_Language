
import { chromium } from 'playwright-core';
import { addBadge } from '@agent/vision';
import path from 'path';
import fs from 'fs/promises';

(async () => {
    console.log('--- Annotating Naver Homepage (Badges) ---');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    try {
        await page.goto('https://www.naver.com');

        const outputDir = process.cwd();
        const screenshotPath = path.join(outputDir, 'naver_full_source.png');
        const annotatedPath = path.join(outputDir, 'naver_full_annotated.png');

        // Capture Source
        await page.screenshot({ path: screenshotPath });

        // Initialize annotated image by copying source
        await fs.copyFile(screenshotPath, annotatedPath);

        // Define targets to annotate
        const targets = [
            { name: '뉴스', text: 'Daily News\nTop Stories', color: '#EF4444', offset: { x: 0, y: 70 } },
            { name: '블로그', text: 'User Blogs\nWrite Now', color: '#10B981', offset: { x: 0, y: -70 } },
            { name: '쇼핑', text: 'Shop Items', color: '#3B82F6', offset: { x: 70, y: 70 } },
            { name: '지도', text: 'Find Way\nMaps', color: '#F59E0B', offset: { x: -70, y: 0 } }
        ];

        for (const t of targets) {
            try {
                // Find element
                const loc = page.getByRole('link', { name: t.name, exact: true }).first();
                if (await loc.isVisible()) {
                    const box = await loc.boundingBox();
                    if (box) {
                        console.log(`Annotating ${t.name} at (${box.x}, ${box.y})`);

                        // Calculate center of element
                        const targetX = box.x + box.width / 2;
                        const targetY = box.y + box.height / 2;

                        // Apply Badge
                        await addBadge(annotatedPath, annotatedPath, t.text, {
                            targetX: Math.floor(targetX),
                            targetY: Math.floor(targetY),
                            badgeX: Math.floor(targetX + t.offset.x),
                            badgeY: Math.floor(targetY + t.offset.y),
                            color: t.color,
                            textColor: 'white',
                            opacity: 0.95
                        });
                    }
                } else {
                    console.log(`Skipping ${t.name}: not visible`);
                }
            } catch (e) {
                console.error(`Error annotating ${t.name}:`, e);
            }
        }

        console.log('--- Annotation Complete ---');
        console.log(`Output: ${annotatedPath}`);

    } catch (e) {
        console.error('Script Error:', e);
    } finally {
        await browser.close();
    }
})();
