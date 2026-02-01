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
        const frames = page.frames();
        const allElements: ElementInfo[] = [];

        for (const frame of frames) {
            try {
                const frameElement = await frame.frameElement();
                const box = await frameElement.boundingBox();
                const frameX = box ? box.x : 0;
                const frameY = box ? box.y : 0;

                const elements = await frame.evaluate(() => {
                    const interactives = Array.from(document.querySelectorAll('button, input, select, textarea, a, iframe, [role="button"], [role="link"], [onclick]'));

                    return interactives.map(el => {
                        const element = el as HTMLElement;
                        const rect = element.getBoundingClientRect();
                        let selector = element.id ? `#${element.id}` : '';
                        if (!selector && element.className && typeof element.className === 'string') {
                            selector = `.${element.className.trim().split(/\s+/).join('.')}`;
                        }
                        if (!selector) selector = element.tagName.toLowerCase();

                        return {
                            tagName: element.tagName.toLowerCase(),
                            selector: selector,
                            text: element.innerText.trim().slice(0, 30),
                            type: (element as HTMLInputElement).type || undefined,
                            role: element.getAttribute('role') || undefined,
                            x: Math.round(rect.x),
                            y: Math.round(rect.y),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        };
                    });
                });

                // Map coordinates to main frame space
                elements.forEach(el => {
                    if (el.x !== undefined) el.x = Math.round(el.x + frameX);
                    if (el.y !== undefined) el.y = Math.round(el.y + frameY);
                    allElements.push(el);
                });
            } catch (e) {
                // Skip frames we can't access
                continue;
            }
        }
        return allElements;
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
        // Try to find the element in the main frame first or any frame that contains the point
        const frames = page.frames();
        let deepestElement: ElementInfo | null = null;
        let smallestArea = Infinity;

        for (const frame of frames) {
            try {
                // Get the frame's bounding box to see if the point (x,y) is inside it
                const frameElement = await frame.frameElement();
                const box = await frameElement.boundingBox();

                // For the main frame, the box is the viewport
                const viewport = page.viewportSize() || { width: 1280, height: 720 };
                const frameBox = frame === page.mainFrame()
                    ? { x: 0, y: 0, width: viewport.width, height: viewport.height }
                    : box;

                if (frameBox &&
                    x >= frameBox.x && x <= frameBox.x + frameBox.width &&
                    y >= frameBox.y && y <= frameBox.y + frameBox.height) {

                    // Coordinates relative to this frame
                    const relX = x - frameBox.x;
                    const relY = y - frameBox.y;

                    const info = await frame.evaluate(({ x, y }) => {
                        const el = document.elementFromPoint(x, y) as HTMLElement;
                        if (!el) return null;
                        const rect = el.getBoundingClientRect();

                        // Advanced analysis
                        const style = window.getComputedStyle(el);
                        const listeners = (window as any).getEventListeners ? (window as any).getEventListeners(el) : undefined;

                        return {
                            tagName: el.tagName.toLowerCase(),
                            selector: el.id ? `#${el.id}` : el.tagName.toLowerCase(),
                            text: el.innerText.trim().slice(0, 500),
                            x: Math.round(rect.x),
                            y: Math.round(rect.y),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height),
                            attributes: Array.from(el.attributes).reduce((acc: any, attr) => {
                                acc[attr.name] = attr.value;
                                return acc;
                            }, {}),
                            computedStyle: {
                                display: style.display,
                                visibility: style.visibility,
                                cursor: style.cursor,
                                color: style.color,
                                backgroundColor: style.backgroundColor
                            },
                            hasListeners: !!listeners
                        };
                    }, { x: relX, y: relY });

                    if (info) {
                        // Map coordinates back to screen space
                        info.x = Math.round(info.x + frameBox.x);
                        info.y = Math.round(info.y + frameBox.y);

                        // We want the most specific (deepest) element. 
                        // Often this means the frame with the smallest area that contains the point.
                        const area = frameBox.width * frameBox.height;
                        if (area < smallestArea) {
                            smallestArea = area;
                            deepestElement = info;
                        }
                    }
                }
            } catch (e) {
                continue;
            }
        }

        return deepestElement;
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
                    ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);

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

            return map;
        });
    }

    async getAccessibilityTree(page: Page): Promise<any> {
        // Use Playwright's built-in accessibility API if available
        const p = page as any;
        if (p.accessibility && typeof p.accessibility.snapshot === 'function') {
            return await p.accessibility.snapshot();
        }
        console.warn("Playwright accessibility API not available on this page/version.");
        return { error: "Accessibility API not available" };
    }

    async getAdvancedDomStructure(page: Page): Promise<any> {
        return await page.evaluate(() => {
            function summarizeNode(node: Element, depth: number = 0): any {
                if (depth > 5) return { tag: node.tagName.toLowerCase(), childrenCount: node.children.length };

                const rect = node.getBoundingClientRect();
                return {
                    tag: node.tagName.toLowerCase(),
                    id: node.id || undefined,
                    class: node.className || undefined,
                    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                    children: Array.from(node.children).map(child => summarizeNode(child, depth + 1))
                };
            }
            return summarizeNode(document.body);
        });
    }
}

