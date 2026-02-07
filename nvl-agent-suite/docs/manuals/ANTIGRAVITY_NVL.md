## Antigravity용 NVL 집필 매뉴얼

이 레포는 "소설 집필"을 **NVL(Novel Validation Language)로 코드화**하고, **컴파일러로 플롯 정합성(설정 구멍)을 정적 검증**한 뒤, Antigravity에서 **작가/에이전트가 스킬·워크플로우**로 반복 집필할 수 있도록 구성한 워크스페이스입니다.

핵심: **자연어(의도) -> NVL(플롯 코드) -> 컴파일(정합성) -> AQL(검색/감사) -> 자연어(소설 문장)**.

---

### 1) 레포 구조 (중요)

- `.agent/skills/*`: Antigravity가 로드하는 스킬들 (작가/건축가/검증/쿼리)
- `.agent/workflows/*`: Antigravity가 로드하는 워크플로우들 (셋업/플롯-컴파일/집필)
- `.agent/rules/*`: 팀 규칙 및 컴파일 규칙 레지스트리
- `src/compiler/*`: NVL 파서/엔진/룰 (결정론적)
- `src/query/*`: AQL(Author Query Language) 구현
- `tests/plot/*`: 실제 플롯을 NVL로 변환한 "attempt" 픽스처
- `logs/plot-validation/*`: attempt별 컴파일 로그/진단/요약 (재현 가능한 기록)
- `mcp/*` + `src/mcp/*`: MCP 서버 및 툴 (Antigravity/에디터에서 호출)

---

### 2) 빠른 시작 (API 키 없이)

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

---

### 3) NVL 작성 규칙 (요약)

NVL은 **라인 기반 DSL**입니다. 가능한 명령은 다음 범위로 제한합니다:

- `ACTOR`, `COMPONENT`, `SET`, `GIVE`, `KNOWS`, `MEMORY`, `RELATE`, `GOAL`
- `SCENE`, `SEED`, `RESOLVE`
- `ACTION` (예: `GIVE`, `ATTACK`, `SPEAK`, `LEARN`, ...)

컴파일러가 강제하는 핵심 정합성 체크:

- `E_CAUSALITY_TIME`: `worldTime`이 역행하면 `mode=flashback`이 필요
- `E_SPATIAL_MISMATCH`: 물리적 액션(`GIVE/ATTACK/USE/...`)은 같은 장소여야 함
- `E_GIVE_ITEM`, `E_ITEM_MISSING`: 인벤토리/소유권 오류
- `E_EPISTEMIC`: 모르는 사실을 말함 (`SPEAK fact=...`)
- `E_ONTOLOGY_DEAD`: 죽은 자가 행동함

---

### 4) "실제 플롯"을 컴파일하는 방법 (attempt 방식)

목표: 인터넷 소설/서사(가능하면 퍼블릭 도메인)를 **플롯 단위로 분해**하여 NVL로 옮기고, 컴파일 에러가 0이 될 때까지 반복 수정합니다.

1. 소스 교차검증
   - `docs/research/<story-id>-plot-sources.md`에 최소 2개 소스를 기록합니다.
   - 예: Gutenberg(원문) + Wikipedia(요약)

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

### 6) Antigravity에서 "실제 소설 집필" 흐름

이 레포의 기본 철학은 **LLM을 코드 안에서 직접 호출하지 않고**, Antigravity가 제공하는 런타임(스킬/워크플로우)로 집필을 수행하는 것입니다.

권장 루프:

1. 방향(디렉션) 작성
2. `nvl-architect` 스킬로 NVL attempt 생성/수정
3. 컴파일러로 에러 제거 (필요 시 `nvl-aql`로 추적)
4. 컴파일 PASS 로그를 `nvl-novelist` 스킬에 주고 자연어 소설 생성
5. 결과물을 `manuscripts/<story-id>/` 아래에 저장하고, NVL/로그와 함께 버전 관리

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
- `nvl_read_run_file`: `.runs` 아티팩트 읽기

Antigravity/에디터에서 `nvl_compile`과 `nvl_aql`을 붙이면 "플롯 정합성 + 검색" 루프가 자동화됩니다.

