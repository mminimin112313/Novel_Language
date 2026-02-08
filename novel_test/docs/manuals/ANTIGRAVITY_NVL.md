## Antigravity용 NVL 집필 매뉴얼

이 레포는 "소설 집필"을 **NVL(Novel Validation Language)로 코드화**하고, **컴파일러로 플롯 정합성(설정 구멍)을 정적 검증**한 뒤, Antigravity에서 **작가/에이전트가 스킬·워크플로우**로 반복 집필할 수 있도록 구성한 워크스페이스입니다.

핵심: **자연어(의도) -> NVL(플롯 코드) -> 컴파일(정합성) -> AQL(검색/감사) -> 자연어(소설 문장)**.

Antigravity 기본 설치/연결 절차는 `docs/setup/ANTIGRAVITY_BASELINE_SETUP.md`를 먼저 확인하세요.

---

### 1) 레포 구조 (중요)

- `.agent/*`: Antigravity가 로드하는 에이전트 역할 정의(YAML)
- `.agent/skills/*`: Antigravity 스킬들 (건축가/검증/쿼리/에피소드 집필/교정)
- `.agent/workflows/*`: Antigravity 워크플로우들 (셋업/플롯-컴파일/집필/에피소드)
- `.agent/rules/*`: 팀 규칙 및 컴파일 규칙 레지스트리
- `src/compiler/*`: NVL 파서/엔진/룰 (결정론적)
- `src/query/*`: AQL(Author Query Language) 구현
- `src/episode/*`: EpisodeSpec/EpisodePack (에피소드 컨텍스트팩)
- `src/lint/*`: 원고 lint (근거/요구사항 체크)
- `tests/plot/*`: 실제 플롯을 NVL로 변환한 "attempt" 픽스처
- `logs/plot-validation/*`: attempt별 컴파일 로그/진단/요약 (재현 가능한 기록)
- `mcp/*` + `src/mcp/*`: MCP 서버 및 툴 (Antigravity/에디터에서 호출)

---

### 2) 빠른 시작 (API 키 없이)

권장(클론 직후):

```bash
npm run setup:auto
npm run setup:doctor
```

수동으로 확인:

```bash
npm install
npm run lint
npm test
npm run plot:validate
```

선택:

- MCP 서버 실행: `npm run mcp`
- 단일 NVL 파일 컴파일: `npm run compile:file -- <path-to.nvl>`
- AQL 질의: `npm run aql -- <path-to.nvl> "<AQL>"`
- EpisodePack 생성: `npm run episode:pack -- <path-to.nvl> <episode-spec.json> <episode-pack.json>`
- 원고 lint: `npm run manuscript:lint -- <episode-pack.json> <draft.txt>`

---

### 3) NVL 작성 규칙 (요약)

NVL은 **라인 기반 DSL**입니다. 가능한 명령은 다음 범위로 제한합니다:

- `ACTOR`, `COMPONENT`, `SET`, `GIVE`, `KNOWS`, `MEMORY`, `RELATE`, `GOAL`
- `SCENE`, `APPEAR` (씬별 등장인물 추적), `SEED`, `RESOLVE`
- `ACTION` (예: `GIVE`, `ATTACK`, `SPEAK`, `LEARN`, ...)

컴파일러가 강제하는 핵심 정합성 체크:

- `E_CAUSALITY_TIME`: `worldTime`이 역행하면 `mode=flashback`이 필요
- `E_SPATIAL_MISMATCH`: 물리적 액션(`GIVE/ATTACK/USE/...`)은 같은 장소여야 함
- `E_GIVE_ITEM`, `E_ITEM_MISSING`: 인벤토리/소유권 오류
- `E_EPISTEMIC`: 모르는 사실을 말함 (`SPEAK fact=...`)
- `E_ONTOLOGY_DEAD`: 죽은 자가 행동함
- `E_ACTION_TARGET`: `MOVE` 타겟은 선언된 액터여야 함
- `E_RELATE_ACTOR`: `RELATE`에서 알 수 없는 액터 참조

### 3-1) 컨텍스트 로딩 (필수)

에피소드 집필 전, 에이전트는 반드시 다음 파일들을 로드해야 합니다:

1. **`world.nvl`** → 글로벌 액터, 팩션, 초기 관계
2. **이전 에피소드 NVL 파일들** → 누적 상태 (누가 뭘 아는지, 누가 뭘 가졌는지)
3. **`character_voices.md`** → 대화 일관성을 위한 캐릭터 음성 프로필
4. **`cyberfunk-noir-style.md`** → 프로젝트 미학, 금지/필수 표현

**우선순위**: 프로젝트 스타일 > 에디토리얼 이론 > 스킬 기본값

전체 시스템 ERD는 `.agent/rules/system-architecture.md` 참조.

---

### 4) "실제 플롯"을 컴파일하는 방법 (attempt 방식)

목표: 인터넷 소설/서사(가능하면 퍼블릭 도메인)를 **플롯 단위로 분해**하여 NVL로 옮기고, 컴파일 에러가 0이 될 때까지 반복 수정합니다.

