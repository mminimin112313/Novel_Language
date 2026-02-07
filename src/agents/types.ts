import type { CompilerDiagnostic } from "../shared/types.js";

export type ArchitectDraftRequest = {
  direction: string;
};

export type ArchitectRepairRequest = {
  direction: string;
  previousCode: string;
  diagnostics: CompilerDiagnostic[];
};

export type ArchitectOutput = {
  dsl: string;
  notes: string[];
  model: string;
  provider: "mock";
};

export type NovelistRequest = {
  direction: string;
  style: string;
  logText: string;
};

export type NovelistOutput = {
  text: string;
  model: string;
  provider: "mock";
};

export type NovelPlanChapter = {
  index: number;
  title: string;
  direction: string;
  style: string;
};

export type NovelPlanRequest = {
  concept: string;
  titleHint?: string;
  chapterCount: number;
  baseStyle: string;
};

export type NovelPlanOutput = {
  title: string;
  summary: string;
  chapters: NovelPlanChapter[];
  model: string;
  provider: "mock";
};
