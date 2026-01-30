#!/usr/bin/env python3
import argparse
import sqlite3
import os
import sys
import json
import uuid
from datetime import datetime
from pathlib import Path
import numpy as np

# Configuration
MEMORY_DIR = Path(os.path.dirname(os.path.realpath(__file__))).parent.parent.parent / "memory"
NODES_DIR = MEMORY_DIR / "nodes"
DB_PATH = MEMORY_DIR / "memory_index.db"

# Global model variable for lazy loading
_model = None

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

def record(content, tags_str, title):
    init_db()
    
    tags = [t.strip() for t in tags_str.split(',') if t.strip()]
    id = str(uuid.uuid4())
    
    file_path = save_node(id, content, tags, title)
    
    # Generate embedding
    embedding = get_embedding(content).tobytes()
    
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    
    c.execute("INSERT INTO memory_index (id, content, tags, title) VALUES (?, ?, ?, ?)",
              (id, content, ",".join(tags), title))
    c.execute("INSERT INTO memory_meta (id, created_at, updated_at, file_path) VALUES (?, ?, ?, ?)",
              (id, datetime.now().isoformat(), datetime.now().isoformat(), file_path))
    c.execute("INSERT OR REPLACE INTO memory_embeddings (id, embedding) VALUES (?, ?)",
              (id, embedding))
    
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
    print(json.dumps({"id": id, "status": "updated"}))

def cosine_similarity(v1, v2):
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return np.dot(v1, v2) / (norm1 * norm2)

def search(query, tag):
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
        scores = np.dot(embeddings_matrix, query_vec)
        
        # Get top K indices
        top_k = min(10, len(scores))
        top_indices = np.argsort(scores)[::-1][:top_k]
        
        for idx in top_indices:
            score = scores[idx]
            if score < 0.3: # Threshold
                continue
                
            mid = ids[idx]
            sql = "SELECT * FROM memory_index WHERE id = ?"
            c.execute(sql, (mid,))
            row = c.fetchone()
            if row:
                res = dict(row)
                res['similarity'] = float(score)
                results.append(res)
    else:
         # Fallback to simple list if no query
         c.execute("SELECT * FROM memory_index LIMIT 20")
         for r in c.fetchall():
             results.append(dict(r))

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
    
    conn_parser = subparsers.add_parser("connect")
    conn_parser.add_argument("source")
    conn_parser.add_argument("target")
    conn_parser.add_argument("relation")

    args = parser.parse_args()
    
    if args.command == "record":
        record(args.content, args.tags, args.title)
    elif args.command == "update":
        update(args.id, args.content, args.tags, args.title)
    elif args.command == "search":
        search(args.query, args.tag)
    elif args.command == "connect":
        connect(args.source, args.target, args.relation)
    else:
        parser.print_help()
