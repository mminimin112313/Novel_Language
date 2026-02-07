import type {
  ActorState,
  CompilationResult,
  CompilerDiagnostic,
  EventLog,
  Relationship,
  SceneState,
  WorldState
} from "../shared/types.js";
import { parseKeyValueArgs, parseScript, normalizeSource } from "./parser.js";
import { ACTION_PERSONALITY_VECTOR, PHYSICAL_ACTIONS } from "./rules.js";
import { cosineSimilarity, personalityToVector } from "./vector.js";

function defaultActor(name: string): ActorState {
  return {
    name,
    alive: true,
    location: "Unknown",
    hp: 100,
    components: new Set(),
    inventory: new Set(),
    knowledge: new Set(),
    personality: {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    },
    emotions: {
      joy: 0,
      trust: 0,
      fear: 0,
      surprise: 0,
      sadness: 0,
      disgust: 0,
      anger: 0,
      anticipation: 0
    },
    memory: [],
    goals: {}
  };
}

function createWorld(): WorldState {
  return {
    actors: new Map(),
    relations: new Map(),
    clues: new Map(),
    scenes: [],
    itemTransfers: [],
    knowledgeEvents: []
  };
}

function relKey(from: string, to: string): string {
  return `${from}->${to}`;
}

function relationOrDefault(world: WorldState, from: string, to: string): Relationship {
  const key = relKey(from, to);
  const existing = world.relations.get(key);
  if (existing) {
    return existing;
  }
  const fallback = { affinity: 0, trust: 0, romance: false };
  world.relations.set(key, fallback);
  return fallback;
}

function pushDiagnostic(
  diagnostics: CompilerDiagnostic[],
  level: "error" | "warning",
  line: number,
  code: string,
  message: string
): void {
  diagnostics.push({ level, line, code, message });
}

function stateDigest(actor: ActorState): string {
  return `alive=${actor.alive} hp=${actor.hp} loc=${actor.location} inv=[${[...actor.inventory].join(",")}]`;
}

function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}

function pushEvent(events: EventLog[], world: WorldState, entry: Omit<EventLog, "scene">): void {
  events.push({ ...entry, scene: world.currentScene });
}

