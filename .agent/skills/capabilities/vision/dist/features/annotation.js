import sharp from 'sharp';
import fs from 'fs/promises';
/**
 * Draws a bounding box on an image.
 * Useful for debugging where the agent clicked or looked.
 */
export async function drawBox(inputPath, outputPath, rect, color = 'red') {
    const svgRect = `
    <svg width="${rect.width}" height="${rect.height}">
        <rect x="0" y="0" width="${rect.width}" height="${rect.height}" 
              style="fill:none;stroke:${color};stroke-width:5;opacity:0.8" />
    </svg>
    `;
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    await image
        .composite([{
            input: Buffer.from(svgRect),
            left: rect.left,
            top: rect.top
        }])
        .toFile(outputPath);
    console.log(`[Vision] Box drawn on ${outputPath}`);
}
/**
 * Adds a text memo to the image.
 * Useful for annotating failures or states.
 */
export async function addMemo(inputPath, outputPath, text, position = 'top-left') {
    // Read input to buffer first to allow same-file overwrite
    const inputBuffer = await fs.readFile(inputPath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;
    // Create a text overlay using SVG
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
/**
 * Adds a comic-style speech bubble pointing to a target.
 */
export async function addSpeechBubble(inputPath, outputPath, text, options = {}) {
    // defaults
    const { targetX = 100, targetY = 100, bubbleX = 150, bubbleY = 50, width = 300, height = 100, opacity = 0.9, color = 'white', textColor = 'black' } = options;
    const inputBuffer = await fs.readFile(inputPath);
    const image = sharp(inputBuffer);
    const meta = await image.metadata();
    // Calculate tail path based on positions
    // Simple triangle tail from center of bubble side to target
    const centerX = bubbleX + width / 2;
    const centerY = bubbleY + height / 2;
    let tailPath = '';
    // A simple implementation: Tail starts from nearest edge center to target
    // Refinement: Tail is a filled polygon
    // Draw bubble (rect with rounded corners) + tail
    const svgBubble = `
    <svg width="${meta.width}" height="${meta.height}">
        <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="5" dy="5" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
        </defs>
        <g opacity="${opacity}" filter="url(#shadow)">
            <!-- Tail (Simple line to target for now, usually needs complex path logic) -->
            <path d="M ${centerX} ${centerY} L ${targetX} ${targetY}" stroke="${color}" stroke-width="20" stroke-linecap="round" />
            
            <!-- Bubble Body -->
            <rect x="${bubbleX}" y="${bubbleY}" width="${width}" height="${height}" rx="20" ry="20" fill="${color}" />
            
            <!-- Text -->
            <foreignObject x="${bubbleX + 10}" y="${bubbleY + 10}" width="${width - 20}" height="${height - 20}">
                <div xmlns="http://www.w3.org/1999/xhtml" style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    height: 100%; 
                    color: ${textColor}; 
                    font-family: sans-serif; 
                    font-weight: bold; 
                    font-size: 18px; 
                    text-align: center;">
                    ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                </div>
            </foreignObject>
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
/**
 * Helper to wrap text into lines based on a max width character count.
 */
function wrapText(text, maxCharsPerLine) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
        if (currentLine.length + 1 + words[i].length <= maxCharsPerLine) {
            currentLine += ' ' + words[i];
        }
        else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    return lines;
}
/**
 * Adds a modern, compact badge annotation.
 */
export async function addBadge(inputPath, outputPath, text, options = {}) {
    const { targetX = 100, targetY = 100, badgeX = 150, badgeY = 50, color = '#2563EB', // Default beautiful blue
    textColor = 'white', opacity = 0.9 } = options;
    const inputBuffer = await fs.readFile(inputPath);
    const image = sharp(inputBuffer);
    const meta = await image.metadata();
    const fontSize = 14;
    const lineHeight = 1.2;
    const paddingX = 16;
    const paddingY = 8;
    const maxChars = 20; // Wrap after ~20 chars
    const lines = wrapText(text, maxChars);
    // Calculate dimensions
    // Width is roughly max line length * char width (approx 0.6em)
    const maxLineLength = Math.max(...lines.map(l => l.length));
    const width = Math.max(80, (maxLineLength * fontSize * 0.6) + (paddingX * 2));
    const height = (lines.length * fontSize * lineHeight) + (paddingY * 2);
    // Badge top-left corner (derived from center)
    const startX = badgeX - (width / 2);
    const startY = badgeY - (height / 2);
    // Text Tspan Generation
    // We start text at center (x=badgeX) and top vertical offset (y=startY + padding + fontAscent)
    const tspans = lines.map((line, i) => {
        const dy = i === 0 ? 0 : `${lineHeight}em`;
        return `<tspan x="${badgeX}" dy="${dy}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</tspan>`;
    }).join('');
    const svgBadge = `
    <svg width="${meta.width}" height="${meta.height}">
        <defs>
            <filter id="badge-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
            </filter>
        </defs>
        <g opacity="${opacity}">
            <!-- Connector Line -->
            <!-- White stroke for contrast, colored stroke inner -->
            <line x1="${targetX}" y1="${targetY}" x2="${badgeX}" y2="${badgeY}" stroke="white" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
            <line x1="${targetX}" y1="${targetY}" x2="${badgeX}" y2="${badgeY}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
            
            <!-- Badge Pill -->
            <g filter="url(#badge-shadow)">
                <rect x="${startX}" y="${startY}" width="${width}" height="${height}" rx="${height / 2}" ry="${height / 2}" fill="${color}" stroke="white" stroke-width="1.5" />
            </g>
            
            <!-- Text -->
            <text x="${badgeX}" y="${startY + paddingY + (fontSize / 2) + 2}" 
                  fill="${textColor}" 
                  font-family="system-ui, -apple-system, sans-serif" 
                  font-size="${fontSize}px" 
                  font-weight="600" 
                  text-anchor="middle" 
                  dominant-baseline="central">
                ${tspans}
            </text>
        </g>
    </svg>
    `;
    await image
        .composite([{
            input: Buffer.from(svgBadge),
            left: 0,
            top: 0
        }])
        .toFile(outputPath);
    console.log(`[Vision] Badge added to ${outputPath}`);
}
