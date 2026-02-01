
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Regex to find tags
const tagRegex = /<\/?([a-z0-9]+)[^>]*>/gi;
const tags = {};
let match;

while ((match = tagRegex.exec(html)) !== null) {
    const tagName = match[1].toLowerCase();
    tags[tagName] = (tags[tagName] || 0) + 1;
}

// Regex to find classes
const classRegex = /class=["']([^"']+)["']/gi;
const classes = {};
while ((match = classRegex.exec(html)) !== null) {
    const classNames = match[1].split(/\s+/);
    classNames.forEach(cls => {
        if (cls) classes[cls] = (classes[cls] || 0) + 1;
    });
}

// Check for specific formatting tags
const formattingTags = ['b', 'strong', 'i', 'em', 'u', 'mark', 'small', 'del', 'ins', 'sub', 'sup'];
const foundFormatting = formattingTags.filter(tag => tags[tag]);

console.log('--- HTML Structure Analysis ---');
console.log(`Total Length: ${html.length} chars`);
console.log(`Unique Tags: ${Object.keys(tags).length}`);
console.log(`Unique Classes: ${Object.keys(classes).length}`);

console.log('\n--- Formatting Tags Found ---');
if (foundFormatting.length > 0) {
    foundFormatting.forEach(tag => {
        console.log(`<${tag}>: ${tags[tag]} occurrences`);
    });
} else {
    console.log('No standard formatting tags (b, i, strong, em) found.');
}

console.log('\n--- Top 10 Common Tags ---');
Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([tag, count]) => console.log(`${tag}: ${count}`));

console.log('\n--- Top 20 Common Classes ---');
Object.entries(classes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([cls, count]) => console.log(`${cls}: ${count}`));

// Extract IDs for potential selectors
const idRegex = /id=["']([^"']+)["']/gi;
const ids = [];
while ((match = idRegex.exec(html)) !== null) {
    ids.push(match[1]);
}
console.log(`\nTotal IDs found: ${ids.length}`);
console.log('Sample IDs:', ids.slice(0, 5).join(', '));
