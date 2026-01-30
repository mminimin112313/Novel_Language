#!/usr/bin/env python3
import os
import json
import argparse
import time
import uuid
import glob
import re
import sqlite3
from pathlib import Path
from datetime import datetime

MEMORY_DIR = Path(".agent/memory")
NODES_DIR = MEMORY_DIR / "nodes"
DB_PATH = MEMORY_DIR / "memory_index.db"
NODES_DIR.mkdir(parents=True, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    # Create Main Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS memories (
            id TEXT PRIMARY KEY,
            title TEXT,
            content TEXT,
            tags TEXT,
            filepath TEXT,
            created_at TEXT,
            updated_at TEXT
        )
    ''')
    # Create FTS Table for full-text search
    c.execute('''
        CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
            id UNINDEXED,
            title,
            content,
            tags
        )
    ''')
    conn.commit()
    conn.close()

def sync_from_files():
    """Rebuilds the SQLite index from Markdown files."""
    init_db()
    conn = get_db()
    c = conn.cursor()
    
    # Clear existing
    c.execute('DELETE FROM memories')
    c.execute('DELETE FROM memories_fts')
    
    for filepath in NODES_DIR.glob("*.md"):
        try:
            content = filepath.read_text()
            if content.startswith("---"):
                parts = content.split("---", 2)
                if len(parts) >= 3:
                    fm_str = parts[1]
                    body = parts[2].strip()
                    try:
                        fm = json.loads(fm_str)
                        mid = fm.get("id")
                        tags = ",".join(fm.get("tags", []))
                        created_at = fm.get("created_at")
                        title = extract_title(body) or filepath.stem
                        
                        # Insert into main table
                        c.execute('''
                            INSERT INTO memories (id, title, content, tags, filepath, created_at, updated_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        ''', (mid, title, body, tags, str(filepath), created_at, datetime.now().isoformat()))
                        
                        # Insert into FTS table
                        c.execute('''
                            INSERT INTO memories_fts (id, title, content, tags)
                            VALUES (?, ?, ?, ?)
                        ''', (mid, title, body, tags))
                        
                    except Exception as e:
                        print(f"Error parsing {filepath}: {e}")
                        continue
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            continue
            
    conn.commit()
    conn.close()
    return "Index rebuilt."

def generate_id():
    return str(uuid.uuid4())[:8]

def slugify(text):
    return re.sub(r'[^a-zA-Z0-9-]', '-', text.lower()).strip('-')

def extract_title(body):
    match = re.search(r'^#\s+(.+)$', body.strip(), re.MULTILINE)
    return match.group(1) if match else None

def save_to_file(mid, title, content, tags, created_at, links=None):
    if links is None: links = []
    
    slug = slugify(title)
    filename = f"{mid}-{slug}.md"
    filepath = NODES_DIR / filename
    
    # If file exists with different name (title update), remove old one?
    # For now, let's keep it simple. If ID exists, we find the old file.
    
    frontmatter = {
        "id": mid,
        "type": "memory_node",
        "created_at": created_at,
        "updated_at": datetime.now().isoformat(),
        "tags": tags,
        "links": links
    }
    
    file_content = f"---\n{json.dumps(frontmatter, indent=2)}\n---\n\n# {title}\n\n{content}"
    filepath.write_text(file_content)
    return filepath

def update_db_entry(mid, title, content, tags, filepath, created_at):
    conn = get_db()
    c = conn.cursor()
    
    # Check if exists
    c.execute('SELECT 1 FROM memories WHERE id = ?', (mid,))
    exists = c.fetchone()
    
    if exists:
        c.execute('''
            UPDATE memories 
            SET title=?, content=?, tags=?, filepath=?, updated_at=?
            WHERE id=?
        ''', (title, content, tags, str(filepath), datetime.now().isoformat(), mid))
        
        # Update FTS (delete and re-insert is easiest for FTSv5)
        c.execute('DELETE FROM memories_fts WHERE id=?', (mid,))
        c.execute('''
            INSERT INTO memories_fts (id, title, content, tags)
            VALUES (?, ?, ?, ?)
        ''', (mid, title, content, tags))
    else:
        c.execute('''
            INSERT INTO memories (id, title, content, tags, filepath, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (mid, title, content, tags, str(filepath), created_at, datetime.now().isoformat()))
        
        c.execute('''
            INSERT INTO memories_fts (id, title, content, tags)
            VALUES (?, ?, ?, ?)
        ''', (mid, title, content, tags))
        
    conn.commit()
    conn.close()

def create_memory(content, tags, title=None):
    init_db() # Ensure DB exists
    mem_id = generate_id()
    timestamp = datetime.now().isoformat()
    
    if not title:
        title = " ".join(content.split()[:5]) + "..."
    
    # 1. Save File
    filepath = save_to_file(mem_id, title, content, tags, timestamp)
    
    # 2. Update DB (Cache)
    tag_str = ",".join(tags)
    update_db_entry(mem_id, title, content, tag_str, filepath, timestamp)
    
    return mem_id, filepath

def update_memory(mem_id, content=None, tags=None, title=None):
    init_db()
    # 1. Find existing file/data
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM memories WHERE id = ?', (mem_id,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        return False, "Memory not found"
        
    current_title = row['title']
    current_content = row['content']
    current_tags = row['tags'].split(',') if row['tags'] else []
    created_at = row['created_at']
    old_filepath = Path(row['filepath'])
    
    # 2. Apply updates
    new_title = title if title else current_title
    new_content = content if content else current_content
    new_tags = tags if tags else current_tags
    
    # 3. Write new file
    # If title changed, we might want to rename, but for safety let's just 
    # write to the *canonical* path logic (ID+slug). 
    # If the old file had a different name, we should remove it.
    
    new_filepath = save_to_file(mem_id, new_title, new_content, new_tags, created_at)
    
    if new_filepath != old_filepath and old_filepath.exists():
        old_filepath.unlink()
        
    # 4. Update DB
    update_db_entry(mem_id, new_title, new_content, ",".join(new_tags), new_filepath, created_at)
    
    return True, f"Updated memory {mem_id}"

def search_memories(query, tag=None):
    init_db()
    conn = get_db()
    c = conn.cursor()
    
    results = []
    
    if query:
        # Full Text Search
        # FTS5 syntax: MATCH 'query'
        # We need to sanitize inputs for FTS match
        c.execute('''
            SELECT * FROM memories_fts 
            WHERE memories_fts MATCH ? 
            ORDER BY rank
        ''', (query,))
    else:
        c.execute('SELECT * FROM memories')
        
    rows = c.fetchall()
    
    final_results = []
    for r in rows:
        # Filter by tag if needed (post-filter since tags are in CSV)
        # Note: We could do LIKE %tag% but exact tag split is safer
        r_tags = r['tags'].split(',') if r['tags'] else []
        if tag and tag not in r_tags:
            continue
            
        final_results.append({
            "id": r['id'],
            "title": r['title'],
            "content": r['content'], # Optional: maybe truncate
            "tags": r_tags
        })
        
    conn.close()
    return final_results

def connect_memories(source_id, target_id, relation):
    # For connections, we still modify the file
    # Then we should trigger a DB update for that file to keep things in sync?
    # Or just update the file. The Cache focuses on content/search.
    # Connections are graph data. Let's keep connections in files for now
    # and maybe eventually index them.
    
    # We reuse the logic from before but need to handle file finding via DB
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT filepath FROM memories WHERE id = ?', (source_id,))
    row = c.fetchone()
    conn.close()
    
    if not row: return False, "Source not found"
    
    filepath = Path(row['filepath'])
    if not filepath.exists(): return False, "Source file missing"
    
    # Update file content
    content = filepath.read_text()
    parts = content.split("---", 2)
    if len(parts) < 3: return False, "Invalid file format"
    
    fm = json.loads(parts[1])
    links = fm.get("links", [])
    links.append({"target_id": target_id, "relation": relation, "direction": "outgoing"})
    fm["links"] = links
    
    new_content = f"---\n{json.dumps(fm, indent=2)}\n---{parts[2]}"
    filepath.write_text(new_content)
    
    return True, f"Connected {source_id} -> {target_id}"

def main():
    parser = argparse.ArgumentParser(description="Project Memory Manager")
    subparsers = parser.add_subparsers(dest="command")
    
    # Record
    cmd_add = subparsers.add_parser("record")
    cmd_add.add_argument("content", help="Memory content")
    cmd_add.add_argument("--tags", help="Comma separated tags")
    cmd_add.add_argument("--title", help="Title")
    
    # Update
    cmd_upd = subparsers.add_parser("update")
    cmd_upd.add_argument("id", help="Memory ID")
    cmd_upd.add_argument("--content", help="New content")
    cmd_upd.add_argument("--tags", help="New tags")
    cmd_upd.add_argument("--title", help="New title")
    
    # Search
    cmd_search = subparsers.add_parser("search")
    cmd_search.add_argument("query", nargs="?", help="Search term")
    cmd_search.add_argument("--tag", help="Filter by tag")
    
    # Connect
    cmd_link = subparsers.add_parser("connect")
    cmd_link.add_argument("source", help="Source ID")
    cmd_link.add_argument("target", help="Target ID")
    cmd_link.add_argument("relation", help="Relationship type")
    
    # Sync
    subparsers.add_parser("sync")

    args = parser.parse_args()
    
    if args.command == "record":
        tags = args.tags.split(",") if args.tags else []
        mid, path = create_memory(args.content, tags, args.title)
        print(f"Recorded memory: {mid} at {path}")
        
    elif args.command == "update":
        tags = args.tags.split(",") if args.tags else None
        success, msg = update_memory(args.id, args.content, tags, args.title)
        print(msg)
        
    elif args.command == "search":
        results = search_memories(args.query, args.tag)
        print(json.dumps(results, indent=2))
        
    elif args.command == "connect":
        success, msg = connect_memories(args.source, args.target, args.relation)
        print(msg)
        
    elif args.command == "sync":
        print(sync_from_files())

if __name__ == "__main__":
    main()
