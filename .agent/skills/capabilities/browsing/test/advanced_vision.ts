
import { stitchImages, addSpeechBubble } from '@agent/vision';
import sharp from 'sharp';
import path from 'path';

(async () => {
    console.log('--- Advanced Vision Verification ---');

    // 1. Create Dummy Images using Sharp directly
    const img1Path = 'test_img1.png';
    const img2Path = 'test_img2.png';
    const stitchedPath = 'test_stitched.png';

    await sharp({
        create: {
            width: 400,
            height: 200,
            channels: 4,
            background: { r: 255, g: 0, b: 0, alpha: 1 } // Red
        }
    }).toFile(img1Path);

    await sharp({
        create: {
            width: 400,
            height: 200,
            channels: 4,
            background: { r: 0, g: 0, b: 255, alpha: 1 } // Blue
        }
    }).toFile(img2Path);

    console.log('Created dummy images.');

    // 2. Stitch Images
    await stitchImages([img1Path, img2Path], stitchedPath, 'vertical');
    console.log('Stitched images.');

    // 3. Add Speech Bubble
    // Target coordinate: Intersection of Red/Blue locally at (200, 200)
    await addSpeechBubble(stitchedPath, stitchedPath, "Look! Using 'stitch' & 'bubble' capability!", {
        width: 250,
        height: 80,
        bubbleX: 50,
        bubbleY: 50,
        targetX: 200,
        targetY: 200, // Middle where they join
        opacity: 0.8,
        color: 'white',
        textColor: 'black'
    });

    console.log('--- Verification Complete ---');
    console.log(`Output: ${stitchedPath}`);
})();