1. 소스 교차검증
   - `docs/research/<story-id>-plot-sources.md`에 최소 2개 소스를 기록합니다.

2. attempt 폴더 생성
   - `tests/plot/<story-id>/attempt-01-rough.nvl`부터 시작합니다.

3. 컴파일/수정 반복
   - `npm run compile:file -- tests/plot/<story-id>/attempt-01-rough.nvl`
   - 에러(`level=error`)가 0이 될 때까지 attempt를 늘리며 수정합니다.

4. 로그/기록 저장 (재현성)
   - `npm run plot:validate`는 attempt별 결과를 `logs/plot-validation/<story-id>/`에 저장합니다.

5. 테스트로 고정
   - `tests/plot/<story-id>.spec.ts`에서:
     - attempt-01은 실패해야 함 (정합성 룰이 실제로 잡는지 증명)
     - 최종 attempt는 성공해야 함

---

### 5) AQL로 "검색/감사"하기

AQL은 소설 데이터(인물/지식/아이템/복선)를 SQL/TRACE 형태로 조회합니다.

예시:

```bash
# 살아있는 인물 목록
npm run aql -- tests/plot/little-mermaid/attempt-03-compile-pass.nvl "SELECT name, status, location FROM Actors WHERE status = 'Alive'"

# 아이템 소유권 추적
npm run aql -- tests/plot/little-mermaid/attempt-03-compile-pass.nvl "TRACE OWNERSHIP OF 'Dagger'"

# 지식 전파(누가 누구에게 어떤 사실을 전달했는지)
npm run aql -- tests/plot/speckled-band/attempt-03-compile-pass.nvl "SELECT actor, fact, kind, sourceActor, sceneId, worldTime FROM Knowledge"

# 복선 상태
npm run aql -- tests/plot/speckled-band/attempt-03-compile-pass.nvl "SELECT id, state, due FROM Clues"
```

현재 지원 테이블:

- `Actors`, `Knowledge`, `ItemTransfers`, `Clues`, `Scenes`

---

### 6) Antigravity에서 "실제 소설 집필" 흐름 (Pipeline Overhaul)

이 레포는 **Publishing Industry Flow**를 따릅니다: `Series Outline -> Beat Sheet -> NVL -> Draft -> Review -> Final`.

**권장 워크플로우**:

1. **시리즈 기획**: `.agent/templates/series-outline-template.md`로 전체 윤곽을 잡습니다.
2. **에피소드 기획**: `nvl-episode-planner`로 **기승전결 4막** 비트시트를 만듭니다.
3. **NVL 코딩**: `nvl-architect`로 플롯을 코딩하고 `npm run compile:cascade`로 검증합니다.
4. **분할 집필 (Split-Write-Merge)**:
   - `nvl-episode-writer`가 기, 승, 전, 결 파트를 따로 작성합니다 (5KB 제한 대응).
   - `cat part_*.txt > _merged.txt`로 병합합니다.
5. **리뷰 루프**:
   - `nvl-episode-reviewer`가 `PASS/REVISE/REJECT` 판정을 내립니다.
   - 통과할 때까지 수정-재리뷰를 반복합니다.
6. **교정 및 완성**:
   - `nvl-korean-proofreader`가 최종 교정을 수행합니다.
   - `[[EVT:###]]` 인용을 제거하여 출판용 원고를 만듭니다.

커맨드형 워크플로우 별칭:

- `.agent/workflows/00-setup.md`
- `.agent/workflows/20-write-novel.md` (전체 흐름)
- `.agent/workflows/30-write-episode.md` (에피소드 단위)
- `.agent/workflows/plan.md`
- `.agent/workflows/review.md`

---

### 6.1) 에피소드 구조 요구사항 (기승전결)

모든 에피소드는 4막 구조를 가져야 합니다:

1. **기(起)**: 도입, 설정, 훅 (25%)
2. **승(承)**: 갈등 심화, 시도 (25%)
3. **전(轉)**: 전환점, 위기, 결심 (25%)
4. **결(結)**: 해소, 다음 에피소드 연결 (25%)

`nvl-episode-planner`는 이 구조가 없으면 비트시트를 승인하지 않습니다.

---

### 7) MCP로 툴 호출하기 (에이전트 자동화)

MCP 서버 실행:

```bash
npm run mcp
```

제공 툴:

- `nvl_compile`: NVL 컴파일
- `nvl_aql`: NVL+AQL 질의
- `nvl_pipeline`: (옵션) Architect->Compiler->Novelist 파이프라인
- `nvl_episode_pack`: EpisodeSpec 기반 EpisodePack 생성
- `nvl_manuscript_lint`: EpisodePack 기반 원고 lint (근거/요구사항)
- `nvl_read_run_file`: `.runs` 아티팩트 읽기
- `nvl_write_novel`: (옵션) 장편 파이프라인(현재는 mock fallback 기준)

Antigravity/에디터에서 `nvl_compile`과 `nvl_aql`을 붙이면 "플롯 정합성 + 검색" 루프가 자동화됩니다.
