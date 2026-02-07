import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  toolAqlQuery,
  toolCompileNVL,
  toolEpisodePack,
  toolManuscriptLint,
  toolReadRunFile,
  toolRunPipeline,
  toolWriteNovel
} from "./tools.js";

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
  "nvl_aql",
  {
    title: "Query NVL (AQL)",
    description: "Run AQL query over compiled NVL state/events for plot search and consistency investigation.",
    inputSchema: {
      source: z.string().min(1),
      query: z.string().min(1)
    }
  },
  async ({ source, query }: { source: string; query: string }) => {
    const result = await toolAqlQuery({ source, query });
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
      maxAttempts: z.number().int().min(1).max(12).optional()
    }
  },
  async ({
    direction,
    style,
    maxAttempts
  }: {
    direction: string;
    style?: string;
    maxAttempts?: number;
  }) => {
    const result = await toolRunPipeline({
      direction,
      style,
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
  "nvl_episode_pack",
  {
    title: "Build Episode Pack",
    description: "Compile NVL and build an episode context pack from an EpisodeSpec (selection + writing requirements).",
    inputSchema: {
      source: z.string().min(1),
      spec: z.unknown()
    }
  },
  async ({ source, spec }: { source: string; spec: unknown }) => {
    const result = await toolEpisodePack({ source, spec });
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
  "nvl_manuscript_lint",
  {
    title: "Lint Manuscript",
    description: "Deterministic lint over manuscript text using EpisodePack constraints (citations/length/motifs/banned phrases).",
    inputSchema: {
      episodePack: z.unknown(),
      manuscript: z.string().min(1)
    }
  },
  async ({ episodePack, manuscript }: { episodePack: unknown; manuscript: string }) => {
    const result = await toolManuscriptLint({ episodePack, manuscript });
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

server.registerTool(
  "nvl_write_novel",
  {
    title: "Write Novel",
    description: "Run planner + chapter pipeline workflow and write manuscript artifacts.",
    inputSchema: {
      concept: z.string().min(1),
      title: z.string().optional(),
      projectId: z.string().optional(),
      chapters: z.number().int().min(1).max(24).optional(),
      style: z.string().optional()
    }
  },
  async ({
    concept,
    title,
    projectId,
    chapters,
    style
  }: {
    concept: string;
    title?: string;
    projectId?: string;
    chapters?: number;
    style?: string;
  }) => {
    const result = await toolWriteNovel({
      concept,
      title,
      projectId,
      chapters,
      style
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
