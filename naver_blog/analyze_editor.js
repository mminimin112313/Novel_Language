
const fs = require('fs');
const path = require('path');
// const cheerio = require('cheerio'); // Removed as not available

// Since we might not have cheerio installed in the root, let's use the regex approach again for robustness
// or check if node_modules has it. For now, simple regex is safer for this environment.

const htmlPath = path.join(__dirname, 'editor_iframe.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('--- Editor Component Analysis ---');

// 1. Title Area
// SE One usually has a class like 'se-title-text' or 'se-documentTitle'
const titlePatterns = [/se-documentTitle/, /se-title-text/, /subject/];
titlePatterns.forEach(p => {
    const match = html.match(p);
    console.log(`Title Pattern ${p}: ${match ? 'FOUND' : 'Not Found'}`);
});

// 2. Content Area
// Usually 'se-main-container', 'se-content', 'se-text-paragraph'
const contentPatterns = [/se-main-container/, /se-content/, /se-text-paragraph/];
contentPatterns.forEach(p => {
    const match = html.match(p);
    console.log(`Content Pattern ${p}: ${match ? 'FOUND' : 'Not Found'}`);
});

// 3. Publish Button
// Usually 'publish_btn', 'btn_publish', 'btn_upload'
const btnPatterns = [/publish/, /btn_publish/, /upload/];
btnPatterns.forEach(p => {
    const match = html.match(p);
    console.log(`Button Pattern ${p}: ${match ? 'FOUND' : 'Not Found'}`);
});

// 4. Toolbar Elements
// 'se-toolbar', 'se-bolt', 'se-italic'
const toolbarPatterns = [/se-toolbar/, /se-bolt/, /se-italic/];
toolbarPatterns.forEach(p => {
    const match = html.match(p);
    console.log(`Toolbar Pattern ${p}: ${match ? 'FOUND' : 'Not Found'}`);
});

// Extract classes starting with 'se-' to find Smart Editor specific classes
const seClassRegex = /class=["']([^"']*se-[^"']*)["']/g;
const seClasses = {};
let match;
while ((match = seClassRegex.exec(html)) !== null) {
    const cls = match[1];
    cls.split(/\s+/).forEach(c => {
        if (c.startsWith('se-')) {
            seClasses[c] = (seClasses[c] || 0) + 1;
        }
    });
}

console.log('\n--- Top Smart Editor Classes ---');
Object.entries(seClasses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([cls, count]) => console.log(`${cls}: ${count}`));
