import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { toolCompileNVL, toolReadRunFile, toolRunPipeline } from "./tools.js";

const server = new McpServer({
  name: "nvl-agent-suite-mcp",
  version: "0.1.0"
});

server.registerTool(
  "nvl_compile",
  {
    title: "Compile NVL",
    description: "Compile NVL source and return diagnostics/log text.",
    inputSchema: {
      source: z.string().min(1)
    }
  },
  async ({ source }: { source: string }) => {
    const result = await toolCompileNVL(source);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
);

server.registerTool(
  "nvl_pipeline",
  {
    title: "Run NVL Pipeline",
    description: "Run Architect -> Compiler loop -> Novelist pipeline.",
    inputSchema: {
      direction: z.string().min(1),
      style: z.string().optional(),
      apiKey: z.string().optional(),
      architectModel: z.string().optional(),
      novelistModel: z.string().optional(),
      maxAttempts: z.number().int().min(1).max(12).optional()
    }
  },
  async ({
    direction,
    style,
    apiKey,
    architectModel,
    novelistModel,
    maxAttempts
  }: {
    direction: string;
    style?: string;
    apiKey?: string;
    architectModel?: string;
    novelistModel?: string;
    maxAttempts?: number;
  }) => {
    const result = await toolRunPipeline({
      direction,
      style,
      apiKey,
      architectModel,
      novelistModel,
      maxAttempts
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
);

server.registerTool(
  "nvl_read_run_file",
  {
    title: "Read Run File",
    description: "Read artifacts from .runs/<runId>/<fileName>.",
    inputSchema: {
      runId: z.string().min(1),
      fileName: z.string().min(1)
    }
  },
  async ({ runId, fileName }: { runId: string; fileName: string }) => {
    const result = await toolReadRunFile(runId, fileName);
    return {
      content: [
        {
          type: "text",
          text: result.content
        }
      ]
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("[nvl-agent-suite-mcp] stdio server started\n");
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
