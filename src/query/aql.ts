import type { CompilationResult, KnowledgeEvent, SceneState, WorldState } from "../shared/types.js";

type SelectQuery = {
  type: "select";
  columns: string[];
  table: string;
  where: Array<{ field: string; op: "="; value: string | number | boolean }>;
  limit?: number;
};

type TraceOwnershipQuery = {
  type: "trace_ownership";
  item: string;
};

type AqlQuery = SelectQuery | TraceOwnershipQuery;

export function runAql(compilation: CompilationResult, rawQuery: string): string {
  const query = parseAql(rawQuery);
  switch (query.type) {
    case "trace_ownership":
      return traceOwnership(compilation.state, query.item);
    case "select":
      return runSelect(compilation, query);
  }
}

function parseAql(raw: string): AqlQuery {
  const q = raw.trim().replace(/;+\s*$/, "");
  if (!q) {
    throw new Error("AQL query is empty.");
  }

  const trace = q.match(/^TRACE\s+OWNERSHIP\s+OF\s+(.+)$/i);
  if (trace) {
    const item = parseStringValue(trace[1]?.trim() ?? "");
    if (!item) throw new Error("TRACE OWNERSHIP requires an item string.");
    return { type: "trace_ownership", item };
  }

  const select = q.match(
    /^SELECT\s+(.+?)\s+FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+WHERE\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i
  );
  if (!select) {
    throw new Error(`Unsupported AQL query. Got: ${raw}`);
  }

  const columns = select[1]
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const table = select[2]?.trim() ?? "";
  const whereRaw = select[3]?.trim();
  const limitRaw = select[4]?.trim();

  const where = whereRaw ? parseWhere(whereRaw) : [];
  const limit = limitRaw ? Number(limitRaw) : undefined;

  return {
    type: "select",
    columns: columns.length > 0 ? columns : ["*"],
    table,
    where,
    limit: Number.isFinite(limit) ? limit : undefined
  };
}

function parseWhere(raw: string): SelectQuery["where"] {
  const parts = raw.split(/\s+AND\s+/i).map((p) => p.trim()).filter(Boolean);
  return parts.map((part) => {
    const match = part.match(/^([a-zA-Z_][a-zA-Z0-9_.]*)\s*(=)\s*(.+)$/);
    if (!match) {
      throw new Error(`Unsupported WHERE clause: ${part}`);
    }
    const field = match[1]?.trim() ?? "";
    const op = match[2] as "=";
    const value = parseScalarValue(match[3]?.trim() ?? "");
    return { field, op, value };
  });
}

function parseScalarValue(raw: string): string | number | boolean {
  const lowered = raw.toLowerCase();
  if (lowered === "true") return true;
  if (lowered === "false") return false;

  const numeric = Number(raw);
  if (!Number.isNaN(numeric) && /^-?\d+(\.\d+)?$/.test(raw)) {
    return numeric;
  }

  const str = parseStringValue(raw);
  if (!str) {
    throw new Error(`Invalid scalar value: ${raw}`);
  }
  return str;
}

