/**
 * MCP Server for Browsing Skill
 * Maintains long-lived session for browser automation
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { BrowsingLib } from "./BrowsingLib.js";
import { Schemas, validate, getJsonSchema } from "./core/ZodSchemas.js";
import { ariaSnapshotService } from "./core/AriaSnapshotService.js";

export class BrowsingMcpServer {
    private server: Server;

    constructor(private browsingLib: BrowsingLib) {
        this.server = new Server(
            {
                name: "antigravity-browsing",
                version: "0.1.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupHandlers();
    }

    private setupHandlers() {
        // List available tools based on our Schemas and CommandRegistry
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const tools = Object.keys(Schemas).map((name) => {
                const schema = getJsonSchema(name as keyof typeof Schemas);
                return {
                    name,
                    description: (schema as any).description || `Execute ${name} command`,
                    inputSchema: schema,
                };
            });

            return { tools };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const name = request.params.name as keyof typeof Schemas;
            const args = request.params.arguments;

            try {
                // 1. Validate input using Zod
                const validatedArgs = validate(name, args);

                // 2. Map to BrowsingLib/Registry execution
                // For now, we reuse the registry pattern via BrowsingLib's services
                // Or directly call BrowsingLib methods if available

                let result: any;
                const services = this.browsingLib.getServices();
                const page = await services.browser.getPage();

                // Special handling for some commands, others go to registry
                // To keep it simple, we'll use a dispatcher-like logic here

                // For demonstration, let's implement a few core ones directly
                // and fallback to registry if needed in future iterations

                switch (name) {
                    case 'open':
                    case 'navigate':
                        result = await this.browsingLib.open((validatedArgs as any).url);
                        break;
                    case 'click':
                        result = await this.browsingLib.click((validatedArgs as any).selector);
                        break;
                    case 'type':
                    case 'fill':
                        result = await this.browsingLib.type((validatedArgs as any).selector, (validatedArgs as any).text);
                        break;
                    case 'aria-snapshot':
                    case 'snapshot':
                        const snap = await ariaSnapshotService.capture(page);
                        result = { ok: true, snapshot: snap };
                        break;
                    default:
                        // Fallback to registry-like execution if possible
                        // Since this is a server, we can maintain CommandContext
                        result = { ok: false, error: `Tool ${name} not yet directly implemented in server mode` };
                }

                if (result.ok) {
                    // Capture ARIA snapshot after every successful action for agent feedback
                    const postActionSnap = await ariaSnapshotService.capture(page);
                    const formattedSnap = ariaSnapshotService.formatAsMarkdown(postActionSnap);

                    return {
                        content: [
                            {
                                type: "text",
                                text: `Action ${name} completed successfully.\n${formattedSnap}`,
                            },
                        ],
                    };
                } else {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error executing ${name}: ${result.error}`,
                            },
                        ],
                        isError: true,
                    };
                }
            } catch (error: any) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Validation or Execution Error: ${error.message}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Browsing MCP Server running on stdio");
    }
}
