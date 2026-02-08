import type { ArchitectOutput, NovelPlanOutput, NovelistOutput } from "./types.js";

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
      "SET Ursula.location = Sea",
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
    notes: ["mock architect used (no external LLM configured)"],
    model: "mock-architect",
    provider: "mock"
  };
}

export function mockNovelist(logText: string): NovelistOutput {
  const lines = logText
    .split("\n")
    .filter((line) => line.startsWith("  summary:"))
    .map((line) => line.replace("  summary:", "").trim());

  const baseText = [
    "파도는 잔잔했지만 마음은 거칠었다.",
    ...lines.map((line) => `그 순간, ${line.toLowerCase()}라는 사건이 연달아 이어졌다.`),
    "모든 선택은 기록으로 남았고, 기록은 이야기의 뼈대가 되었다."
  ].join("\n\n");

  // Repeat to simulate approx 10KB (avg 100 chars -> 100 repeats ~10KB)
  const expandedText = Array.from({ length: 50 }).map(() => baseText).join("\n\n---\n\n");

  return {
    text: expandedText,
    model: "mock-novelist",
    provider: "mock"
  };
}

export function mockNovelPlan(
  concept: string,
  chapterCount: number,
  baseStyle: string,
  titleHint?: string
): NovelPlanOutput {
  const title = titleHint?.trim() || "무제 장편 프로젝트";
  const chapters = Array.from({ length: chapterCount }).map((_, index) => {
    const chapterNo = index + 1;
    return {
      index: chapterNo,
      title: `Chapter ${chapterNo}`,
      style: baseStyle,
      direction: [
        `주제: ${concept}`,
        `이 장의 목표: 인물 갈등을 진행시키고 다음 장으로 연결`,
        `핵심 사건: 주인공이 선택을 내리고 그 결과가 즉시 드러난다 (${chapterNo}장).`
      ].join(" / ")
    };
  });

  return {
    title,
    summary: `총 ${chapterCount}개 장으로 구성된 기본 플롯 아웃라인`,
    chapters,
    model: "mock-planner",
    provider: "mock"
  };
}

export function mockWorldBuilder(
  genre: string,
  concept: string,
  tone: string
): import("./types.js").WorldBuildOutput {
  return {
    bible: {
      title: "Generated World",
      premise: concept,
      locations: {
        "Capital City": "The heart of the empire.",
        "Wasteland": "A dangerous border region."
      },
      factions: {
        "The Guild": "Merchants controlling trade.",
        "The Rebels": "Groups fighting for freedom."
      },
      technology: {
        "Tech Level": "High-tech with magic.",
        "FTL": "Warp drive exists."
      },
      history: [
        "The Great War ended 100 years ago.",
        "The Empire was founded."
      ],
      keyNPCs: {
        "Emperor": "Current ruler.",
        "Rebel Leader": "Mysterious figure."
      }
    },
    model: "mock-world-builder",
    provider: "mock"
  };
}
