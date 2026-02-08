
# Workflow Registry (작업 절차서) 📋

에이전트가 복잡한 태스크를 수행할 때 따라야 할 표준 Runbook입니다.

## 1. Core Production Loop (핵심 저작 루프)
- `novel-writing.md`: [Main] 전체 소설 저작 프로세스 (세계관 -> 에피소드 -> 산문).
- `10-plot-compile.md`: 플롯 기획부터 NVL 컴파일 통과까지의 반복문.
- `20-write-novel.md`: 컴파일 로그를 기반으로 한 고밀도 산문 작성.

## 2. Implementation Specs (구현 명세)
- `30-write-episode.md`: 에피소드 단위의 상세 집필, 린트, 교정 절차.
- `cascade-compile.md`: 이전 에피소드들과의 연속성을 확인하는 계단식 컴파일 가이드.

## 3. Support Workflows (지원 작업)
- `setup.md`: 환경 및 구조 진단 가이드.
- `review.md`: 에디터 리뷰 및 수정 이력 관리.
- `debug.md`: 컴파일 오류 트리아지 및 집중 수리.

---

에이전트는 `/command` 형태의 태스크 요청 시 해당 문서의 `Step`을 순차적으로 수행해야 합니다.
