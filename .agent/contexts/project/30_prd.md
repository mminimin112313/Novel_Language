# PRD: Nexus-CLI

## 1. User & Scenarios

### 1.1 Personas
- **P1. AI Assistant (System User)**: Calls `nexus-cli` as a subprocess to retrieve specific knowledge for answering user queries.
- **P2. Senior Developer (Human User)**: Uses terminal to quickly find references within local documentation or code notes.

### 1.2 User Stories
- **US-1 (P0)**: Ingest local text files (Glob patterns) with automatic chunking and embedding.
- **US-2 (P0)**: Perform natural language queries and receive semantically relevant documents in reranked order.
- **US-3 (P0)**: AI agents obtain results in machine-readable JSON format via `--json` flag.
- **US-4 (P1)**: Adjust search scope (collections) and return count (Top-K).

## 2. Scope

### 2.1 MVP (P0)
- **CLI Framework**: `typer` based interface.
- **Ingestion**: Text loading, BGE-M3 Dense+Sparse embedding generation.
- **Storage**: Qdrant Local Mode.
- **Search**: Hybrid Search + BGE-Reranker-v2-m3.
- **Output**: Human-readable and JSON modes.

### 2.2 Phase 2+
- File watcher for auto-indexing.
- Advanced file support (.pdf, .docx).
- Cloud synchronization options.

## 3. Requirements

### 3.1 Functional Requirements (FR)
- **FR-01 (Add)**: Read specified paths, chunk into 512 tokens, and store in DB.
- **FR-02 (Search)**: Generate Dense/Sparse vectors from query and execute Hybrid Query.
- **FR-03 (Rerank)**: Pass initial candidates (Top 20) through Reranker to return top N (default 5).
- **FR-04 (Format)**: JSON output must include `content`, `filepath`, `score`, and `chunk_id`.

### 3.2 Non-Functional Requirements (NFR)
- **Latency**: < 3s (GPU), < 10s (CPU).
- **Dependency**: No Docker; `pip install` only.
- **Resource**: Minimum 4GB free RAM for model loading.

## 4. Functional Specifications

### F-001: Ingestion (`nexus add`)
- **Action**: Load text -> Chunk (512-1024 chars) -> Embed (BGE-M3) -> Upsert to Qdrant Local.
- **Output**: Confirmation of documents added to collection.

### F-002: Search & Rerank (`nexus search`)
- **Action**: Hybrid Search (Prefetch limit * 4) -> FlagReranker scoring -> Sort & Truncate -> Return.
- **Output**: Human text or structured JSON.
