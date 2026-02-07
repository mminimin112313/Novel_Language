import type { Vector5 } from "./vector.js";

export const ACTION_PERSONALITY_VECTOR: Record<string, Vector5> = {
  HELP: [0.2, 0.4, 0.1, 0.8, -0.2],
  ATTACK: [-0.1, 0.2, 0.2, -0.7, 0.4],
  STEAL: [-0.2, -0.3, 0.2, -0.8, 0.2],
  PARTY: [0.4, -0.1, 0.8, 0.4, 0.0],
  INVESTIGATE: [0.6, 0.7, -0.2, 0.1, 0.2],
  CONFESS_LOVE: [0.3, 0.2, 0.4, 0.8, 0.3],
  MOVE: [0.0, 0.1, 0.0, 0.0, 0.0],
  GIVE: [0.1, 0.3, 0.1, 0.7, -0.1],
  USE: [0.1, 0.3, 0.0, 0.0, 0.0],
  SPEAK: [0.2, 0.2, 0.1, 0.3, 0.1]
};

export const PHYSICAL_ACTIONS = new Set([
  "ATTACK",
  "GIVE",
  "STEAL",
  "HUG",
  "KISS",
  "USE"
]);
