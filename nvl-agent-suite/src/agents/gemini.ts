import { GoogleGenAI } from "@google/genai";

export type GeminiClientOptions = {
  apiKey?: string;
  model: string;
};

export type JsonRequest = {
  prompt: string;
  schema: Record<string, unknown>;
  temperature?: number;
};

export type TextRequest = {
  prompt: string;
  temperature?: number;
};

export class GeminiClient {
  private readonly ai?: GoogleGenAI;
  private readonly model: string;

  constructor(options: GeminiClientOptions) {
    this.model = options.model;
    if (options.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: options.apiKey });
    }
  }

  get ready(): boolean {
    return Boolean(this.ai);
  }

  async generateJson<T>(req: JsonRequest): Promise<T> {
    if (!this.ai) {
      throw new Error("Gemini API key is required for live generation.");
    }

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: req.prompt,
      config: {
        temperature: req.temperature ?? 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: req.schema
      }
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Gemini returned empty JSON response.");
    }

    return parseJsonWithFallback<T>(text);
  }

  async generateText(req: TextRequest): Promise<string> {
    if (!this.ai) {
      throw new Error("Gemini API key is required for live generation.");
    }

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: req.prompt,
      config: {
        temperature: req.temperature ?? 0.7
      }
    });

    return response.text?.trim() ?? "";
  }
}

function parseJsonWithFallback<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Failed to parse JSON response from Gemini.");
    }
    return JSON.parse(text.slice(start, end + 1)) as T;
  }
}
