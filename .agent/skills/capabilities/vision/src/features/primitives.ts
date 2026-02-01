
import sharp from 'sharp';
import fs from 'fs/promises';
import { Rect } from '../types.js';

/**
 * Draws a bounding box on an image.
 */
export async function drawBox(
    inputPath: string,
    outputPath: string,
    rect: Rect,
    color: string = 'red'
): Promise<void> {
    const svgRect = `
    <svg width="${rect.width}" height="${rect.height}">
        <rect x="0" y="0" width="${rect.width}" height="${rect.height}" 
              style="fill:none;stroke:${color};stroke-width:5;opacity:0.8" />
    </svg>
    `;

    const image = sharp(await fs.readFile(inputPath));

    await image
        .composite([{
            input: Buffer.from(svgRect),
            left: rect.x, // Assuming Rect uses x/y unlike original 'left/top' param name, adapting logic
            top: rect.y
        }])
        .toFile(outputPath);

    console.log(`[Vision] Box drawn on ${outputPath}`);
}

/**
 * Adds a text memo to the image.
 */
export async function addMemo(
    inputPath: string,
    outputPath: string,
    text: string,
    position: 'top-left' | 'bottom-right' = 'top-left'
): Promise<void> {
    const inputBuffer = await fs.readFile(inputPath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    const svgText = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: white; font-size: 24px; font-weight: bold; font-family: sans-serif; }
            .bg { fill: black; opacity: 0.7; }
        </style>
        <rect x="10" y="10" width="300" height="50" rx="10" class="bg" />
        <text x="30" y="45" class="title">${text}</text>
    </svg>
    `;

    await image
        .composite([{
            input: Buffer.from(svgText),
            left: 0,
            top: 0
        }])
        .toFile(outputPath);

    console.log(`[Vision] Memo added to ${outputPath}`);
}
