
# Skill Registry (기술 보관소) 🛠️

에이전트가 수행할 수 있는 모든 전문 기술의 명세서(`SKILL.md`)가 여기 있습니다.

## 1. Episode Planning (에피소드 기획)
- `nvl-episode-planner`: 기승전결 4막 구조의 비트시트 생성.
- `nvl-world-builder`: 세계관 및 인물 설정 동기화.

## 2. Architecture & Logic (설계 및 논리)
- `nvl-architect`: 작가 지침을 NVL 코드로 변환 및 오류 수정.
- `nvl-compiler-guard`: NVL 코드의 인과/공간/지식 일관성 검증.
- `nvl-aql`: 컴파일된 세계 상태 쿼리.

## 3. Prose Writing (산문 작성)
- `nvl-episode-writer`: 비트시트와 컴파일 로그를 기반으로 한 한국어 산문 작성.
- `nvl-novelist`: 로그 기반의 고밀도 산문 렌더링.

## 4. Quality Assurance (품질 보증)
- `nvl-korean-proofreader`: 한국어 맞춤법, 문체, 인용(`[[EVT:###]]`) 검수.
- `nvl-consistency-auditor`: 플롯 홀 및 일관성 정밀 진단.

---

모든 기술은 `.agent/skills/_shared/`의 공통 리소스를 공유할 수 있습니다.
