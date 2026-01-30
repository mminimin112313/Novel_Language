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
                };
            });
        });
    }

    async inspectAtPoint(page: Page, x: number, y: number): Promise<ElementInfo | null> {
        return await page.evaluate(({ x, y }) => {
            const el = document.elementFromPoint(x, y) as HTMLElement;
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return {
                tagName: el.tagName.toLowerCase(),
                selector: el.id ? `#${el.id}` : el.tagName.toLowerCase(),
                text: el.innerText.trim().slice(0, 500),
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        }, { x, y });
    }

    async getVisualMap(page: Page): Promise<ElementInfo[]> {
        return await page.evaluate(() => {
            const all = Array.from(document.querySelectorAll('*'));
            const map: any[] = [];

            all.forEach(el => {
                const element = el as HTMLElement;
                const rect = element.getBoundingClientRect();

                // Pruning: filter non-visible or zero-sized
                if (rect.width === 0 || rect.height === 0) return;

                // Pruning: filter outside viewport (approx)
                if (rect.bottom < 0 || rect.top > window.innerHeight) return;

                // Weighting: Is it likely interactive?
                const style = window.getComputedStyle(element);
                const isClickable = style.cursor === 'pointer' ||
                    element.hasAttribute('onclick') ||
                    ['BUTTON', 'A', 'INPUT', 'SELECT'].includes(element.tagName);

                const text = (element.innerText || '').trim();

                if (isClickable || text.length > 0) {
                    map.push({
                        tagName: element.tagName.toLowerCase(),
                        text: text.slice(0, 50),
                        x: Math.round(rect.x),
                        y: Math.round(rect.y),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        isClickable
                    });
                }
            });

            // Very basic clustering: if parent and child have same text and similar bounds, keep child if clickable, else keep parent
            return map.filter((item, index) => {
                // This is a simplified cluster logic to save tokens
                if (item.tagName === 'body' || item.tagName === 'html') return false;
                return true;
            });
        });
    }
}

