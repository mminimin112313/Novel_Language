import { Page } from 'playwright-core';
import { BrowserManager } from './BrowserManager.js';
import { InteractionService } from './InteractionService.js';
import { VisualService } from './VisualService.js';

import { DiscoveryService } from './DiscoveryService.js';
import { RefinementService } from './RefinementService.js';
import { VisionService } from './VisionService.js';


export interface CommandContext {
    browser: BrowserManager;
    interaction: InteractionService;
    visual: VisualService;
    discovery: DiscoveryService;
    refinement: RefinementService;
    vision: VisionService;
    paths: {
        dump: string;
        session: string;
        shots: string;
        logs: string;
        reports: string;
    };
    registry: CommandRegistry;
    args: string[];
}



export type CommandHandler = (ctx: CommandContext) => Promise<any>;

export class CommandRegistry {
    private commands: Map<string, CommandHandler> = new Map();

    register(name: string, handler: CommandHandler) {
        this.commands.set(name, handler);
    }

    async execute(name: string, ctx: CommandContext): Promise<any> {
        const handler = this.commands.get(name);
        if (!handler) {
            throw new Error(`Unknown command: ${name}`);
        }
        return await handler(ctx);
    }

    getAvailableCommands(): string[] {
        return Array.from(this.commands.keys());
    }
}
