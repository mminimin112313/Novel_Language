
const fs = require('fs');
const path = require('path');

const resultPath = '/Users/gimminseog/Projects/everything antigravity/.agent/skills/capabilities/browsing/last_result.json';
const outputPath = path.join(process.cwd(), 'naver_blog', 'editor_v2.html');

try {
    const data = fs.readFileSync(resultPath, 'utf8');
    const json = JSON.parse(data);
    const contentArray = JSON.parse(json.content);

    // The snapshot command was the 7th command (index 6) or 8th (index 7 if results are 1-1 mapping)
    // Let's find the one with 'content' and 'editor' in URL
    const snapshotItem = contentArray.find(item => item.content && (item.url.includes('editor') || item.url.includes('postwrite') || item.url.includes('naverProfile')));

    if (snapshotItem) {
        fs.writeFileSync(outputPath, snapshotItem.content);
        console.log('Editor HTML extracted to', outputPath, 'URL:', snapshotItem.url);
    } else {
        console.error('No editor content found in result');
        console.log('Available URLs:', contentArray.map(i => i.url));
    }
} catch (e) {
    console.error('Error extracting Editor HTML:', e);
}
