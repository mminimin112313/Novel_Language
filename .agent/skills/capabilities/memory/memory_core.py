#!/usr/bin/env python3
import argparse
import sqlite3
import os
import sys
import json
import uuid
from datetime import datetime
from pathlib import Path

# Configuration
MEMORY_DIR = Path(os.path.dirname(os.path.realpath(__file__))).parent.parent.parent / "memory"
NODES_DIR = MEMORY_DIR / "nodes"
DB_PATH = MEMORY_DIR / "memory_index.db"
STM_PATH = MEMORY_DIR / "working_memory.md"

# Global model variable for lazy loading
_model = None

# --- STM Functions ---
def stm_write(content):
    """Appends content to Short-Term Memory."""
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = f"\n- [{timestamp}] {content}"
    
    with open(STM_PATH, "a", encoding="utf-8") as f:
        f.write(entry)
    print(json.dumps({"status": "stm_updated", "entry": entry.strip()}))

def stm_read():
    """Reads current Short-Term Memory."""
    if not STM_PATH.exists():
        print(json.dumps({"status": "empty", "content": ""}))
        return
        
    with open(STM_PATH, "r", encoding="utf-8") as f:
        content = f.read().strip()
    
    if not content:
        print(json.dumps({"status": "empty", "content": ""}))
    else:
        # Just print raw text for the agent to read easily
        print(content)

def consolidate():
    """Moves STM content to LTM and clears STM."""
    if not STM_PATH.exists():
        print(json.dumps({"status": "stm_empty"}))
        return

    with open(STM_PATH, "r", encoding="utf-8") as f:
        content = f.read().strip()
        
    if not content:
        print(json.dumps({"status": "stm_empty"}))
        return
        
    # Record to LTM
    title = f"Session Consolidaton {datetime.now().strftime('%Y-%m-%d %H:%M')}"
    record(content, "session-log,stm-consolidation", title)
    
    # Clear STM
    with open(STM_PATH, "w", encoding="utf-8") as f:
        f.write("") # Wipe
        
    print(json.dumps({"status": "consolidated", "bytes": len(content)}))


def get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            # Using a lightweight model for better performance/quality balance
            _model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        except ImportError:
            print(json.dumps({"error": "sentence-transformers not installed"}), file=sys.stderr)
            sys.exit(1)
    return _model

def get_embedding(text):
    # Lazy import numpy only when needed for embeddings/search
    import numpy as np
    model = get_model()
    return model.encode(text)

def init_db():
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)
    NODES_DIR.mkdir(parents=True, exist_ok=True)
    
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    
    # Enable FTS5 for keyword fallback/hybrid search
    c.execute('''
        CREATE VIRTUAL TABLE IF NOT EXISTS memory_index USING fts5(
            id UNINDEXED,
            content,
            tags,
            title
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS memory_meta (
            id TEXT PRIMARY KEY,
            created_at TEXT,
            updated_at TEXT,
            file_path TEXT
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS edges (
            source_id TEXT,
            target_id TEXT,
            relation TEXT,
            created_at TEXT,
            PRIMARY KEY (source_id, target_id, relation)
        )
    ''')

    # New table for vector embeddings
    c.execute('''
        CREATE TABLE IF NOT EXISTS memory_embeddings (
            id TEXT PRIMARY KEY,
            embedding BLOB
        )
    ''')
    
    # New table for Memory Health (Ebbinghaus)
    c.execute('''
        CREATE TABLE IF NOT EXISTS memory_health (
            id TEXT PRIMARY KEY,
            strength REAL,
            last_accessed TEXT,
            access_count INTEGER
        )
    ''')
    
    conn.commit()
    conn.close()

