
import sharp from 'sharp';
import fs from 'fs/promises';
import { createWorker } from 'tesseract.js';

export async function crop(
    inputPath: string,
    outputPath: string,
    rect: { left: number; top: number; width: number; height: number }
): Promise<void> {
    await sharp(inputPath)
        .extract(rect)
        .toFile(outputPath);
    console.log(`[Vision] Cropped image saved to ${outputPath}`);
}

export async function analyzeText(inputPath: string): Promise<string> {
    console.log(`[Vision] Starting OCR on ${inputPath}...`);
    const worker = await createWorker('eng'); // Default to English, can be parameterized
    const ret = await worker.recognize(inputPath);
    await worker.terminate();
    console.log(`[Vision] OCR Result: "${ret.data.text.trim().substring(0, 50)}..."`);
    return ret.data.text;
}

export async function stitchImages(
    inputPaths: string[],
    outputPath: string,
    direction: 'vertical' | 'horizontal' = 'vertical'
): Promise<void> {
    console.log(`[Vision] Stitching ${inputPaths.length} images (${direction})...`);

    const buffers = await Promise.all(inputPaths.map(p => fs.readFile(p)));
    const metadataList = await Promise.all(buffers.map(b => sharp(b).metadata()));

    if (metadataList.some(m => !m.width || !m.height)) {
        throw new Error('Could not read metadata from one or more images');
    }

    let totalWidth = 0;
    let totalHeight = 0;

    if (direction === 'vertical') {
        totalWidth = Math.max(...metadataList.map(m => m.width!));
        totalHeight = metadataList.reduce((sum, m) => sum + m.height!, 0);
    } else {
        totalWidth = metadataList.reduce((sum, m) => sum + m.width!, 0);
        totalHeight = Math.max(...metadataList.map(m => m.height!));
    }

    const composites: any[] = [];
    let currentX = 0;
    let currentY = 0;

    for (let i = 0; i < buffers.length; i++) {
        composites.push({
            input: buffers[i],
            top: currentY,
            left: currentX
        });

        if (direction === 'vertical') {
            currentY += metadataList[i].height!;
        } else {
            currentX += metadataList[i].width!;
        }
    }

    await sharp({
        create: {
            width: totalWidth,
            height: totalHeight,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
    })
        .composite(composites)
        .toFile(outputPath);

    console.log(`[Vision] Stitched image saved to ${outputPath}`);
}
