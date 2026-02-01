# Project Intent: Nexus-CLI

Nexus-CLI is a local CLI tool designed to ingest text data and perform high-quality hybrid search (Retrieval + Reranking) optimized for consumption by AI agents.

## 1. Vision Summary (Terminal Truth)
**Nexus-CLI**는 로컬 환경에서 BGE-M3와 Reranker 모델을 활용해 개인 지식 베이스를 구축하고, AI 에이전트가 높은 정확도로 정보를 검색(Retrieval)할 수 있도록 돕는 Python 기반의 경량 검색 엔진 도구이다.

## 2. Problem Definition & Goals

### 2.1 Background / Problems
- **Local Privacy & Context**: Users want to search personal documents without sending them to external clouds.
- **AI Tool Integration**: Existing CLI tools focus on human readability, making it hard for AI Agents (LLMs) to parse as function calls or tools.
- **Accuracy Gap**: Keyword search (BM25) or simple embeddings often fail to capture nuanced context in specialized or legal documents.

### 2.2 Primary Goals
- **High-Fidelity Retrieval**: Integrate BGE-M3 Dense+Sparse hybrid search with Reranker to maximize Top-5 accuracy.
- **Agent-Ready Interface**: Provide structured JSON output for immediate LLM context consumption.
- **Zero-Setup Infrastructure**: Run as a light Python tool using Qdrant's local embedded mode without external DB installations.

### 2.3 Non-Goals
- **PDF/Image OCR**: Focus exclusively on text (.txt, .md, .json). Pre-processing is external.
- **LLM Generation**: Provide high-quality retrieval only; generation is left to the calling Agent.
- **Multi-User Server**: Designed for single-user local machine environments.
