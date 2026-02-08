import { Page } from 'playwright-core';
import * as path from 'path';
import * as fs from 'fs';

export interface VisualMetadata {
    url: string;
    title: string;
    width: number;
    height: number;
    timestamp: string;
}

export class VisualService {
    async captureSnapshot(page: Page, filename: string): Promise<string> {
        await page.screenshot({ path: filename, fullPage: true });
        return filename;
    }

    async getPageMetadata(page: Page): Promise<VisualMetadata> {
        const viewport = page.viewportSize() || { width: 1280, height: 720 };
        return {
            url: page.url(),
            title: await page.title(),
            width: viewport.width,
            height: viewport.height,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Maps a grid cell to absolute page coordinates.
     */
    getGridCenter(box: { x: number, y: number, width: number, height: number }, rows: number, cols: number, row: number, col: number) {
        // reCAPTCHA v2 grids usually start after a header (approx 100-150px)
        // and end before a footer (approx 70-100px).
        // For a more robust solution, we assume the grid occupies a central portion.
        const gridTopOffset = 100;
        const gridBottomOffset = 100;
        const gridWidth = box.width;
        const gridHeight = box.height - gridTopOffset - gridBottomOffset;

        const cellWidth = gridWidth / cols;
        const cellHeight = gridHeight / rows;

        return {
            x: box.x + (col * cellWidth) + (cellWidth / 2),
            y: box.y + gridTopOffset + (row * cellHeight) + (cellHeight / 2)
        };
    }
}

