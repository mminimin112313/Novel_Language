
# NVL Agent Command Center (명령 센터) 🚨

> [!IMPORTANT]
> 이 저장소에서 작업하는 모든 에이전트(AI)는 이 지침을 가장 먼저 숙지해야 합니다. 
> 모든 작업은 **한국어 표준 용어**와 **기승전결 4막 구조**를 기반으로 합니다.

---

## 🏗️ Mental Model: Instruction-First Architecture

이 프로젝트는 코드가 아닌 **지침(Instruction)** 중심의 아키텍처를 가집니다.
- **Source of Truth**: 모든 에이전트의 행동 지침은 `.agent/skills/`에 위치한 `SKILL.md` 파일에 정의되어 있습니다.
- **Deterministic Engine**: `src/compiler` (NVL 컴파일러)는 AI가 생성한 결과물의 논리적 결함을 검증하는 유일한 도구입니다.

---

## 📚 Directory Matrix (디렉토리 구조)

| 디렉토리 | 용도 | 핵심 문서 |
|:---------|:-----|:---------|
| `.agent/rules/` | **시스템 법전** | `system-architecture.md`, `nvl-project-rules.md` |
| `.agent/skills/` | **기술 명세서** | 각 기술 폴더의 `SKILL.md` (Role Prompt) |
| `.agent/workflows/` | **작업 절차서** | `/slash-commands` 대응 태스크 시퀀스 |
| `.agent/templates/` | **강제 포맷** | 아웃라인, 비트시트, 리뷰 템플릿 |

---

## 🇰🇷 Interaction Policy (인터렉션 원칙)

1. **Terminology**: 모든 용어는 한국어 프로젝트 표준을 따릅니다.
   - Chapter → **에피소드 (Episode)**
   - Draft → **초고 / 산문 (Prose)**
   - Summary → **개요 / 요약**
   - Plan → **기획 / 비트시트**
2. **Structure**: 모든 소설 에피소드 기획은 **기(起)-승(承)-전(轉)-결(結)** 4막 구조를 강제합니다.
3. **Writing**: 산문 작성 시 **Split-Write-Merge** (분할 작성 후 병합) 원칙을 준수하여 컨텍스트 제한을 극복합니다.

---

## 🛠️ Getting Started for Agents

1. **상황 파악**: `npm run setup:doctor`를 실행하여 환경과 파일 구조가 정상인지 확인하십시오.
2. **규칙 로드**: `.agent/rules/system-architecture.md`를 로드하여 전체 파이프라인 흐름을 이해하십시오.
3. **수행**: 요청받은 작업에 해당하는 `.agent/skills/<skill-id>/SKILL.md`를 읽고 지침대로 수행하십시오.

---

*Last Updated: 2026-02-08 (Refactored for Agent-First Observability)*
