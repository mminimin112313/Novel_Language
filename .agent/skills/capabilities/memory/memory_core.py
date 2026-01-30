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

def init_db():
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)
    NODES_DIR.mkdir(parents=True, exist_ok=True)
    
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    
    # Enable FTS5
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
    pass # In a real implementation we might check for dupes, but UUID is fine.
    
    file_path = save_node(id, content, tags, title)
    
    conn = sqlite3.connect(str(DB_PATH))
    c = conn.cursor()
    
    c.execute("INSERT INTO memory_index (id, content, tags, title) VALUES (?, ?, ?, ?)",
              (id, content, ",".join(tags), title))
    c.execute("INSERT INTO memory_meta (id, created_at, updated_at, file_path) VALUES (?, ?, ?, ?)",
              (id, datetime.now().isoformat(), datetime.now().isoformat(), file_path))
    
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
    
    # Update DB
    c.execute("UPDATE memory_index SET content=?, tags=?, title=? WHERE id=?",
              (new_content, ",".join(new_tags), new_title, id))
    c.execute("UPDATE memory_meta SET updated_at=? WHERE id=?",
              (datetime.now().isoformat(), id))
              
    conn.commit()
    print(json.dumps({"id": id, "status": "updated"}))

def search(query, tag):
    init_db()
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    sql = "SELECT * FROM memory_index WHERE memory_index MATCH ? ORDER BY rank"
    params = [query]
    
    if tag:
        # FTS5 syntax for column filter is usually column:value
        # But we stored tags as comma separated string. Implementation detail: Simple containment check might fail for partial matches.
        # Ideally we'd fix the schema but for now let's just use FTS power
        sql = "SELECT * FROM memory_index WHERE memory_index MATCH ? AND tags MATCH ? ORDER BY rank"
        params = [query, tag]

    try:
        c.execute(sql, params)
    except sqlite3.OperationalError:
        # Fallback for empty query or syntax error
        if not query:
             print("[]")
             return

    rows = c.fetchall()
    results = []
    for r in rows:
        results.append(dict(r))
        
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
