
# Rules Registry (규칙 보관소) ⚖️

항상 상위 계층의 규칙이 하위 계층을 오버라이드(Override)합니다.

## 1. Project Layer (가장 높음)
현재 진행 중인 프로젝트의 특정 규칙입니다.
- `nvl-project-rules.md`: 에이전트 운영 원칙 및 파일 명명 규칙.
- `office-romance-style.md`: [NEW] 오피스 로맨스 장르 특화 미학 및 톤.

## 2. Validation Layer (중간)
NVL 코드의 기계적, 논리적 무결성을 검증합니다.
- `compiler-rules.yaml`: 컴파일러가 검사하는 하드 룰 목록.
- `nvl-compiler-guide.md`: 주요 에러 패턴 및 수정 방법.
- `nvl-pipeline-spec.md`: 데이터 흐름 및 일관성 규칙.

## 3. Editorial Layer (가장 낮음)
일반적인 글쓰기 및 소설 작법 이론입니다.
- `editorial-rules.md`: 문장론(Sentence Theory) 및 소설 작법(Novel Theory).

---

## 🏛️ System Architecture
전체 시스템의 ERD와 기술-워크플로우 연결 지도는 [system-architecture.md](system-architecture.md)를 참조하십시오.
