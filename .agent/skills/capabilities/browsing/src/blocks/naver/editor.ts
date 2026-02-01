
import { Page } from 'playwright-core';
import { safeClick, safeType, wait, findFrame } from '../../logic/actions.js';

/**
 * Naver Blog Capability Blocks
 */

export async function openEditor(page: Page): Promise<void> {
    console.log('>>> [Block] Opening Naver Blog Editor');
    await page.goto('https://blog.naver.com/kmg9463?Redirect=Write&', { waitUntil: 'domcontentloaded' });
    await wait(8000); // Increased wait time
}

export async function handlePopup(page: Page): Promise<void> {
    console.log('>>> [Block] Handling Draft Popup');
    // Try Escape first
    await page.keyboard.press('Escape');
    await wait(500);

    // Check frame for button
    const frame = await findFrame(page, 'PostWriteForm', 5);
    if (frame) {
        try {
            // Check if the "Cancel" button exists and click it
            const cancelBtn = await frame.$('button:has-text("취소")');
            if (cancelBtn && await cancelBtn.isVisible()) {
                await safeClick(frame, 'button:has-text("취소")', 'Popup Cancel Button');
            } else {
                console.log('No visible popup cancel button found.');
            }
        } catch (e) {
            console.log('Popup check harmless error:', e);
        }
    }
}

export interface PostContent {
    title: string;
    content: string;
    components?: {
        hr?: boolean;
        quote?: boolean;
    };
}

export async function writePost(page: Page, data: PostContent): Promise<void> {
    console.log(`>>> [Block] Writing Post: "${data.title}"`);

    // Debug: Dump frames before searching
    console.log('[Debug] Pre-search Frame Dump:');
    page.frames().forEach(f => console.log(`  - ${f.name()} : ${f.url()}`));

    const frame = await findFrame(page, 'PostWriteForm', 10); // Increase retries to 10
    if (!frame) throw new Error('Editor Main Frame not found!');

    // 1. Set Title
    await safeType(frame, '.se-title-text', data.title, 'Title Input');

    // 2. Focus Content Area
    await safeClick(frame, '.se-content', 'Content Area');

    // 3. Insert Components (if requested)
    if (data.components?.hr) {
        await safeClick(frame, 'button.se-insert-horizontal-line-default-toolbar-button', 'Horizontal Line Tool');
        await wait(500);
    }
    if (data.components?.quote) {
        await safeClick(frame, 'button.se-insert-quotation-default-toolbar-button', 'Quote Tool');
        await wait(500);
    }

    // 4. Type Content
    console.log(`[Action] Typing Content Body`);
    await page.keyboard.type(data.content);
}
