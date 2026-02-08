import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { drawBox, addMemo, crop, analyzeText } from '@agent/vision';

export class VisionService {
    /**
     * Crops an image to specific coordinates
     */
    async cropImage(inputPath: string, outputPath: string, x: number, y: number, width: number, height: number): Promise<string> {
        if (!fs.existsSync(inputPath)) {
            throw new Error(`File not found: ${inputPath}`);
        }

        await sharp(inputPath)
            .extract({ left: Math.round(x), top: Math.round(y), width: Math.round(width), height: Math.round(height) })
            .toFile(outputPath);

        return outputPath;
    }

    /**
     * Finds a small template image within a larger screenshot.
     * Uses a basic sliding window approach with pixelmatch for robustness.
     * Note: This is computationally expensive for large searches.
     */
    async findImageMatch(screenshotPath: string, templatePath: string): Promise<{ x: number, y: number } | null> {
        if (!fs.existsSync(screenshotPath) || !fs.existsSync(templatePath)) {
            return null;
        }

        const screenshot = await sharp(screenshotPath).raw().toBuffer({ resolveWithObject: true });
        const template = await sharp(templatePath).raw().toBuffer({ resolveWithObject: true });

        const sData = screenshot.data;
        const tData = template.data;
        const sWidth = screenshot.info.width;
        const sHeight = screenshot.info.height;
        const tWidth = template.info.width;
        const tHeight = template.info.height;
        const channels = screenshot.info.channels; // usually 3 or 4

        if (tWidth > sWidth || tHeight > sHeight) return null;

        // Simple inefficient template matching
        // Optimization: checking every Nth pixel, then verifying full if promising
        const stride = 5;
        let bestDiff = Infinity;
        let bestX = -1;
        let bestY = -1;
        const threshold = 0.1; // 10% tolerance is generous for exact crops

        for (let y = 0; y <= sHeight - tHeight; y += stride) {
            for (let x = 0; x <= sWidth - tWidth; x += stride) {

                // Quick check center pixel
                const centerY = Math.floor(tHeight / 2);
                const centerX = Math.floor(tWidth / 2);
                const sIdx = ((y + centerY) * sWidth + (x + centerX)) * channels;
                const tIdx = (centerY * tWidth + centerX) * channels;

                if (Math.abs(sData[sIdx] - tData[tIdx]) > 20) continue; // Fast reject

                // Full check
                let diff = 0;
                let pixelsChecked = 0;
                let fail = false;

                // Check a grid of points
                for (let ty = 0; ty < tHeight; ty += 2) {
                    for (let tx = 0; tx < tWidth; tx += 2) {
                        const sIndex = ((y + ty) * sWidth + (x + tx)) * channels;
                        const tIndex = (ty * tWidth + tx) * channels;

                        const dR = sData[sIndex] - tData[tIndex];
                        const dG = sData[sIndex + 1] - tData[tIndex + 1];
                        const dB = sData[sIndex + 2] - tData[tIndex + 2];

                        // Manhattan distance for speed
                        diff += Math.abs(dR) + Math.abs(dG) + Math.abs(dB);
                        pixelsChecked++;

                        // Early exit
                        if (diff / pixelsChecked > 30) {
                            fail = true;
                            break;
                        }
                    }
                    if (fail) break;
                }

                if (!fail) {
                    const avgDiff = diff / pixelsChecked;
                    if (avgDiff < bestDiff) {
                        bestDiff = avgDiff;
                        bestX = x;
                        bestY = y;
                    }
                }
            }
        }

        if (bestX !== -1 && bestDiff < 30) {
            return {
                x: bestX + tWidth / 2,
                y: bestY + tHeight / 2
            };
        }

        return null;
    }

    async cropAndAnalyze(inputPath: string, outputPath: string, rect: { x: number, y: number, width: number, height: number }): Promise<string> {
        await crop(inputPath, outputPath, { left: rect.x, top: rect.y, width: rect.width, height: rect.height });
        return await analyzeText(outputPath);
    }

    async annotate(inputPath: string, outputPath: string, rect: { x: number, y: number, width: number, height: number }, label: string): Promise<void> {
        await drawBox(inputPath, outputPath, rect, 'red');
        await addMemo(outputPath, outputPath, label, 'top-left');
    }
}
