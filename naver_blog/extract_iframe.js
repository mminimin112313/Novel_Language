
const fs = require('fs');
const path = require('path');

const resultPath = '/Users/gimminseog/Projects/everything antigravity/.agent/skills/capabilities/browsing/last_result.json';
const outputPath = path.join(process.cwd(), 'naver_blog', 'editor_iframe.html');

try {
    const data = fs.readFileSync(resultPath, 'utf8');
    const json = JSON.parse(data);
    const contentArray = JSON.parse(json.content);

    // The snapshot-iframe result is the last item
    const snapshotItem = contentArray[contentArray.length - 1];

    if (snapshotItem && snapshotItem.ok && snapshotItem.content) {
        fs.writeFileSync(outputPath, snapshotItem.content);
        console.log('Iframe HTML extracted to', outputPath);
    } else {
        console.error('No iframe content found in result', snapshotItem);
    }
} catch (e) {
    console.error('Error extracting Iframe HTML:', e);
}