export function compileNVL(source: string): CompilationResult {
  const world = createWorld();
  const diagnostics: CompilerDiagnostic[] = [];
  const events: EventLog[] = [];

  const parsed = parseScript(source);

  for (const stmt of parsed) {
    const checks: string[] = [];
    try {
      switch (stmt.command) {
        case "ACTOR": {
          const name = stmt.args[0];
          if (!name) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_ACTOR_NAME", "ACTOR requires a name.");
            break;
          }
          if (world.actors.has(name)) {
            pushDiagnostic(diagnostics, "warning", stmt.line, "W_ACTOR_DUP", `Actor '${name}' already exists.`);
          } else {
            world.actors.set(name, defaultActor(name));
          }
          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `Actor declared: ${name}`,
            checks
          });
          break;
        }

        case "COMPONENT": {
          const [name, component] = stmt.args;
          const actor = world.actors.get(name);
          if (!actor || !component) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_COMPONENT", "COMPONENT requires existing actor and component name.");
            break;
          }
          actor.components.add(component);
          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `${name} +component ${component}`,
            checks
          });
          break;
        }

        case "SET": {
          const joined = stmt.args.join(" ");
          const eqIndex = joined.indexOf("=");
          if (eqIndex === -1) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_SET_SYNTAX", "SET syntax: SET Actor.path = value");
            break;
          }

          const left = joined.slice(0, eqIndex).trim();
          const right = joined.slice(eqIndex + 1).trim();

          const [name, ...pathParts] = left.split(".");
          const actor = world.actors.get(name);
          if (!actor || pathParts.length === 0) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_SET_TARGET", "SET target actor/path not found.");
            break;
          }

          const path = pathParts.join(".").toLowerCase();
          const before = stateDigest(actor);

          if (path === "location") {
            actor.location = right;
          } else if (path === "hp") {
            const hp = parseNumber(right);
            if (hp === undefined) {
              pushDiagnostic(diagnostics, "error", stmt.line, "E_SET_HP", "HP must be numeric.");
            } else {
              actor.hp = hp;
              actor.alive = hp > 0;
            }
          } else if (path.startsWith("personality.")) {
            const trait = path.replace("personality.", "");
            const numeric = parseNumber(right);
            if (numeric === undefined) {
              pushDiagnostic(diagnostics, "error", stmt.line, "E_SET_PERSONALITY", "Personality value must be numeric.");
            } else {
              if (trait === "o" || trait === "openness") actor.personality.openness = numeric;
              if (trait === "c" || trait === "conscientiousness") actor.personality.conscientiousness = numeric;
              if (trait === "e" || trait === "extraversion") actor.personality.extraversion = numeric;
              if (trait === "a" || trait === "agreeableness") actor.personality.agreeableness = numeric;
              if (trait === "n" || trait === "neuroticism") actor.personality.neuroticism = numeric;
            }
          } else {
            pushDiagnostic(
              diagnostics,
              "warning",
              stmt.line,
              "W_SET_UNKNOWN",
              `Unknown SET path '${path}'. Compiler ignored this assignment.`
            );
          }

          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `Set ${left} = ${right}`,
            checks,
            before,
            after: stateDigest(actor)
          });
          break;
        }

        case "GIVE": {
          const actorName = stmt.args[0];
          const item = stmt.args[1];
          const actor = world.actors.get(actorName);
          if (!actor || !item) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_GIVE_ARGS", "GIVE requires existing actor and item.");
            break;
          }
          const before = stateDigest(actor);
          actor.inventory.add(item);

          world.itemTransfers.push({
            item,
            from: "__WORLD__",
            to: actorName,
            line: stmt.line,
            scene: world.currentScene
          });

          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `${actorName} receives item '${item}'`,
            checks,
            before,
            after: stateDigest(actor)
          });
          break;
        }

        case "KNOWS": {
          const actorName = stmt.args[0];
          const fact = stmt.args.slice(1).join(" ");
          const actor = world.actors.get(actorName);
          if (!actor || !fact) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_KNOWS_ARGS", "KNOWS requires actor and fact.");
            break;
          }
          actor.knowledge.add(fact);

          world.knowledgeEvents.push({
            actor: actorName,
            fact,
            kind: "KNOWS",
            line: stmt.line,
            scene: world.currentScene
          });

          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `${actorName} learned '${fact}'`,
            checks
          });
          break;
        }

        case "MEMORY": {
          const actorName = stmt.args[0];
          const actor = world.actors.get(actorName);
          if (!actor) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_MEMORY_ACTOR", "MEMORY requires an existing actor.");
            break;
          }
          const kv = parseKeyValueArgs(stmt.args.slice(1));
          const eventId = kv.event ?? kv.eventId;
          const role = kv.role ?? "Witness";
          const distortion = parseNumber(kv.distortion) ?? 0;
          const tags = (kv.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean);

          if (!eventId) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_MEMORY_EVENT", "MEMORY requires event=<id>.");
            break;
          }

          actor.memory.push({ eventId, role, distortion, tags });
          if (distortion > 0.8) {
            pushDiagnostic(
              diagnostics,
              "warning",
              stmt.line,
              "W_MEMORY_UNRELIABLE",
              `${actorName} memory '${eventId}' has distortion ${distortion} (>0.8), narrator may be unreliable.`
            );
          }

          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `${actorName} records memory ${eventId}`,
            checks
          });
          break;
        }

        case "RELATE": {
          const arrowIdx = stmt.args.indexOf("->");
          if (arrowIdx === -1 || arrowIdx === 0 || arrowIdx >= stmt.args.length - 1) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_RELATE_SYNTAX", "RELATE syntax: RELATE A -> B affinity=.. trust=.. romance=..");
            break;
          }

          const from = stmt.args[0];
          const to = stmt.args[arrowIdx + 1];
          const fromActor = world.actors.get(from);
          const toActor = world.actors.get(to);
          if (!fromActor || !toActor) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_RELATE_ACTOR", "RELATE references unknown actor(s).");
            break;
          }

          const kv = parseKeyValueArgs(stmt.args.slice(arrowIdx + 2));
          const rel = relationOrDefault(world, from, to);
          rel.affinity = parseNumber(kv.affinity) ?? rel.affinity;
          rel.trust = parseNumber(kv.trust) ?? rel.trust;
          rel.romance = kv.romance === "true" ? true : kv.romance === "false" ? false : rel.romance;

          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `Relation ${from} -> ${to} updated`,
            checks
          });
          break;
        }

        case "GOAL": {
          const actorName = stmt.args[0];
          const actor = world.actors.get(actorName);
          if (!actor) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_GOAL_ACTOR", "GOAL references unknown actor.");
            break;
          }
          const kv = parseKeyValueArgs(stmt.args.slice(1));
          actor.goals.main = kv.main ?? actor.goals.main;
          actor.goals.sub = kv.sub ?? actor.goals.sub;
          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `${actorName} goals updated`,
            checks
          });
          break;
        }

        case "SCENE": {
          const id = stmt.args[0];
          if (!id) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_SCENE_ID", "SCENE requires an ID.");
            break;
          }
          const kv = parseKeyValueArgs(stmt.args.slice(1));
          const worldTime = kv.worldTime;
          const narrative = parseNumber(kv.narrative) ?? world.scenes.length + 1;
          const mode = kv.mode === "flashback" ? "flashback" : "normal";

          if (!worldTime) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_SCENE_TIME", "SCENE requires worldTime=<ISO-8601>.");
            break;
          }

          const newScene: SceneState = {
            id,
            worldTime,
            narrative,
            mode
          };

          const previous = world.currentScene;
          if (previous) {
            const prevTime = Date.parse(previous.worldTime);
            const nextTime = Date.parse(worldTime);
            if (!Number.isNaN(prevTime) && !Number.isNaN(nextTime) && nextTime < prevTime && mode !== "flashback") {
              pushDiagnostic(
                diagnostics,
                "error",
                stmt.line,
                "E_CAUSALITY_TIME",
                `World time moved backwards (${previous.worldTime} -> ${worldTime}) without flashback mode.`
              );
            }
          }

          world.currentScene = newScene;
          world.scenes.push(newScene);
          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `Scene ${id} @ ${worldTime} (${mode})`,
            checks
          });
          break;
        }

        case "SEED": {
          const clueId = stmt.args[0];
          if (!clueId) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_SEED_ID", "SEED requires clue ID.");
            break;
          }
          const kv = parseKeyValueArgs(stmt.args.slice(1));
          const target = kv.target;
          const due = kv.due ?? "Act3";
          if (!target) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_SEED_TARGET", "SEED requires target=<target>.");
            break;
          }
          world.clues.set(clueId, { id: clueId, target, due, state: "Active" });
          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `Clue seeded: ${clueId}`,
            checks
          });
          break;
        }

        case "RESOLVE": {
          const clueId = stmt.args[0];
          if (!clueId) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_RESOLVE_ID", "RESOLVE requires clue ID.");
            break;
          }
          const clue = world.clues.get(clueId);
          if (!clue) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_RESOLVE_UNKNOWN", `Unknown clue '${clueId}'.`);
            break;
          }
          const kv = parseKeyValueArgs(stmt.args.slice(1));
          clue.state = "Resolved";
          clue.reason = kv.reason ?? "resolved";
          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `Clue resolved: ${clueId}`,
            checks
          });
          break;
        }

        case "ACTION": {
          const verb = stmt.args[0]?.toUpperCase();
          const kv = parseKeyValueArgs(stmt.args.slice(1));
          const subjectName = kv.subject;
          if (!verb || !subjectName) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_ACTION_SYNTAX", "ACTION requires verb and subject=<actor>.");
            break;
          }

          const subject = world.actors.get(subjectName);
          if (!subject) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_ACTION_SUBJECT", `Unknown subject '${subjectName}'.`);
            break;
          }

          const before = stateDigest(subject);

          if (!subject.alive) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_ONTOLOGY_DEAD", `${subjectName} is dead and cannot act.`);
          }

          const targetName = kv.target;
          const target = targetName ? world.actors.get(targetName) : undefined;
          if (targetName && !target) {
            pushDiagnostic(diagnostics, "error", stmt.line, "E_ACTION_TARGET", `Unknown target '${targetName}'.`);
          }

          if (target && PHYSICAL_ACTIONS.has(verb)) {
            if (subject.location !== target.location) {
              pushDiagnostic(
                diagnostics,
                "error",
                stmt.line,
                "E_SPATIAL_MISMATCH",
                `${verb} requires same location. ${subjectName}@${subject.location}, ${targetName}@${target.location}.`
              );
            } else {
              checks.push("spatial-check:ok");
            }
          }

          if (verb === "USE") {
            const item = kv.item;
            if (!item || !subject.inventory.has(item)) {
              pushDiagnostic(
                diagnostics,
                "error",
                stmt.line,
                "E_ITEM_MISSING",
                `${subjectName} cannot USE missing item '${item ?? ""}'.`
              );
            } else {
              checks.push("inventory-check:ok");
            }
          }

          if (verb === "GIVE") {
            const item = kv.item;
            if (!item || !subject.inventory.has(item)) {
              pushDiagnostic(
                diagnostics,
                "error",
                stmt.line,
                "E_GIVE_ITEM",
                `${subjectName} does not own '${item ?? ""}'.`
              );
            } else if (target) {
              subject.inventory.delete(item);
              target.inventory.add(item);

              world.itemTransfers.push({
                item,
                from: subjectName,
                to: targetName ?? target.name,
                line: stmt.line,
                scene: world.currentScene
              });
            }
          }

          if (verb === "ATTACK" && target) {
            const damage = parseNumber(kv.damage) ?? 10;
            target.hp -= damage;
            if (target.hp <= 0) {
              target.hp = 0;
              target.alive = false;
            }
          }

          if (verb === "SPEAK") {
            const fact = kv.fact;
            if (fact && !subject.knowledge.has(fact)) {
              pushDiagnostic(
                diagnostics,
                "error",
                stmt.line,
                "E_EPISTEMIC",
                `${subjectName} says unknown fact '${fact}'.`
              );
            } else if (fact) {
              if (target) {
                target.knowledge.add(fact);
                world.knowledgeEvents.push({
                  actor: target.name,
                  fact,
                  kind: "HEAR",
                  line: stmt.line,
                  sourceActor: subjectName,
                  scene: world.currentScene
                });
              }
              checks.push("epistemic-check:ok");
            }
          }

          if (verb === "LEARN") {
            const fact = kv.fact;
            if (fact) {
              subject.knowledge.add(fact);
              world.knowledgeEvents.push({
                actor: subjectName,
                fact,
                kind: "LEARN",
                line: stmt.line,
                scene: world.currentScene
              });
            }
          }

          const actionVector = ACTION_PERSONALITY_VECTOR[verb];
          if (actionVector) {
            const similarity = cosineSimilarity(personalityToVector(subject.personality), actionVector);
            if (similarity < -0.4) {
              pushDiagnostic(
                diagnostics,
                "warning",
                stmt.line,
                "W_CHARACTER_BREAK",
                `Character break risk: ${subjectName} action '${verb}' similarity=${similarity.toFixed(2)}.`
              );
            }
            checks.push(`personality-similarity:${similarity.toFixed(2)}`);
          }

          pushEvent(events, world, {
            line: stmt.line,
            statement: stmt.raw,
            summary: `Action ${verb} by ${subjectName}${targetName ? ` -> ${targetName}` : ""}`,
            checks,
            before,
            after: stateDigest(subject)
          });
          break;
        }

        default: {
          pushDiagnostic(
            diagnostics,
            "error",
            stmt.line,
            "E_UNKNOWN_COMMAND",
            `Unknown command '${stmt.command}'.`
          );
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown internal compiler error";
      pushDiagnostic(diagnostics, "error", stmt.line, "E_INTERNAL", message);
    }
  }

  for (const clue of world.clues.values()) {
    if (clue.state === "Active") {
      diagnostics.push({
        level: "warning",
        line: 0,
        code: "W_CLUE_UNRESOLVED",
        message: `Clue '${clue.id}' remained Active (due=${clue.due}).`
      });
    }
  }

  const success = diagnostics.every((diag) => diag.level !== "error");

  const logHeader = [
    "=== NVL COMPILATION LOG ===",
    `result=${success ? "SUCCESS" : "FAILURE"}`,
    `events=${events.length}`,
    `errors=${diagnostics.filter((d) => d.level === "error").length}`,
    `warnings=${diagnostics.filter((d) => d.level === "warning").length}`,
    ""
  ];

  const eventLines = events.flatMap((evt, idx) => {
    const lines = [
      `[${String(idx + 1).padStart(3, "0")}] line=${evt.line}`,
      `  stmt: ${evt.statement}`,
      `  summary: ${evt.summary}`
    ];
    if (evt.scene) {
      lines.push(`  scene: ${evt.scene.id} worldTime=${evt.scene.worldTime} narrative=${evt.scene.narrative} mode=${evt.scene.mode}`);
    }
    if (evt.checks.length > 0) {
      lines.push(`  checks: ${evt.checks.join(", ")}`);
    }
    if (evt.before) {
      lines.push(`  before: ${evt.before}`);
    }
    if (evt.after) {
      lines.push(`  after: ${evt.after}`);
    }
    lines.push("");
    return lines;
  });

  const diagnosticLines = [
    "=== DIAGNOSTICS ===",
    ...diagnostics.map((diag) => `[${diag.level.toUpperCase()}] line=${diag.line} code=${diag.code} :: ${diag.message}`)
  ];

  const logText = [...logHeader, ...eventLines, ...diagnosticLines].join("\n");

  return {
    success,
    diagnostics,
    events,
    logText,
    state: world,
    normalizedSource: normalizeSource(source)
  };
}