def save_node(id, content, tags, title):
    filename = f"{id}.md"
    file_path = NODES_DIR / filename
    
    timestamp = datetime.now().isoformat()
    
    md_content = f"""---
id: {id}
title: {title or 'Untitled'}
tags: {json.dumps(tags)}
created_at: {timestamp}
---

# {title or 'Untitled'}

{content}
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(md_content)
        
    return str(file_path)

def touch(id):
    """Reinforces a memory, increasing its strength and updating access time."""
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    
    now = datetime.now().isoformat()
    
    c.execute("SELECT strength, access_count FROM memory_health WHERE id=?", (id,))
    row = c.fetchone()
    if row:
        curr_strength, curr_count = row
        # Reinforcement logic: Additive strength increase
        new_strength = curr_strength + 5.0 # Add 5 hours to stability per access
        new_count = curr_count + 1
        c.execute("UPDATE memory_health SET strength=?, last_accessed=?, access_count=? WHERE id=?",
                  (new_strength, now, new_count, id))
    else:
        # Initialize if missing (e.g. legacy records)
        c.execute("INSERT INTO memory_health (id, strength, last_accessed, access_count) VALUES (?, ?, ?, ?)",
                  (id, 10.0, now, 1)) # Default strength: 10 hours
        
    conn.commit()
    conn.close()

def record(content, tags_str, title):
    init_db()
    
    tags = [t.strip() for t in tags_str.split(',') if t.strip()]
    id = str(uuid.uuid4())
    
    file_path = save_node(id, content, tags, title)
    
    # Generate embedding
    embedding = get_embedding(content).tobytes()
    
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    
    now = datetime.now().isoformat()
    
    c.execute("INSERT INTO memory_index (id, content, tags, title) VALUES (?, ?, ?, ?)",
              (id, content, ",".join(tags), title))
    c.execute("INSERT INTO memory_meta (id, created_at, updated_at, file_path) VALUES (?, ?, ?, ?)",
              (id, now, now, file_path))
    c.execute("INSERT OR REPLACE INTO memory_embeddings (id, embedding) VALUES (?, ?)",
              (id, embedding))
    # Initialize health
    c.execute("INSERT INTO memory_health (id, strength, last_accessed, access_count) VALUES (?, ?, ?, ?)",
              (id, 24.0, now, 1)) # Start strong (24 hours) to survive immediate context
    
    conn.commit()
    print(json.dumps({"id": id, "status": "recorded", "path": file_path}))

def update(id, content, tags_str, title):
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    
    # Fetch existing
    c.execute("SELECT content, tags, title FROM memory_index WHERE id=?", (id,))
    row = c.fetchone()
    if not row:
        print(json.dumps({"error": "Memory not found"}))
        return

    old_content, old_tags_str, old_title = row
    
    new_content = content if content else old_content
    new_tags = [t.strip() for t in tags_str.split(',')] if tags_str else old_tags_str.split(',')
    new_title = title if title else old_title
    
    # Update files
    file_path = save_node(id, new_content, new_tags, new_title)
    
    # Update embeddings if content changed
    if content:
        embedding = get_embedding(new_content).tobytes()
        c.execute("INSERT OR REPLACE INTO memory_embeddings (id, embedding) VALUES (?, ?)", (id, embedding))

    # Update DB
    c.execute("UPDATE memory_index SET content=?, tags=?, title=? WHERE id=?",
              (new_content, ",".join(new_tags), new_title, id))
    c.execute("UPDATE memory_meta SET updated_at=? WHERE id=?",
              (datetime.now().isoformat(), id))
              
    conn.commit()
    conn.close()
    
    touch(id) # Reinforce on update
    print(json.dumps({"id": id, "status": "updated"}))

def calculate_retrievability(last_accessed_iso, strength_hours):
    """Calculates R = exp(-t/S)"""
    if not last_accessed_iso:
        return 0.0
    try:
        last = datetime.fromisoformat(last_accessed_iso)
        now = datetime.now()
        elapsed = now - last
        hours_elapsed = elapsed.total_seconds() / 3600.0
        
        # Avoid division by zero
        s = max(strength_hours, 0.1)
        r = np.exp(-hours_elapsed / s)
        return r
    except Exception:
        return 0.0

def search(query, tag, verbose=False, deep=False):
    import numpy as np # Lazy import for CLI speed
    
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    results = []

    # 1. Vector Search
    if query:
        query_embedding = get_embedding(query)
        
        c.execute("SELECT id, embedding FROM memory_embeddings")
        rows = c.fetchall()
        
        if not rows:
            print(json.dumps([]))
            return

        ids = [row['id'] for row in rows]
        embeddings = [np.frombuffer(row['embedding'], dtype=np.float32) for row in rows]
        
        # Stack into (N, D) matrix
        embeddings_matrix = np.vstack(embeddings)
        
        # Normalize matrix rows: (N, D)
        norms = np.linalg.norm(embeddings_matrix, axis=1, keepdims=True)
        embeddings_matrix = embeddings_matrix / (norms + 1e-10) # Avoid division by zero
        
        # Normalize query: (D,)
        query_norm = np.linalg.norm(query_embedding)
        query_vec = query_embedding / (query_norm + 1e-10)
        
        # Dot product: (N, D) @ (D,) -> (N,)
        similarities = np.dot(embeddings_matrix, query_vec)
        
        # Get top indices (more than K to allow for filtering/re-ranking)
        # We fetch top 50 candidates by vector similarity first
        top_indices = np.argsort(similarities)[::-1][:50]
        
        scored_results = []
        
        for idx in top_indices:
            similarity = float(similarities[idx])
            if similarity < 0.2: # Hard cutoff for relevance
                continue
                
            mid = ids[idx]
            
            # Get Health
            c.execute("SELECT strength, last_accessed FROM memory_health WHERE id=?", (mid,))
            health_row = c.fetchone()
            
            retrievability = 1.0
            if health_row and not deep:
                strength, last_accessed = health_row
                retrievability = calculate_retrievability(last_accessed, strength)
            
            # Final Score
            # If Deep: Score = Similarity
            # If Normal: Score = Similarity * Retrievability
            final_score = similarity * retrievability
            
            if final_score < 0.15 and not deep:
                continue

            scored_results.append((mid, final_score, similarity, retrievability))
        
        # Sort by Final Score
        scored_results.sort(key=lambda x: x[1], reverse=True)
        top_k_results = scored_results[:10]

        for mid, final_score, sim, ret in top_k_results:
             # Select meta to join file path
            sql = """
                SELECT i.*, m.file_path 
                FROM memory_index i 
                JOIN memory_meta m ON i.id = m.id 
                WHERE i.id = ?
            """
            c.execute(sql, (mid,))
            row = c.fetchone()
            if row:
                res = dict(row)
                res['similarity'] = sim
                res['retrievability'] = ret
                res['score'] = final_score
                
                if not verbose:
                    # Token Optimization: Truncate content
                    res['snippet'] = res['content'][:200] + "..." if len(res['content']) > 200 else res['content']
                    del res['content'] # Remove full content
                results.append(res)
                
                # Reinforce "remembered" items slightly? 
                # No, only strictly if user acts on them. 
                # But for now, let's assume if it surfaced in search, it was "recalled".
                # To prevent spamming writes, we only touch if it's the exact match?
                # Actually, better to explicitly 'touch' via a read command.
                # But search IS a recall. Let's touch.
                touch(mid)

    else:
         # Fallback to simple list if no query
         sql = """
            SELECT i.*, m.file_path 
            FROM memory_index i 
            JOIN memory_meta m ON i.id = m.id 
            LIMIT 20
         """
         c.execute(sql)
         for r in c.fetchall():
             res = dict(r)
             if not verbose:
                 res['snippet'] = res['content'][:200] + "..." if len(res['content']) > 200 else res['content']
                 del res['content']
             results.append(res)
             touch(res['id']) # Reinforce

    # 2. Tag Filtering (Post-filter for now as simple implementation)
    if tag:
        results = [r for r in results if tag in r['tags']]

    print(json.dumps(results))

def connect(source, target, relation):
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO edges VALUES (?, ?, ?, ?)", 
              (source, target, relation, datetime.now().isoformat()))
    conn.commit()
    print(json.dumps({"status": "connected", "source": source, "target": target}))
    
def reset():
    """Wipes the database for a fresh project start."""
    if DB_PATH.exists():
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        backup_path = DB_PATH.with_suffix(f".{timestamp}.bak")
        try:
            import shutil
            shutil.copy(DB_PATH, backup_path)
            print(f"Backed up memory DB to {backup_path}")
        except Exception as e:
            print(f"Warning: Backup failed: {e}", file=sys.stderr)

        # Re-initialize (Drop & Recreate)
        # Simplest way is to delete the file
        os.remove(DB_PATH)
        init_db()
        print(json.dumps({"status": "reset", "message": "Memory database wiped and re-initialized."}))
    else:
        init_db()
        print(json.dumps({"status": "reset", "message": "Memory database initialized."}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command")
    
    rec_parser = subparsers.add_parser("record")
    rec_parser.add_argument("content")
    rec_parser.add_argument("--tags", default="")
    rec_parser.add_argument("--title", default="")
    
    upd_parser = subparsers.add_parser("update")
    upd_parser.add_argument("id")
    upd_parser.add_argument("--content")
    upd_parser.add_argument("--tags")
    upd_parser.add_argument("--title")
    
    search_parser = subparsers.add_parser("search")
    search_parser.add_argument("query")
    search_parser.add_argument("--tag")
    search_parser.add_argument("--verbose", "-v", action="store_true", help="Return full content")
    search_parser.add_argument("--deep", action="store_true", help="Ignore forgetting curve (fetch all relevant)")
    
    conn_parser = subparsers.add_parser("connect")
    conn_parser.add_argument("source")
    conn_parser.add_argument("target")
    conn_parser.add_argument("relation")
    
    reset_parser = subparsers.add_parser("reset")
    
    # STM Commands
    stm_write_parser = subparsers.add_parser("stm_write")
    stm_write_parser.add_argument("content")
    
    stm_read_parser = subparsers.add_parser("stm_read")
    
    con_parser = subparsers.add_parser("consolidate")

    args = parser.parse_args()
    
    if args.command == "record":
        record(args.content, args.tags, args.title)
    elif args.command == "update":
        update(args.id, args.content, args.tags, args.title)
    elif args.command == "search":
        search(args.query, args.tag, args.verbose, args.deep)
    elif args.command == "connect":
        connect(args.source, args.target, args.relation)
    elif args.command == "reset":
        reset()
    elif args.command == "stm_write":
        stm_write(args.content)
    elif args.command == "stm_read":
        stm_read()
    elif args.command == "consolidate":
        consolidate()
    else:
        parser.print_help()

