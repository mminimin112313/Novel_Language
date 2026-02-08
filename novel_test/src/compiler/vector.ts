import type { Personality } from "../shared/types.js";

export type Vector5 = [number, number, number, number, number];

export function personalityToVector(personality: Personality): Vector5 {
  return [
    personality.openness,
    personality.conscientiousness,
    personality.extraversion,
    personality.agreeableness,
    personality.neuroticism
  ];
}

export function cosineSimilarity(a: Vector5, b: Vector5): number {
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    aNorm += a[i] * a[i];
    bNorm += b[i] * b[i];
  }
  if (aNorm === 0 || bNorm === 0) {
    return 0;
  }
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}
