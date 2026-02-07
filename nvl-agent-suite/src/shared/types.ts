export type Personality = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export type EmotionState = {
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
};

export type Relationship = {
  affinity: number;
  trust: number;
  romance: boolean;
};

export type MemoryFragment = {
  eventId: string;
  role: string;
  distortion: number;
  tags: string[];
};

export type ActorState = {
  name: string;
  alive: boolean;
  location: string;
  hp: number;
  components: Set<string>;
  inventory: Set<string>;
  knowledge: Set<string>;
  personality: Personality;
  emotions: EmotionState;
  memory: MemoryFragment[];
  goals: {
    main?: string;
    sub?: string;
  };
};

export type ClueState = {
  id: string;
  target: string;
  due: string;
  state: "Active" | "Resolved";
  reason?: string;
};

export type SceneState = {
  id: string;
  worldTime: string;
  narrative: number;
  mode: "normal" | "flashback";
};

export type ItemTransfer = {
  item: string;
  from: string;
  to: string;
  line: number;
  scene?: SceneState;
};

export type KnowledgeEvent = {
  actor: string;
  fact: string;
  kind: "KNOWS" | "LEARN" | "HEAR";
  line: number;
  sourceActor?: string;
  scene?: SceneState;
};

export type WorldState = {
  actors: Map<string, ActorState>;
  relations: Map<string, Relationship>;
  clues: Map<string, ClueState>;
  currentScene?: SceneState;
  scenes: SceneState[];
  itemTransfers: ItemTransfer[];
  knowledgeEvents: KnowledgeEvent[];
};

export type CompilerDiagnostic = {
  level: "error" | "warning";
  line: number;
  code: string;
  message: string;
};

export type EventLog = {
  line: number;
  statement: string;
  summary: string;
  checks: string[];
  scene?: SceneState;
  before?: string;
  after?: string;
};

export type CompilationResult = {
  success: boolean;
  diagnostics: CompilerDiagnostic[];
  events: EventLog[];
  logText: string;
  state: WorldState;
  normalizedSource: string;
};
