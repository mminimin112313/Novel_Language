import type { CompilationResult, EventLog, KnowledgeEvent, ItemTransfer, SceneState } from "../shared/types.js";
import { compileNVL } from "../compiler/index.js";
import type { EpisodeSpec } from "./spec.js";

export type EpisodeEvent = {
  index: number;
  globalIndex: number;
  line: number;
  statement: string;
  summary: string;
  checks: string[];
  scene?: SceneState;
};

export type EpisodePack = {
  spec: EpisodeSpec;
  compilation: {
    success: boolean;
    diagnostics: CompilationResult["diagnostics"];
    sceneCount: number;
    eventCount: number;
  };
  scenes: SceneState[];
  events: EpisodeEvent[];
  actors: Array<{
    name: string;
    alive: boolean;
    location: string;
    hp: number;
    inventory: string[];
    knowledge: string[];
    goals: { main?: string; sub?: string };
  }>;
  itemTransfers: ItemTransfer[];
  knowledgeEvents: KnowledgeEvent[];
  clues: Array<{
    id: string;
    target: string;
    due: string;
    state: "Active" | "Resolved";
    reason?: string;
  }>;
};

export function buildEpisodePack(nvlSource: string, spec: EpisodeSpec): EpisodePack {
  const compilation = compileNVL(nvlSource);

  const selection = spec.selection;
  const scenesSelected = selectScenes(compilation, selection);
  const sceneIdSet = new Set(scenesSelected.map((s) => s.id));

  const eventsSelected = selectEvents(compilation.events, sceneIdSet);
  const eventCount = compilation.events.length;

  return {
    spec,
    compilation: {
      success: compilation.success,
      diagnostics: compilation.diagnostics,
      sceneCount: compilation.state.scenes.length,
      eventCount
    },
    scenes: scenesSelected,
    events: eventsSelected.map((entry, idx) => ({
      index: idx + 1,
      globalIndex: entry.globalIndex,
      line: entry.event.line,
      statement: entry.event.statement,
      summary: entry.event.summary,
      checks: entry.event.checks,
      scene: entry.event.scene
    })),
    actors: [...compilation.state.actors.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((actor) => ({
        name: actor.name,
        alive: actor.alive,
        location: actor.location,
        hp: actor.hp,
        inventory: [...actor.inventory].sort(),
        knowledge: [...actor.knowledge].sort(),
        goals: actor.goals
      })),
    itemTransfers: compilation.state.itemTransfers.filter((t) => (t.scene ? sceneIdSet.has(t.scene.id) : false)),
    knowledgeEvents: compilation.state.knowledgeEvents.filter((k) => (k.scene ? sceneIdSet.has(k.scene.id) : false)),
    clues: [...compilation.state.clues.values()].map((c) => ({
      id: c.id,
      target: c.target,
      due: c.due,
      state: c.state,
      reason: c.reason
    }))
  };
}

function selectScenes(compilation: CompilationResult, selection: EpisodeSpec["selection"]): SceneState[] {
  const scenes = compilation.state.scenes.slice().sort((a, b) => a.narrative - b.narrative);
  if (!selection) return scenes;

  if (selection.sceneIds && selection.sceneIds.length > 0) {
    const wanted = new Set(selection.sceneIds);
    return scenes.filter((s) => wanted.has(s.id));
  }

  if (selection.narrativeRange) {
    const { from, to } = selection.narrativeRange;
    return scenes.filter((s) => s.narrative >= from && s.narrative <= to);
  }

  return scenes;
}

function selectEvents(events: EventLog[], sceneIdSet: Set<string>): Array<{ event: EventLog; globalIndex: number }> {
  if (sceneIdSet.size === 0) return [];
  const selected: Array<{ event: EventLog; globalIndex: number }> = [];
  for (const [idx, evt] of events.entries()) {
    if (!evt.scene) continue;
    if (!sceneIdSet.has(evt.scene.id)) continue;
    selected.push({ event: evt, globalIndex: idx + 1 });
  }
  return selected;
}
