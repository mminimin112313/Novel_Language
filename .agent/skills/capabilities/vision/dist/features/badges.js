import sharp from 'sharp';
import fs from 'fs/promises';
// Helper: Wrap text
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
export async function addBadge(inputPath, outputPath, text, options) {
    const { target, center, offset = { x: 50, y: -50 }, color = '#2563EB', textColor = 'white', opacity = 0.9, fontSize = 14, // Configurable!
    paddingScale = 1.0 } = options;
    // Calculate Badge Center if not provided
    const badgeX = center ? center.x : target.x + offset.x;
    const badgeY = center ? center.y : target.y + offset.y;
    const inputBuffer = await fs.readFile(inputPath);
    const image = sharp(inputBuffer);
    const meta = await image.metadata();
    // Sizing Logic
    const lineHeight = 1.2;
    const paddingX = 16 * paddingScale;
    const paddingY = 8 * paddingScale;
    // Adjust wrapping based on font size (smaller font = more chars fit in same space, 
    // but usually we want proportional resizing. Let's keep char count logic simple for now).
    const maxChars = 20;
    const lines = wrapText(text, maxChars);
    const maxLineLength = Math.max(...lines.map(l => l.length));
    // Approx char width ~ 0.6em
    const width = Math.max(80, (maxLineLength * fontSize * 0.6) + (paddingX * 2));
    const height = (lines.length * fontSize * lineHeight) + (paddingY * 2);
    const startX = badgeX - (width / 2);
    const startY = badgeY - (height / 2);
    const tspans = lines.map((line, i) => {
        const dy = i === 0 ? 0 : `${lineHeight}em`;
        return `<tspan x="${badgeX}" dy="${dy}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</tspan>`;
    }).join('');
    const svgBadge = `
    <svg width="${meta.width}" height="${meta.height}">
        <defs>
            <filter id="badge-shadow-custom-${Date.now()}" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
            </filter>
        </defs>
        <g opacity="${opacity}">
            <!-- Connector -->
            <line x1="${target.x}" y1="${target.y}" x2="${badgeX}" y2="${badgeY}" stroke="white" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
            <line x1="${target.x}" y1="${target.y}" x2="${badgeX}" y2="${badgeY}" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
            
            <!-- Badge Body -->
            <g filter="url(#badge-shadow-custom-${Date.now()})">
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
