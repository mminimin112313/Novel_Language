
const fs = require('fs');
const path = require('path');

const resultPath = '/Users/gimminseog/Projects/everything antigravity/.agent/skills/capabilities/browsing/last_result.json';
const outputPath = path.join(__dirname, 'editor.html');

try {
    const data = fs.readFileSync(resultPath, 'utf8');
    const json = JSON.parse(data);
    const contentArray = JSON.parse(json.content);

    // Find item with blog editor content
    // Note: The URL might be blog.editor.naver.com or similar
    const snapshotItem = contentArray.find(item => item.content && (item.url.includes('editor') || item.url.includes('write')));

    if (snapshotItem) {
        fs.writeFileSync(outputPath, snapshotItem.content);
        console.log('Editor HTML extracted to', outputPath);
    } else {
        console.error('No editor content found in result');
        console.log('Available URLs:', contentArray.map(i => i.url));
    }
} catch (e) {
    console.error('Error extracting Editor HTML:', e);
}
