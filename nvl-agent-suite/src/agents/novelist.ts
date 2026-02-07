import { DEFAULT_MODELS } from "../config.js";
import { GeminiClient } from "./gemini.js";
import { mockNovelist } from "./mock.js";
import { novelistPrompt } from "./prompts.js";
import type { NovelistOutput, NovelistRequest } from "./types.js";

export async function writeNovel(req: NovelistRequest): Promise<NovelistOutput> {
  const model = req.model ?? DEFAULT_MODELS.novelist;
  const client = new GeminiClient({ apiKey: req.apiKey, model });

  if (!client.ready) {
    return mockNovelist(req.logText);
  }

  try {
    const text = await client.generateText({
      prompt: novelistPrompt(req.direction, req.style, req.logText),
      temperature: 0.7
    });

    if (!text) {
      return mockNovelist(req.logText);
    }

    return {
      text,
      model,
      provider: "gemini"
    };
  } catch {
    return mockNovelist(req.logText);
  }
}
