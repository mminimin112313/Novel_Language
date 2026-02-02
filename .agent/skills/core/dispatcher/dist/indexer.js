import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';
const SKILLS_ROOT = path.resolve('../../../'); // .agent/skills
const OUTPUT_PATH = path.resolve('./data/registry.json');
async function buildIndex() {
    console.log(`🔍 Scanning skills in: ${SKILLS_ROOT}`);
    const files = await glob('**/*/SKILL.md', { cwd: SKILLS_ROOT, absolute: true });
    const registry = [];
    for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const parsed = matter(content);
        let category = 'unknown';
        if (file.includes('/core/'))
            category = 'core';
        if (file.includes('/capabilities/'))
            category = 'capabilities';
        if (file.includes('/workflows/'))
            category = 'workflows';
        if (file.includes('/knowledge/'))
            category = 'knowledge';
        registry.push({
            name: parsed.data.name || path.basename(path.dirname(file)),
            description: parsed.data.description || 'No description provided.',
            path: path.relative(SKILLS_ROOT, file),
            category
        });
    }
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(registry, null, 2));
    console.log(`✅ Indexed ${registry.length} skills. Registry saved to ${OUTPUT_PATH}`);
}
buildIndex().catch(console.error);
