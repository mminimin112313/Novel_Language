declare module "@modelcontextprotocol/sdk/server/mcp.js" {
  export class McpServer {
    constructor(serverInfo: { name: string; version: string }, options?: unknown);
    registerTool(
      name: string,
      config: {
        title?: string;
        description?: string;
        inputSchema?: unknown;
      },
      cb: (args: any) => Promise<{ content: Array<{ type: string; text: string }> }> | { content: Array<{ type: string; text: string }> }
    ): void;
    connect(transport: unknown): Promise<void>;
  }
}

declare module "@modelcontextprotocol/sdk/server/stdio.js" {
  export class StdioServerTransport {
    constructor();
  }
}
