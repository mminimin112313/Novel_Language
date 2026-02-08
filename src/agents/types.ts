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

export interface WorldBible {
  title: string;
  premise: string;
  locations: Record<string, string>;
  factions: Record<string, string>;
  technology: Record<string, string>;
  history: string[];
  keyNPCs: Record<string, string>;
}

export type WorldBuildRequest = {
  genre: string;
  concept: string;
  tone: string;
};

export type WorldBuildOutput = {
  bible: WorldBible;
  model: string;
  provider: "mock";
};
