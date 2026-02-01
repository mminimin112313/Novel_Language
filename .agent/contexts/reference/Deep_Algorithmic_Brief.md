# Nexus-CLI: Deep Algorithmic Brief

## 1. Legal Data Hierarchy Parsing (`searchlaw.html`)
The core challenge in Korean legal RAG is preserving the semantic relationship between a Clause (조), its Paragraphs (항), and Items (호).

### Algorithm: Recursive Flattening
To index this data, Nexus-CLI should adopt the following parsing logic extracted from `searchlaw.html`:
1.  **Normalization**: Ensure all fields are arrays (e.g., `_ensureListJs`).
2.  **Structural Context**: Prepend the parent Article ID and Title to every child chunk.
3.  **Hierarchy Mapping**:
    - **Level 1**: `제N조 (제목)`
    - **Level 2**: `① (항 내용)`
    - **Level 3**: `1. (호 내용)`
    - **Level 4**: `가. (목 내용)`

## 2. Narrative Semantic Parsing (Case Law, Reports, Textbooks)
For narrative data (판례, 보고서, 교과서), rigid hierarchy is often missing. As per the design consensus, **Paragraph-level (문단별)** parsing is the standard for these types.

### Algorithm: Semantic Paragraph Splitting
1.  **Normalization**: Strip excessive whitespace and unify newline characters (`\r\n` -> `\n`).
2.  **Splitting Heuristic**:
    - Primary split on double newlines (`\n\n`) to identify logical paragraphs.
    - Secondary split on section headers (e.g., `【판시사항】`, `1. 개요`).
3.  **Context Enrichment**:
    - For Case Law, every paragraph chunk must be prefixed with the `[Case Number]` and `[Court Name]`.
    - For Textbooks, chunks are prefixed with the current `[Chapter/Section Title]`.
4.  **Min/Max Constraints**:
    - Merge small paragraphs (e.g., < 100 chars) with the next one to maintain semantic density.
    - Split oversized paragraphs (e.g., > 1000 chars) using sentence-boundary detection.

### API Strategy
- **Search**: `lawSearch.do?target=law&query=...` -> extract `법령일련번호` (MST).
- **Detail Extraction**: `lawService.do?target=law&MST=...` -> receive full XML/JSON with `조문단위` (Article units).
- **Automation**: Automate this pipeline for "Batch Download" functionality.

## 2. BGE-M3 Hybrid Scoring (`FlagEmbedding`)
BGE-M3 is highly effective because it combines three distinct retrieval signals.

### Math & Algorithm: Multi-Vector Fusion
1.  **Dense Embedding**: `dot(query_dense, passage_dense)`. Captures semantic similarities where keywords differ.
2.  **Sparse Weights (Lexical)**: `sum(query_sparse[t] * passage_sparse[t])`. Acts as a learnable BM25, ensuring exact keyword match (e.g., "징계").
3.  **ColBERT MaxSim**: `sum_i(max_j(query_token[i] @ passage_token[j]))`. Provides late-interaction token-level alignment.

**Strategic Consensus**: Use weighted sum for fusion in Qdrant:
`Score = (wD * Dense) + (wS * Sparse) + (wC * ColBERT)`

## 3. Context-Aware Ingestion (`khoj`)
How to manage updates and maintain context across chunks.

### Algorithm: Heading Prepending & Line Tracking
1.  **The "Heading Snippet" Rule**: When a document is split into chunks, the first 100 characters of the parent `heading` (Article title + File name) are prepended to *every* non-first chunk.
    ```python
    if chunk_index > 0:
        chunk = f"{snipped_heading}\n{chunk}"
    ```
2.  **Deterministic Line Tracking**: Use the URI pattern `file://path#line=N`. Calibrate `N` by finding the chunk's literal occurrence index in the raw text and counting preceding `\n`.
3.  **Incremental Fingerprinting**: Use MD5 of the *compiled* (cleaned + heading prepended) text as the primary key. If the MD5 exists in Qdrant, skip processing.

## 4. Qdrant `Prefetch` Execution Pipe
Instead of multiple network rounds, Nexus-CLI should use the single-request `QueryRequest` architecture.

### Implementation Algorithm
```json
{
  "prefetch": [
    { "query": { "sparse_indices": [...] }, "limit": 100 },
    { "query": { "dense": [...] }, "limit": 100 }
  ],
  "query": { "fusion": "rrf" },
  "limit": 10
}
```
1.  **Sparse Stage**: Filters the massive corpus to top candidates based on legal terminology.
2.  **Dense Stage**: Re-orders by semantic relevance.
3.  **Rerank Stage**: (Optional) Use BGE-Reranker for the final top 10.
