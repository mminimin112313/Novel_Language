# Implementation Roadmap: Nexus-CLI

## 1. Milestones

### Sprint 0: Setup
- Initialize Python project (Poetry/Pip).
- Test BGE-M3 model loading.
- Establish project directory structure.

### Sprint 1: Legal Ingestion
- Implement `nexus add` with file state tracking (MD5).
- Develop **Legal Semantic Parser** (Hierarchical Statute + Narrative Paragraph).
- Implement **Context Prefixer** for semantic integrity across chunks.
- Dense/Sparse/ColBERT embedding generation using BGE-M3.
- Qdrant Local storage persistence.

### Sprint 2: Hybrid Search & Expert Retrieval
- Implement `nexus search`.
- **Hybrid Fusion Algorithm**: Weighted Sum of Dense + Sparse + ColBERT.
- Qdrant `Prefetch` execution pipe for single-request multi-vector query.
- BGE-Reranker integration for top-10 refinement.
- JSON output formatting for Agents.

### Sprint 3: Polish & UX
- Add progress bars for ingestion.
- Comprehensive error handling.
- Documentation and packaging.

## 2. Test Strategy
- **Unit Tests**: Validate text splitting and embedding dimensions.
- **Integration Tests**: Verify end-to-end flow: Ingest 5 docs -> Search keyword -> Verify Top-1 match.
- **Performance**: Ensure < 2s response time for 1000 chunks.

## 3. Risk Register
- **Memory Consumption**: Models require 2-4GB RAM. *Mitigation: Default FP16 and small model options.*
- **File Locking**: Qdrant Local may lock if multiple processes access simultaneously. *Mitigation: Handle lock errors gracefully.*
