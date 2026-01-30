---
trigger: always_on
---

# Project Memory Rules (Technical Implementation)

Project memory provides a **Semantic Knowledge Graph** using vector embeddings and local Markdown persistence.

## 1. Technical Architecture
- **Location**: `.agent/skills/capabilities/memory/`
- **Core Engine**: `memory_core.py` (Python 3.9+ using `SentenceTransformer`).
- **Index**: `.agent/memory/memory_index.db` (SQLite with `BLOB` embedding storage).
- **Source of Truth**: `.agent/memory/nodes/*.md` files.

## 2. Integration & Recording
- **Bridge**: `MemorySkill.ts` translates TypeScript requests to the Python core via the local `.venv`.
- **Subskill Hook**: The **Browsing** capability automatically uses this memory subskill to store session insights.
- **Recording Process**:
    1.  Agent calls `record(content, tags, title)`.
    2.  `memory_core.py` generates a 384-dimension vector index.
    3.  A Markdown file is created in `.agent/memory/nodes/`.
    4.  The SQLite index is updated with the node metadata and embedding.

## 3. Recording Criteria
Record a new memory node ONLY for high-value insights:
- **Architectural Pivots**: "Why we moved from FTS5 to Sentence Transformers."
- **Niche Fixes**: "Resolution for the Playwright `EADDRINUSE` port conflict."
- **Domain logic**: "Specific handling rules for the client's legal document parser."

## 4. Semantic Retrieval
Use natural language queries for retrieval:
- **Bad Search**: `grep "memory script location"` (Keyword only)
- **Good Search**: `await memory.search("where is the memory engine implementation?")` (Semantic match)

## 5. Self-Healing & Maintenance
- **Environment**: Always use the local `.venv` for memory operations.
- **Updates**: When updating a memory, the bridge ensures both the Markdown file and the SQLite index are synchronized.