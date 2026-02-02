/**
 * ARIA Snapshot Service
 * Captures semantic accessibility tree state after actions
 * Based on BrowserMCP aria-snapshot pattern
 */

import { Page } from 'playwright-core';

export interface AriaSnapshot {
    url: string;
    title: string;
    snapshot: AccessibilityNode | null;
    timestamp: string;
}

export interface AccessibilityNode {
    role: string;
    name?: string;
    value?: string;
    description?: string;
    children?: AccessibilityNode[];
}

export class AriaSnapshotService {
    /**
     * Capture ARIA accessibility snapshot of the current page
     */
    async capture(page: Page, status?: string): Promise<AriaSnapshot> {
        const url = page.url();
        const title = await page.title();

        // Use safe access pattern for accessibility API (may not exist on all versions)
        const p = page as any;
        let snapshot = null;
        if (p.accessibility && typeof p.accessibility.snapshot === 'function') {
            snapshot = await p.accessibility.snapshot();
        }

        const timestamp = new Date().toISOString();

        return {
            url,
            title,
            snapshot: snapshot as AccessibilityNode | null,
            timestamp
        };
    }

    /**
     * Format snapshot as markdown for AI consumption
     */
    formatAsMarkdown(snapshot: AriaSnapshot, status?: string): string {
        const statusLine = status ? `${status}\n` : '';
        const snapshotYaml = this.nodeToYaml(snapshot.snapshot, 0);

        return `${statusLine}
- Page URL: ${snapshot.url}
- Page Title: ${snapshot.title}
- Page Snapshot
\`\`\`yaml
${snapshotYaml}
\`\`\`
`;
    }

    /**
     * Convert accessibility node tree to YAML-like format
     */
    private nodeToYaml(node: AccessibilityNode | null, depth: number): string {
        if (!node) return 'null';

        const indent = '  '.repeat(depth);
        let result = `${indent}- ${node.role}`;

        if (node.name) {
            result += ` "${node.name}"`;
        }

        if (node.value) {
            result += `: ${node.value}`;
        }

        if (node.children && node.children.length > 0) {
            result += ':\n';
            result += node.children
                .map(child => this.nodeToYaml(child, depth + 1))
                .join('\n');
        }

        return result;
    }

    /**
     * Get a simplified summary of interactive elements
     */
    getInteractiveElements(snapshot: AriaSnapshot): string[] {
        const elements: string[] = [];
        this.extractInteractive(snapshot.snapshot, elements);
        return elements;
    }

    private extractInteractive(node: AccessibilityNode | null, elements: string[]): void {
        if (!node) return;

        const interactiveRoles = ['button', 'link', 'textbox', 'checkbox', 'radio', 'combobox', 'menuitem', 'tab'];

        if (interactiveRoles.includes(node.role)) {
            const name = node.name || node.value || '[unnamed]';
            elements.push(`${node.role}: "${name}"`);
        }

        if (node.children) {
            for (const child of node.children) {
                this.extractInteractive(child, elements);
            }
        }
    }
}

// Singleton export
export const ariaSnapshotService = new AriaSnapshotService();
