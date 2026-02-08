
import { addBadge, addSpeechBubble } from '@agent/vision';
import sharp from 'sharp';
import path from 'path';

(async () => {
    console.log('--- Vision Refactor Verification ---');

    const outputDir = process.cwd();
    const baseImage = path.join(outputDir, 'refactor_base.png');
    const outputImage = path.join(outputDir, 'refactor_output.png');

    // Create a base image
    await sharp({
        create: {
            width: 800,
            height: 600,
            channels: 4,
            background: { r: 50, g: 50, b: 50, alpha: 1 }
        }
    }).toFile(baseImage);

    // 1. Large Font Badge (High DPI simulation)
    await addBadge(baseImage, outputImage, "Big Title\nImportant", {
        target: { x: 200, y: 200 },
        offset: { x: 0, y: -80 },
        fontSize: 32,
        color: '#E11D48'
    });

    // 2. Small Font Badge (Low DPI simulation)
    await addBadge(outputImage, outputImage, "tiny note", {
        target: { x: 600, y: 200 },
        offset: { x: 0, y: 40 },
        fontSize: 12,
        color: '#2563EB'
    });

    // 3. Speech Bubble
    await addSpeechBubble(outputImage, outputImage, "I am a bubble!", {
        target: { x: 400, y: 400 },
        center: { x: 400, y: 300 },
        color: '#16A34A'
    });

    console.log('--- Verification Complete ---');
    console.log(`Output: ${outputImage}`);
})();
