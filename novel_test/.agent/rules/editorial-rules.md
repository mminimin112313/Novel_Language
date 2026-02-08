---
trigger: always_on
---

# Editorial Rules (Episode Writing)

These rules define how drafts are produced, reviewed, and finalized.

## Grounding

- Drafts should be grounded to NVL events using `[[EVT:###]]` markers.
- If `citeEvents=true` in EpisodeSpec, **every paragraph must have at least one citation**.

## Revision Order

1. Fix NVL compiler errors (if any) before touching prose.
2. Fix manuscript lint errors (citations/requirements) before stylistic edits.
3. Then do editorial review, then Korean proofreading.

## Korean Style: Sentence Theory (Munjang-ron)

### 1. Definition of a Good Sentence
A good sentence allows the reader to understand the intended meaning with **minimal cost** (time, cognitive load, emotion) and leads to **accurate understanding** or action.

**Core Elements:**
-   **Accuracy (Truth/Accuracy)**: Facts, logic, and definitions are unshakable.
-   **Clarity**: Interpretation converges to a single meaning (no ambiguity).
-   **Fit**: Appropriate for the reader, purpose, medium, and context.

### 2. The 8 Axes of Quality

1.  **Clarity of Meaning**: The "what" is grasped as a single chunk. Core arguments stand out. No vague demonstratives or forced inferences.
2.  **Information Structure**: Old info first (Topic), New info last (Comment). Important words at the end (End-focus).
3.  **Logical Connection**: Causality, contrast, and examples are felt structurally without excessive conjunctions.
4.  **Economy**: No redundancy ("pre-prepared beforehand"). Reduce nominalization ("execution of" -> "execute").
5.  **Precision**: Distinguish similar words (efficiency vs effectiveness). Ground abstract terms in metrics.
6.  **Rhythm & Readability**: Vary sentence length. Natural word order. Avoid excessive pattern repetition.
7.  **Tone & Ethos**: Humble accuracy. Distinguish between certainty and estimation. Avoid exaggerated warnings without cause.
8.  **Reader Orientation**: Manage premises (what they know vs don't know). Explain jargon immediately.

### 3. The 12 Core Principles

1.  **One Sentence = One Action**: The verb drives the sentence. If the verb is weak, the meaning is weak.
2.  **Subject = Agent**: Avoid "It was done" (passive). State WHO did it.
3.  **Modifiers Close to Modified**: Distance causes misinterpretation (especially "only", "until", "more").
4.  **Abstract -> Concrete Ladder**: Follow abstract concepts immediately with examples/evidence.
5.  **Compare with Axis**: "Better/Faster" needs "Than X" and "By Y criteria".
6.  **Negative Later, Positive First**: "Not un-X" is hard. Use positive framing whenever possible.
7.  **Structure First (Skeleton)**: Show Subject-Predicate early. Put insertions at the back.
8.  **Pre-empt Questions**: Answer "So what?", "Why?", or "How?" within the sentence.
9.  **Uncertainty is Uncertain**: Use "estimated/possible" for unverified facts.
10. **Topic Sentence Promise**: The first sentence declares what the paragraph delivers.
11. **Term Consistency**: Same thing = Same word. Synonyms confuse logic.
12. **Deletion is Best**: If it doesn't add value, cut it.

### 4. Novel Writing Theory (Core Principles)

#### A. Function of a Novel
Delivering an **Experience** (Sensation, Emotion, Tension) over Information.
**Basic Formula**: Character (Desire) + Obstacle (Conflict) + Choice (Action) -> Result (Consequence).

#### B. The 6 Questions (Idea to Story)
1.  **Desire**: What does the protagonist want externally?
2.  **Need**: Why do they want it (Internal Lack/Wound)?
3.  **Obstacle**: What stops them (Person/Society/Self)?
4.  **Stakes**: What is lost if they fail?
5.  **Lie**: What false belief do they start with?
6.  **Change**: How do they change at the end?

#### C. Plot Structures

##### 기승전결 (4막 구조) - 필수

| 막 | 한자 | 기능 | 비율 |
|:---|:-----|:-----|:-----|
| **기(起)** | 起 | 도입, 설정, 촉발사건 | ~25% |
| **승(承)** | 承 | 전개, 갈등 심화, 시도 | ~25% |
| **전(轉)** | 轉 | 전환점, 위기, 결심 | ~25% |
| **결(結)** | 結 | 해소, 결말, 다음 훅 | ~25% |

> [!IMPORTANT]
> 모든 에피소드는 기승전결 4막이 명확해야 함. '전(轉)'이 없으면 스토리가 평평해짐.

##### 기승전결 비트 상세

| 막 | 비트 | 목적 |
|:---|:-----|:-----|
| 기 | Hook | 독자 관심 끌기 |
| 기 | Setup | 상황/인물 설정 |
| 기 | Inciting | 균형 깨는 사건 |
| 승 | Reaction | 주인공 반응 |
| 승 | Attempt | 문제 해결 시도 |
| 승 | Obstacle | 예상 못한 장애 |
| 전 | Crisis | 최악의 상황 |
| 전 | Turn | 새 정보/깨달음 |
| 전 | Decision | 돌이킬 수 없는 선택 |
| 결 | Climax | 최종 대결/결정 |
| 결 | Resolution | 결과와 여파 |
| 결 | Hook-forward | 다음 암시 |

##### 보조 구조

-   **3-Act**: Setup -> Confrontation (Midpoint Transition) -> Resolution.
-   **7-Point**: Hook -> Plot Turn 1 -> Pinch 1 -> Midpoint -> Pinch 2 -> Plot Turn 2 -> Resolution.
-   **Mystery**: Question -> Clue/Red Herring -> Twist -> Answer.


#### D. Character Building
-   **Reaction over Personality**: Character is defined by how they react to pressure.
-   **Formula**: Strong Desire + Wrong Method + Rational Reason.
-   **Checklist**: Desire, Fear, Value, Habit, Flaw.

#### E. Scene Design (Goal-Conflict-Change)
-   **Goal**: What does the character want NOW?
-   **Obstacle**: Who/What stops them?
-   **Tactic**: Persuasion, Force, Deceit, Evasion?
-   **Turn**: The moment the value charge shifts (+ to - or - to +).
-   **Hook**: Question leading to the next scene.

#### F. Prose (Show via Inference)
-   **Inference**: Don't label emotions ("He was sad"). Describe behavior ("He stared at the rain").
-   **Pacing**:
    -   **Scene**: Important choice/conflict -> Slow down (Show details).
    -   **Summary**: Repetition/Travel -> Speed up (Tell/Skip).

#### G. Dialogue Functions
-   Must do at least one: 1) Advance Conflict, 2) Reveal Character, 3) Twist Information.
-   **Subtext**: People rarely say what they mean.

#### H. Pacing & Tension
-   **Tension**: Comes from Uncertainty, not just Danger.
-   **Rhythm**: High (Attempt/Fail) -> Low (Consequence/Recover) -> High.


- Keep `episode-pack.json` + `outline.json` + cited drafts under `manuscripts/<storyId>/<episodeId>/`.
- Keep citation-free final output as a separate artifact.