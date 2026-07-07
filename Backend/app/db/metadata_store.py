import sqlite3
import os
from datetime import datetime
from ..config import settings

DB_PATH = os.path.join(os.path.dirname(settings.upload_dir), "metadata.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the SQLite metadata table and handle schema migrations."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Create table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS papers (
            id TEXT PRIMARY KEY,
            title TEXT,
            authors TEXT,
            year TEXT,
            upload_time TIMESTAMP,
            file_path TEXT,
            research_health TEXT,
            favorite BOOLEAN DEFAULT 0
        )
    """)
    
    # 2. Check for missing columns dynamically and apply migrations
    cursor.execute("PRAGMA table_info(papers)")
    existing_columns = [row["name"] for row in cursor.fetchall()]
    
    if "page_count" not in existing_columns:
        cursor.execute("ALTER TABLE papers ADD COLUMN page_count INTEGER DEFAULT 0")
        
    if "reading_time_minutes" not in existing_columns:
        cursor.execute("ALTER TABLE papers ADD COLUMN reading_time_minutes INTEGER DEFAULT 0")
        
    conn.commit()
    conn.close()

def add_paper(paper_id: str, title: str, authors: str, year: str, file_path: str, health: str = "Fully Analyzed", page_count: int = 0, reading_time_minutes: int = 0):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO papers (id, title, authors, year, upload_time, file_path, research_health, favorite, page_count, reading_time_minutes)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    """, (paper_id, title, authors, year, datetime.utcnow(), file_path, health, page_count, reading_time_minutes))
    conn.commit()
    conn.close()

def get_all_papers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM papers ORDER BY upload_time DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_paper_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM papers")
    total = cursor.fetchone()["total"]
    
    cursor.execute("SELECT COUNT(*) as analyzed FROM papers WHERE research_health = 'Fully Analyzed'")
    analyzed = cursor.fetchone()["analyzed"]
    
    cursor.execute("SELECT COUNT(*) as favorites FROM papers WHERE favorite = 1")
    favorites = cursor.fetchone()["favorites"]
    
    conn.close()
    return {
        "total_papers": total,
        "analyses_generated": analyzed,
        "active_workspaces": total,
        "favorites": favorites
    }
