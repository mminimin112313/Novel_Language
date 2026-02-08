import fs from 'fs/promises';
import path from 'path';
import os from 'os';
const HOMUNCULUS_DIR = path.join(os.homedir(), '.claude/homunculus');
const OBSERVATIONS_PATH = path.join(HOMUNCULUS_DIR, 'observations.jsonl');
const HISTORY_PATH = path.resolve('./data/learning_history.jsonl');
export async function syncObservations() {
    try {
        await fs.mkdir(path.dirname(HISTORY_PATH), { recursive: true });
        let rawData = '';
        try {
            rawData = await fs.readFile(OBSERVATIONS_PATH, 'utf8');
        }
        catch (e) {
            console.warn('No observations found yet.');
            return;
        }
        const lines = rawData.split('\n').filter(l => l.trim());
        const history = [];
        for (const line of lines) {
            try {
                const obs = JSON.parse(line);
                if (obs.event === 'tool_complete') {
                    // Simple Heuristic for Success/Failure
                    let outcome = 'success';
                    if (obs.output && (obs.output.includes('Error:') ||
                        obs.output.includes('Command failed') ||
                        obs.output.includes('"success":false'))) {
                        outcome = 'failure';
                    }
                    history.push({
                        tool: obs.tool,
                        outcome,
                        timestamp: obs.timestamp
                    });
                }
            }
            catch (e) {
                continue;
            }
        }
        // Overwrite history file (in a real DB we would append/upsert)
        await fs.writeFile(HISTORY_PATH, history.map(h => JSON.stringify(h)).join('\n'));
        console.log(`✅ Synced ${history.length} execution records.`);
    }
    catch (e) {
        console.error('Failed to sync observations:', e);
    }
}
export async function getSkillStats(toolName) {
    try {
        const data = await fs.readFile(HISTORY_PATH, 'utf8');
        const lines = data.split('\n').filter(l => l.trim());
        const entries = lines.map(l => JSON.parse(l));
        const relevant = entries.filter(e => e.tool === toolName);
        if (relevant.length === 0)
            return { successRate: 0.5, count: 0 }; // Neutral start
        const successes = relevant.filter(e => e.outcome === 'success').length;
        return {
            successRate: successes / relevant.length,
            count: relevant.length
        };
    }
    catch (e) {
        return { successRate: 0.5, count: 0 };
    }
}
