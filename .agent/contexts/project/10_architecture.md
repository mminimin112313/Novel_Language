# Architecture: Nexus-CLI

## 1. Technology Stack
- **Language**: Python 3.10+
- **CLI Framework**: Typer
- **Embedding/Reranking**: FlagEmbedding (BGE-M3 + Reranker)
- **Vector Database**: Qdrant (Local Mode / Disk-based)
- **Text Processing**: Langchain-text-splitters + Custom Legal Semantic Parser
- **Metadata Management**: File-based state tracking (MD5 hashing)

## 2. Data Model (Qdrant Collection: `knowledge_base`)

| Field Name | Type | Description | Indexing |
| --- | --- | --- | --- |
| `id` | UUID | Chunk Unique ID | PK |
| `vector_dense` | Vector(1024) | BGE-M3 Dense Embedding | HNSW |
| `vector_sparse` | SparseVector | BGE-M3 Sparse (Lexical) | Sparse Index |
| `payload.content` | String | Prefixed raw text content | Full-text (Optional) |
| `payload.source` | String | File path / Origin | Keyword |
| `payload.meta` | JSON | Legal structure (Article/Para IDs) | - |
| `payload.chunk_index`| Integer | Sequence within file | - |

## 3. CLI API Specification
- `nexus add [PATH] --collection [NAME]`
- `nexus search [QUERY] --limit [INT] --threshold [FLOAT] --json [BOOL]`
- `nexus manage list-collections`
- `nexus manage delete-collection [NAME]`

## 4. Components & Responsibilities
- **CLI Interface (`typer`)**: Input parsing and output formatting.
- **Legal Semantic Parser**:
    - Mode A (Statute): Article/Paragraph hierarchy extraction.
    - Mode B (Narrative): Semantic paragraph splitting (Case law/Textbooks).
- **Context Prefixer**: Prepend document titles (e.g., `[Case 2024...]`) to every chunk.
- **Model Manager**: Singleton wrapper for `FlagEmbedding` to handle weights and caching.
- **Vector Store Adapter**: Interaction with `qdrant-client` in local storage mode.

## 5. Deployment & Storage
- **Embedded**: No server process; libraries load and access DB files directly on execution.
- **Paths**:
    - Models: `~/.cache/huggingface`
    - DB Data: `~/.nexus/data`

## 6. Key Decisions & Assumptions
- **DB Choice**: Qdrant Local Mode (Disk) for zero-dependency setup.
- **FP16**: Use `use_fp16=True` by default to manage VRAM/RAM pressure.
- **Hardware**: CUDA/MPS recommended; CPU-only requires lightweight model options.
