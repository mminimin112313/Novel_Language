
const fs = require('fs');
const path = require('path');

const resultPath = '/Users/gimminseog/Projects/everything antigravity/.agent/skills/capabilities/browsing/last_result.json';
const outputPath = path.join(process.cwd(), 'naver_blog', 'index.html');

try {
    const data = fs.readFileSync(resultPath, 'utf8');
    const json = JSON.parse(data);

    // content is a stringified array of result objects
    const contentArray = JSON.parse(json.content);

    // Find the item with content (the snapshot step)
    const snapshotItem = contentArray.find(item => item.content && item.url.includes('blog.naver.com'));

    if (snapshotItem) {
        fs.writeFileSync(outputPath, snapshotItem.content);
        console.log('HTML extracted to', outputPath);
    } else {
        console.error('No snapshot content found in result');
    }
} catch (e) {
    console.error('Error extracting HTML:', e);
}
