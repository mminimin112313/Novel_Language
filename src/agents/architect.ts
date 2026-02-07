import { DEFAULT_MODELS } from "../config.js";
import type { CompilerDiagnostic } from "../shared/types.js";
import { architectDraftPrompt, architectRepairPrompt } from "./prompts.js";
import { GeminiClient } from "./gemini.js";
import { mockArchitect } from "./mock.js";
import type { ArchitectDraftRequest, ArchitectOutput, ArchitectRepairRequest } from "./types.js";

const responseSchema = {
  type: "object",
  properties: {
    dsl: { type: "string" },
    notes: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["dsl"]
} as const;

export async function generateArchitectDraft(req: ArchitectDraftRequest): Promise<ArchitectOutput> {
  const model = req.model ?? DEFAULT_MODELS.architect;
  const client = new GeminiClient({ apiKey: req.apiKey, model });

  if (!client.ready) {
    return mockArchitect(req.direction);
  }

  try {
    const payload = await client.generateJson<{ dsl: string; notes?: string[] }>({
      prompt: architectDraftPrompt(req.direction),
      schema: responseSchema,
      temperature: 0.2
    });

    return {
      dsl: sanitizeDsl(payload.dsl),
      notes: payload.notes ?? [],
      model,
      provider: "gemini"
    };
  } catch {
    return mockArchitect(req.direction);
  }
}

export async function repairArchitectCode(req: ArchitectRepairRequest): Promise<ArchitectOutput> {
  const model = req.model ?? DEFAULT_MODELS.architect;
  const client = new GeminiClient({ apiKey: req.apiKey, model });

  if (!client.ready) {
    return {
      ...mockArchitect(req.direction),
      dsl: req.previousCode,
      notes: ["mock repair fallback returned previous code"]
    };
  }

  try {
    const diagnostics = formatDiagnostics(req.diagnostics);
    const payload = await client.generateJson<{ dsl: string; notes?: string[] }>({
      prompt: architectRepairPrompt(req.direction, req.previousCode, diagnostics),
      schema: responseSchema,
      temperature: 0.1
    });

    return {
      dsl: sanitizeDsl(payload.dsl),
      notes: payload.notes ?? [],
      model,
      provider: "gemini"
    };
  } catch {
    return {
      dsl: req.previousCode,
      notes: ["repair failed; previous code returned unchanged"],
      model,
      provider: "mock"
    };
  }
}

function sanitizeDsl(source: string): string {
  return source
    .replace(/```(?:\w+)?/g, "")
    .trim();
}

function formatDiagnostics(diagnostics: CompilerDiagnostic[]): string {
  return diagnostics
    .map((diag) => `[${diag.level.toUpperCase()}] line=${diag.line} ${diag.code}: ${diag.message}`)
    .join("\n");
}
