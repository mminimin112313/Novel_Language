import type { ArchitectOutput, NovelistOutput } from "./types.js";

export function mockArchitect(direction: string): ArchitectOutput {
  const lower = direction.toLowerCase();
  const mermaid = lower.includes("인어") || lower.includes("mermaid") || lower.includes("ariel");

  const dsl = mermaid
    ? [
        "ACTOR Ariel",
        "ACTOR Prince",
        "ACTOR Ursula",
        "SET Ariel.location = Sea",
        "SET Prince.location = Sea",
        "SET Ariel.personality.o = 0.7",
        "SET Ariel.personality.a = 0.8",
        "GIVE Ariel Dagger",
        "KNOWS Ariel RescueSecret",
        "RELATE Ariel -> Prince affinity=45 trust=40 romance=false",
        "SCENE Rescue worldTime=2024-06-01T00:00:00Z narrative=1 mode=normal",
        "ACTION GIVE subject=Ariel target=Prince item=Dagger",
        "ACTION SPEAK subject=Ariel fact=RescueSecret",
        "SCENE Choice worldTime=2024-06-02T00:00:00Z narrative=2 mode=normal",
        "SEED VoicePrice target=ArielVoice due=Act3",
        "ACTION ATTACK subject=Ursula target=Ariel damage=20",
        "RESOLVE VoicePrice reason=SacrificeAccepted"
      ].join("\n")
    : [
        "ACTOR Hero",
        "ACTOR Rival",
        "SET Hero.location = Town",
        "SET Rival.location = Town",
        "GIVE Hero Letter",
        "KNOWS Hero HiddenTruth",
        "SCENE Start worldTime=2024-01-01T00:00:00Z narrative=1 mode=normal",
        "ACTION GIVE subject=Hero target=Rival item=Letter",
        "ACTION SPEAK subject=Hero fact=HiddenTruth"
      ].join("\n");

  return {
    dsl,
    notes: ["mock architect used because API key is missing or call failed"],
    model: "mock-architect",
    provider: "mock"
  };
}

export function mockNovelist(logText: string): NovelistOutput {
  const lines = logText
    .split("\n")
    .filter((line) => line.startsWith("  summary:"))
    .map((line) => line.replace("  summary:", "").trim());

  return {
    text: [
      "파도는 잔잔했지만 마음은 거칠었다.",
      ...lines.map((line) => `그 순간, ${line.toLowerCase()}라는 사건이 연달아 이어졌다.`),
      "모든 선택은 기록으로 남았고, 기록은 이야기의 뼈대가 되었다."
    ].join("\n\n"),
    model: "mock-novelist",
    provider: "mock"
  };
}
