import { Page, ElementHandle } from 'playwright-core';

export interface ElementInfo {
    tagName: string;
    selector: string;
    text: string;
    type?: string;
    role?: string;
    ariaLabel?: string;
    description?: string;
}

export async function listInteractiveElements(page: Page): Promise<ElementInfo[]> {
    return await page.evaluate(() => {
        const interactives = Array.from(document.querySelectorAll('button, input, select, textarea, a, [role="button"], [role="link"], [onclick]'));

        return interactives.map(el => {
            const element = el as HTMLElement;

            // Basic selector generation (ID preferred)
            let selector = element.id ? `#${element.id}` : '';
            if (!selector && element.classList.length > 0) {
                selector = `.${Array.from(element.classList).join('.')}`;
            }
            if (!selector) {
                selector = element.tagName.toLowerCase();
            }

            return {
                tagName: element.tagName.toLowerCase(),
                selector: selector,
                text: element.innerText.trim().slice(0, 50),
                type: (element as HTMLInputElement).type,
                role: element.getAttribute('role') || undefined,
                ariaLabel: element.getAttribute('aria-label') || undefined,
            };
        });
    });
}

export async function listLinksAndButtons(page: Page): Promise<ElementInfo[]> {
    return await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('a, button, [role="link"], [role="button"]'));

        return elements.map(el => {
            const element = el as HTMLElement;
            let selector = element.id ? `#${element.id}` : '';
            if (!selector) {
                // Try to find a unique enough selector
                const tag = element.tagName.toLowerCase();
                const text = element.innerText.trim().slice(0, 20);
                selector = `${tag}:has-text("${text}")`;
            }

            return {
                tagName: element.tagName.toLowerCase(),
                selector: selector,
                text: element.innerText.trim().slice(0, 100),
                role: element.getAttribute('role') || (element.tagName === 'A' ? 'link' : 'button'),
                ariaLabel: element.getAttribute('aria-label') || undefined,
            };
        });
    });
}
