import sharp from 'sharp';
import fs from 'fs/promises';
export async function addSpeechBubble(inputPath, outputPath, text, options) {
    const { target, center = { x: 150, y: 50 }, // Default if not provided
    width, // Optional, auto-calc if undefined
    height, opacity = 0.9, color = 'white', textColor = 'black', fontSize = 16 } = options;
    const inputBuffer = await fs.readFile(inputPath);
    const image = sharp(inputBuffer);
    const meta = await image.metadata();
    // Auto-size if needed
    const padding = 20;
    const textWidthEstimate = text.length * (fontSize * 0.8);
    const bubbleWidth = width || Math.max(100, textWidthEstimate + (padding * 2));
    const bubbleHeight = height || (fontSize * 3);
    const bubbleX = center.x - (bubbleWidth / 2); // Center align the bubble body to the point
    const bubbleY = center.y - (bubbleHeight / 2);
    const centerX = center.x;
    const centerY = center.y;
    const svgBubble = `
    <svg width="${meta.width}" height="${meta.height}">
        <defs>
            <filter id="shadow-bubble-${Date.now()}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="3" stdDeviation="2" flood-opacity="0.3"/>
            </filter>
        </defs>
        <g opacity="${opacity}" filter="url(#shadow-bubble-${Date.now()})">
            <!-- Tail -->
            <path d="M ${centerX} ${centerY} L ${target.x} ${target.y}" stroke="${color}" stroke-width="15" stroke-linecap="round" />
            
            <!-- Body -->
            <rect x="${bubbleX}" y="${bubbleY}" width="${bubbleWidth}" height="${bubbleHeight}" rx="15" ry="15" fill="${color}" />
            
            <!-- Text -->
            <text x="${centerX}" y="${centerY}" 
                  fill="${textColor}" 
                  font-family="Arial, sans-serif" 
                  font-size="${fontSize}px" 
                  font-weight="bold" 
                  text-anchor="middle" 
                  dominant-baseline="middle">
                ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </text>
        </g>
    </svg>
    `;
    await image
        .composite([{
            input: Buffer.from(svgBubble),
            left: 0,
            top: 0
        }])
        .toFile(outputPath);
    console.log(`[Vision] Speech Bubble added to ${outputPath}`);
}
