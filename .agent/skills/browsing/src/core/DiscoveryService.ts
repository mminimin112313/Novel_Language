import { Page } from 'playwright-core';

export interface ElementInfo {
    tagName: string;
    selector: string;
    text: string;
    type?: string;
    role?: string;
    ariaLabel?: string;
    description?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export class DiscoveryService {
    async listInteractiveElements(page: Page): Promise<ElementInfo[]> {
        return await page.evaluate(() => {
            const interactives = Array.from(document.querySelectorAll('button, input, select, textarea, a, iframe, [role="button"], [role="link"], [onclick]'));

            return interactives.map(el => {
                const element = el as HTMLElement;
                const rect = element.getBoundingClientRect();
                let selector = element.id ? `#${element.id}` : '';
                if (!selector && element.className) {
                    selector = `.${element.className.trim().split(/\s+/).join('.')}`;
                }
                if (!selector) selector = element.tagName.toLowerCase();

                return {
                    tagName: element.tagName.toLowerCase(),
                    selector: selector,
                    text: element.innerText.trim().slice(0, 30), // Truncate more for tokens
                    type: (element as HTMLInputElement).type || undefined,
                    role: element.getAttribute('role') || undefined,
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                };
            });
        });
    }


    async listLinksAndButtons(page: Page): Promise<ElementInfo[]> {
        return await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('a, button, [role="link"], [role="button"]'));

            return elements.map(el => {
                const element = el as HTMLElement;
                let selector = element.id ? `#${element.id}` : '';
                if (!selector) {
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
}
