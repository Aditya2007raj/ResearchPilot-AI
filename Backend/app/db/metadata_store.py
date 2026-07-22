import sqlite3
import os
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from ..config import settings

DB_PATH = os.path.join(os.path.dirname(settings.upload_dir), "metadata.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite metadata tables and handle schema migrations."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            profile_picture TEXT,
            bio TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("PRAGMA table_info(users)")
    existing_user_columns = [row["name"] for row in cursor.fetchall()]
    if "bio" not in existing_user_columns:
        cursor.execute("ALTER TABLE users ADD COLUMN bio TEXT")
    
    # 2. Create papers table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS papers (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT,
            authors TEXT,
            year TEXT,
            upload_time TIMESTAMP,
            file_path TEXT,
            research_health TEXT,
            favorite BOOLEAN DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    # Check for missing columns dynamically in papers table
    cursor.execute("PRAGMA table_info(papers)")
    existing_columns = [row["name"] for row in cursor.fetchall()]
    
    if "user_id" not in existing_columns:
        cursor.execute("ALTER TABLE papers ADD COLUMN user_id TEXT")
        
    if "page_count" not in existing_columns:
        cursor.execute("ALTER TABLE papers ADD COLUMN page_count INTEGER DEFAULT 0")
        
    if "reading_time_minutes" not in existing_columns:
        cursor.execute("ALTER TABLE papers ADD COLUMN reading_time_minutes INTEGER DEFAULT 0")
        
    # 3. Create chat_history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            paper_id TEXT NOT NULL,
            message TEXT NOT NULL,
            role TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (paper_id) REFERENCES papers(id)
        )
    """)

    # 4. Create favorites table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            paper_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (paper_id) REFERENCES papers(id),
            UNIQUE(user_id, paper_id)
        )
    """)
        
    conn.commit()
    conn.close()

# --- USER OPERATIONS ---

def create_user(user_id: str, full_name: str, email: str, password_hash: str, profile_picture: Optional[str] = None, bio: Optional[str] = None) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT INTO users (id, full_name, email, password_hash, profile_picture, bio, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, full_name, email, password_hash, profile_picture, bio, now, now))
    conn.commit()
    conn.close()
    return {
        "id": user_id,
        "full_name": full_name,
        "email": email,
        "profile_picture": profile_picture,
        "bio": bio,
        "created_at": now,
        "updated_at": now
    }

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def update_user_profile(user_id: str, full_name: str, bio: Optional[str] = None) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        UPDATE users
        SET full_name = ?, bio = ?, updated_at = ?
        WHERE id = ?
    """, (full_name, bio, now, user_id))
    conn.commit()
    conn.close()
    return get_user_by_id(user_id)

def update_user_avatar(user_id: str, profile_picture: Optional[str]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        UPDATE users
        SET profile_picture = ?, updated_at = ?
        WHERE id = ?
    """, (profile_picture, now, user_id))
    conn.commit()
    conn.close()
    return get_user_by_id(user_id)

def update_user_password(user_id: str, password_hash: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        UPDATE users
        SET password_hash = ?, updated_at = ?
        WHERE id = ?
    """, (password_hash, now, user_id))
    conn.commit()
    conn.close()
    return True

# --- PAPER OPERATIONS ---

def add_paper(paper_id: str, user_id: str, title: str, authors: str, year: str, file_path: str, health: str = "Fully Analyzed", page_count: int = 0, reading_time_minutes: int = 0):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO papers (id, user_id, title, authors, year, upload_time, file_path, research_health, favorite, page_count, reading_time_minutes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    """, (paper_id, user_id, title, authors, year, datetime.utcnow().isoformat(), file_path, health, page_count, reading_time_minutes))
    conn.commit()
    conn.close()

def get_all_papers(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, 
               CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as favorite,
               f.created_at as favorite_since
        FROM papers p
        LEFT JOIN favorites f ON p.id = f.paper_id AND f.user_id = p.user_id
        WHERE p.user_id = ?
        ORDER BY p.upload_time DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_paper_by_id_and_user(paper_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, 
               CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as favorite,
               f.created_at as favorite_since
        FROM papers p
        LEFT JOIN favorites f ON p.id = f.paper_id AND f.user_id = p.user_id
        WHERE p.id = ? AND p.user_id = ?
    """, (paper_id, user_id))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_paper_stats(user_id: str) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM papers WHERE user_id = ?", (user_id,))
    total = cursor.fetchone()["total"]
    
    cursor.execute("SELECT COUNT(*) as analyzed FROM papers WHERE user_id = ? AND research_health = 'Fully Analyzed'", (user_id,))
    analyzed = cursor.fetchone()["analyzed"]
    
    cursor.execute("SELECT COUNT(*) as favorites FROM favorites WHERE user_id = ?", (user_id,))
    favorites = cursor.fetchone()["favorites"]
    
    conn.close()
    return {
        "total_papers": total,
        "analyses_generated": analyzed,
        "active_workspaces": total,
        "favorites": favorites
    }

# --- FAVORITES OPERATIONS ---

def add_favorite(user_id: str, paper_id: str) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    fav_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT OR IGNORE INTO favorites (id, user_id, paper_id, created_at)
        VALUES (?, ?, ?, ?)
    """, (fav_id, user_id, paper_id, now))
    cursor.execute("UPDATE papers SET favorite = 1 WHERE id = ? AND user_id = ?", (paper_id, user_id))
    conn.commit()
    conn.close()
    return {"id": fav_id, "user_id": user_id, "paper_id": paper_id, "created_at": now}

def remove_favorite(user_id: str, paper_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM favorites WHERE user_id = ? AND paper_id = ?", (user_id, paper_id))
    cursor.execute("UPDATE papers SET favorite = 0 WHERE id = ? AND user_id = ?", (paper_id, user_id))
    conn.commit()
    conn.close()
    return True

def get_user_favorites(user_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, 1 as favorite, f.created_at as favorite_since
        FROM favorites f
        JOIN papers p ON f.paper_id = p.id AND f.user_id = p.user_id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# --- CHAT HISTORY OPERATIONS ---

def add_chat_message(message_id: str, user_id: str, paper_id: str, role: str, message: str) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT INTO chat_history (id, user_id, paper_id, role, message, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (message_id, user_id, paper_id, role, message, now))
    conn.commit()
    conn.close()
    return {
        "id": message_id,
        "user_id": user_id,
        "paper_id": paper_id,
        "role": role,
        "message": message,
        "timestamp": now
    }

def get_chat_history_for_paper(user_id: str, paper_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM chat_history WHERE user_id = ? AND paper_id = ? ORDER BY timestamp ASC", (user_id, paper_id))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
