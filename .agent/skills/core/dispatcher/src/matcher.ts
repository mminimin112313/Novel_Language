
import fs from 'fs/promises';
import path from 'path';
import Fuse from 'fuse.js';
import { syncObservations, getSkillStats } from './history.js';

const REGISTRY_PATH = path.resolve('./data/registry.json');

async function matchSkill(query: string) {
    console.log(`🧠 Dispatcher analyzing: "${query}"`);

    // 1. Sync latest observations
    await syncObservations();

    // Load Registry
    const registryData = await fs.readFile(REGISTRY_PATH, 'utf8');
    const skills = JSON.parse(registryData);

    // Initial Heuristics (Rule-based)
    if (query.includes('browser') || query.includes('click') || query.includes('navigat')) {
        // Boost browsing related skills
    }

    // Fuzzy Search Configuration
    const options = {
        includeScore: true,
        threshold: 0.6, // Relaxed to default
        keys: [
            { name: 'name', weight: 0.5 },
            { name: 'description', weight: 0.4 },
            { name: 'category', weight: 0.1 }
        ]
    };

    const fuse = new Fuse(skills, options);
    const result = fuse.search(query);

    // Display Results
    console.log('\n--- 🎯 Top Recommendations ---');

    for (const res of result.slice(0, 3)) {
        const item: any = res.item; // Cast to any to avoid TS issues for now
        const stats = await getSkillStats(item.name);

        // Boost score based on success rate (Simple Linear Interpolation)
        // Fuse score: 0 is best, 1 is worst.
        // We want to DECREASE score (improve rank) if success rate is high.
        let adjustedScore = (res.score || 0.5);
        if (stats.count > 0) {
            const successModifier = (stats.successRate - 0.5) * 0.2; // +/- 0.1 boost
            adjustedScore -= successModifier;
        }

        console.log(`\n${item.name} (Confidence: ${((1 - adjustedScore) * 100).toFixed(1)}%)`);
        console.log(`   📝 ${item.description.substring(0, 80)}...`);
        console.log(`   📈 Stats: ${stats.count} runs, ${(stats.successRate * 100).toFixed(0)}% success`);
        console.log(`   📍 file:///${item.path}`);
    }

    if (result.length === 0) {
        console.log('No specific skill found.');
    }
}

// CLI usage
const query = process.argv.slice(2).join(' ');
if (query) {
    matchSkill(query).catch(console.error);
} else {
    console.log('Usage: npm run match "your query here"');
}
