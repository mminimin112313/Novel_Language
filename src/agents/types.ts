import type { CompilerDiagnostic } from "../shared/types.js";

export type ArchitectDraftRequest = {
  direction: string;
  apiKey?: string;
  model?: string;
};

export type ArchitectRepairRequest = {
  direction: string;
  previousCode: string;
  diagnostics: CompilerDiagnostic[];
  apiKey?: string;
  model?: string;
};

export type ArchitectOutput = {
  dsl: string;
  notes: string[];
  model: string;
  provider: "gemini" | "mock";
};

export type NovelistRequest = {
  direction: string;
  style: string;
  logText: string;
  apiKey?: string;
  model?: string;
};

export type NovelistOutput = {
  text: string;
  model: string;
  provider: "gemini" | "mock";
};
