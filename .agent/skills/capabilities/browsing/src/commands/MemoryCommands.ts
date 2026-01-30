
import { CommandContext } from '../core/CommandRegistry.js';
import { MemorySubskill } from '../subskills/memory/MemorySkill.js';

const memory = new MemorySubskill();

export const MemoryCommands = {
    'memory-record': async (ctx: CommandContext) => {
        // args: content, tags?, title?
        const content = ctx.args[0];
        const tags = ctx.args[1] ? ctx.args[1].split(',') : [];
        const title = ctx.args[2];
        const result = await memory.record(content, tags, title);
        return { ok: true, result };
    },
    'memory-update': async (ctx: CommandContext) => {
        // args: id, content?, tags?, title?
        const id = ctx.args[0];
        const content = ctx.args[1];
        const tags = ctx.args[2] ? ctx.args[2].split(',') : undefined;
        const title = ctx.args[3];

        const result = await memory.update(id, content, tags, title);
        return { ok: true, result };
    },
    'memory-search': async (ctx: CommandContext) => {
        // args: query, tag?
        const query = ctx.args[0] || "";
        const tag = ctx.args[1];
        const results = await memory.search(query, tag);
        return { ok: true, results };
    },
    'memory-connect': async (ctx: CommandContext) => {
        const result = await memory.connect(ctx.args[0], ctx.args[1], ctx.args[2]);
        return { ok: true, result };
    }
};