function parseStringValue(raw: string): string {
  const trimmed = raw.trim();
  const m = trimmed.match(/^['"](.+?)['"]$/);
  if (m) return m[1] ?? "";
  return trimmed;
}

function runSelect(compilation: CompilationResult, q: SelectQuery): string {
  const table = q.table.toLowerCase();

  if (table === "actors") {
    return selectActors(compilation.state, q);
  }
  if (table === "knowledge") {
    return selectKnowledge(compilation.state, q);
  }
  if (table === "itemtransfers") {
    return selectItemTransfers(compilation.state, q);
  }
  if (table === "clues") {
    return selectClues(compilation.state, q);
  }
  if (table === "scenes") {
    return selectScenes(compilation.state, q);
  }

  throw new Error(`Unknown table '${q.table}'. Supported: Actors, Knowledge, ItemTransfers, Clues, Scenes`);
}

function selectActors(world: WorldState, q: SelectQuery): string {
  const rows = [...world.actors.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((actor) => matchesWhere(q.where, (field) => actorField(actor, field)));

  return formatTable(
    q.columns,
    maybeLimit(rows, q.limit).map((actor) => ({
      name: actor.name,
      alive: actor.alive,
      status: actor.alive ? "Alive" : "Dead",
      location: actor.location,
      hp: actor.hp
    }))
  );
}

function actorField(
  actor: { name: string; alive: boolean; location: string; hp: number },
  field: string
): string | number | boolean | undefined {
  const f = field.toLowerCase();
  if (f === "name") return actor.name;
  if (f === "alive") return actor.alive;
  if (f === "status") return actor.alive ? "Alive" : "Dead";
  if (f === "location") return actor.location;
  if (f === "hp") return actor.hp;
  return undefined;
}

function selectKnowledge(world: WorldState, q: SelectQuery): string {
  const rows = world.knowledgeEvents
    .slice()
    .sort((a, b) => a.line - b.line)
    .filter((evt) => matchesWhere(q.where, (field) => knowledgeField(evt, field)));

  return formatTable(
    q.columns,
    maybeLimit(rows, q.limit).map((evt) => ({
      actor: evt.actor,
      fact: evt.fact,
      kind: evt.kind,
      sourceActor: evt.sourceActor ?? "",
      line: evt.line,
      sceneId: evt.scene?.id ?? "",
      worldTime: evt.scene?.worldTime ?? "",
      narrative: evt.scene?.narrative ?? ""
    }))
  );
}

function knowledgeField(evt: KnowledgeEvent, field: string): string | number | boolean | undefined {
  const f = field.toLowerCase();
  if (f === "actor") return evt.actor;
  if (f === "fact") return evt.fact;
  if (f === "kind") return evt.kind;
  if (f === "line") return evt.line;
  if (f === "sceneid" || f === "scene.id") return evt.scene?.id;
  if (f === "worldtime" || f === "scene.worldtime") return evt.scene?.worldTime;
  return undefined;
}

function selectItemTransfers(world: WorldState, q: SelectQuery): string {
  const rows = world.itemTransfers
    .slice()
    .sort((a, b) => a.line - b.line)
    .filter((evt) => matchesWhere(q.where, (field) => itemTransferField(evt, field)));

  return formatTable(
    q.columns,
    maybeLimit(rows, q.limit).map((evt) => ({
      item: evt.item,
      from: evt.from,
      to: evt.to,
      line: evt.line,
      sceneId: evt.scene?.id ?? "",
      worldTime: evt.scene?.worldTime ?? "",
      narrative: evt.scene?.narrative ?? ""
    }))
  );
}

function itemTransferField(
  evt: { item: string; from: string; to: string; line: number; scene?: SceneState },
  field: string
): string | number | boolean | undefined {
  const f = field.toLowerCase();
  if (f === "item") return evt.item;
  if (f === "from") return evt.from;
  if (f === "to") return evt.to;
  if (f === "line") return evt.line;
  if (f === "sceneid" || f === "scene.id") return evt.scene?.id;
  if (f === "worldtime" || f === "scene.worldtime") return evt.scene?.worldTime;
  return undefined;
}

function selectClues(world: WorldState, q: SelectQuery): string {
  const rows = [...world.clues.values()]
    .sort((a, b) => a.id.localeCompare(b.id))
    .filter((clue) => matchesWhere(q.where, (field) => clueField(clue, field)));

  return formatTable(
    q.columns,
    maybeLimit(rows, q.limit).map((clue) => ({
      id: clue.id,
      target: clue.target,
      due: clue.due,
      state: clue.state,
      reason: clue.reason ?? ""
    }))
  );
}

function clueField(
  clue: { id: string; target: string; due: string; state: string; reason?: string },
  field: string
): string | number | boolean | undefined {
  const f = field.toLowerCase();
  if (f === "id") return clue.id;
  if (f === "target") return clue.target;
  if (f === "due") return clue.due;
  if (f === "state") return clue.state;
  return undefined;
}

function selectScenes(world: WorldState, q: SelectQuery): string {
  const rows = world.scenes
    .slice()
    .sort((a, b) => a.narrative - b.narrative)
    .filter((scene) => matchesWhere(q.where, (field) => sceneField(scene, field)));

  return formatTable(
    q.columns,
    maybeLimit(rows, q.limit).map((scene) => ({
      id: scene.id,
      worldTime: scene.worldTime,
      narrative: scene.narrative,
      mode: scene.mode
    }))
  );
}

function sceneField(scene: SceneState, field: string): string | number | boolean | undefined {
  const f = field.toLowerCase();
  if (f === "id") return scene.id;
  if (f === "worldtime") return scene.worldTime;
  if (f === "narrative") return scene.narrative;
  if (f === "mode") return scene.mode;
  return undefined;
}

function traceOwnership(world: WorldState, item: string): string {
  const transfers = world.itemTransfers.filter((t) => t.item === item).sort((a, b) => a.line - b.line);
  const owners = [...world.actors.values()].filter((a) => a.inventory.has(item)).map((a) => a.name);

  const lines: string[] = [];
  lines.push(`TRACE OWNERSHIP: ${item}`);
  lines.push("");

  if (transfers.length === 0) {
    lines.push("No recorded transfers.");
  } else {
    for (const [idx, t] of transfers.entries()) {
      const ctx = t.scene ? ` scene=${t.scene.id} worldTime=${t.scene.worldTime}` : "";
      lines.push(`[${String(idx + 1).padStart(2, "0")}] line=${t.line}${ctx} :: ${t.from} -> ${t.to}`);
    }
  }

  lines.push("");
  if (owners.length === 0) {
    lines.push("Current owner: (none)");
  } else if (owners.length === 1) {
    lines.push(`Current owner: ${owners[0]}`);
  } else {
    lines.push(`Current owner: (multiple) ${owners.join(", ")}`);
  }

  return lines.join("\n");
}

function matchesWhere(
  where: SelectQuery["where"],
  getField: (field: string) => string | number | boolean | undefined
): boolean {
  for (const cond of where) {
    const actual = getField(cond.field);
    if (actual === undefined) return false;
    if (cond.op !== "=") return false;

    if (typeof cond.value === "string") {
      if (String(actual) !== cond.value) return false;
    } else if (typeof cond.value === "number") {
      if (Number(actual) !== cond.value) return false;
    } else if (typeof cond.value === "boolean") {
      if (Boolean(actual) !== cond.value) return false;
    } else {
      return false;
    }
  }
  return true;
}

function maybeLimit<T>(rows: T[], limit: number | undefined): T[] {
  if (!limit || !Number.isFinite(limit) || limit <= 0) return rows;
  return rows.slice(0, limit);
}

function formatTable(columns: string[], rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) {
    return "No results.";
  }

  const cols = columns.length === 1 && columns[0] === "*" ? Object.keys(rows[0] ?? {}) : columns;
  const header = cols.join("\t");
  const lines = rows.map((row) => cols.map((c) => formatCell(row[c])).join("\t"));
  return [header, ...lines].join("\n");
}

function formatCell(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value);
}

