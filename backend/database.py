import sqlite3
import json
import datetime
import os
from contextlib import contextmanager

# Conditionally import psycopg2 for PostgreSQL support
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

class DatabaseManager:
    def __init__(self, db_path):
        self.db_path = db_path
        # Check if the connection string points to a PostgreSQL database
        self.is_postgres = db_path.startswith('postgres://') or db_path.startswith('postgresql://')
        if self.is_postgres and not HAS_POSTGRES:
            raise ImportError("psycopg2-binary is required for PostgreSQL connections but is not installed.")

    @contextmanager
    def get_connection(self):
        if self.is_postgres:
            # PostgreSQL URL standard mapping (Vercel uses postgres://, psycopg2 needs postgresql:// sometimes)
            conn_str = self.db_path
            if conn_str.startswith('postgres://'):
                conn_str = conn_str.replace('postgres://', 'postgresql://', 1)
            conn = psycopg2.connect(conn_str)
            try:
                yield conn
            finally:
                conn.commit()
                conn.close()
        else:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                yield conn
            finally:
                conn.commit()
                conn.close()

    def get_cursor(self, conn):
        if self.is_postgres:
            return conn.cursor(cursor_factory=RealDictCursor)
        else:
            return conn.cursor()

    def convert_placeholder(self, query):
        if self.is_postgres:
            return query.replace('?', '%s')
        return query

def init_db(db_path):
    db = DatabaseManager(db_path)
    with db.get_connection() as conn:
        cursor = db.get_cursor(conn)
        if db.is_postgres:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS scan_history (
                    id SERIAL PRIMARY KEY,
                    url TEXT NOT NULL,
                    status TEXT NOT NULL,
                    risk_score INTEGER NOT NULL,
                    reasons TEXT NOT NULL,
                    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    category TEXT
                )
            ''')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_scan_date ON scan_history(scan_date);')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_status ON scan_history(status);')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_url ON scan_history(url);')
        else:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS scan_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT NOT NULL,
                    status TEXT NOT NULL,
                    risk_score INTEGER NOT NULL,
                    reasons TEXT NOT NULL,
                    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    category TEXT
                )
            ''')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_scan_date ON scan_history(scan_date);')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_status ON scan_history(status);')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_url ON scan_history(url);')

def format_row(row, is_postgres):
    if row is None:
        return None
    d = dict(row)
    if 'scan_date' in d and isinstance(d['scan_date'], (datetime.datetime, datetime.date)):
        d['scan_date'] = d['scan_date'].isoformat()
    return d

def insert_scan(db_path, url, status, risk_score, reasons, category="General"):
    db = DatabaseManager(db_path)
    with db.get_connection() as conn:
        cursor = db.get_cursor(conn)
        if db.is_postgres:
            cursor.execute(
                '''
                INSERT INTO scan_history (url, status, risk_score, reasons, category)
                VALUES (%s, %s, %s, %s, %s) RETURNING id
                ''',
                (url, status, risk_score, json.dumps(reasons), category)
            )
            row = cursor.fetchone()
            return row['id']
        else:
            cursor.execute(
                '''
                INSERT INTO scan_history (url, status, risk_score, reasons, category)
                VALUES (?, ?, ?, ?, ?)
                ''',
                (url, status, risk_score, json.dumps(reasons), category)
            )
            return cursor.lastrowid

def get_stats(db_path):
    db = DatabaseManager(db_path)
    with db.get_connection() as conn:
        cursor = db.get_cursor(conn)
        
        # Get total scans
        cursor.execute('SELECT COUNT(*) as count FROM scan_history')
        total_scans = cursor.fetchone()['count']
        
        # Get counts by status
        cursor.execute('SELECT status, COUNT(*) as count FROM scan_history GROUP BY status')
        status_counts = {row['status']: row['count'] for row in cursor.fetchall()}
        
        # Get categories for pie chart
        cursor.execute("SELECT category, COUNT(*) as count FROM scan_history WHERE status = 'Phishing' GROUP BY category")
        category_counts = {row['category']: row['count'] for row in cursor.fetchall()}
        
        # Monthly trends
        month_func = "to_char(scan_date, 'YYYY-MM')" if db.is_postgres else "strftime('%Y-%m', scan_date)"
        placeholder = "%s" if db.is_postgres else "?"
        
        cursor.execute(f'''
            SELECT {month_func} as month, COUNT(*) as count 
            FROM scan_history 
            WHERE status = 'Phishing'
            GROUP BY month 
            ORDER BY month DESC LIMIT {placeholder}
        ''', (6,))
        monthly_trends = {row['month']: row['count'] for row in cursor.fetchall()}

        # Scan growth
        cursor.execute(f'''
            SELECT {month_func} as month, COUNT(*) as count 
            FROM scan_history 
            GROUP BY month 
            ORDER BY month ASC
        ''')
        scan_growth = {row['month']: row['count'] for row in cursor.fetchall()}

        return {
            'total_scanned': total_scans,
            'phishing_detected': status_counts.get('Phishing', 0),
            'safe_websites': status_counts.get('Safe', 0),
            'suspicious_websites': status_counts.get('Suspicious', 0),
            'categories': category_counts,
            'monthly_trends': monthly_trends,
            'scan_growth': scan_growth
        }

def get_recent_scans(db_path, limit=10):
    db = DatabaseManager(db_path)
    with db.get_connection() as conn:
        cursor = db.get_cursor(conn)
        query = '''
            SELECT id, url, status, risk_score, scan_date 
            FROM scan_history 
            ORDER BY scan_date DESC LIMIT ?
        '''
        cursor.execute(db.convert_placeholder(query), (limit,))
        return [format_row(row, db.is_postgres) for row in cursor.fetchall()]

def get_history(db_path, page=1, per_page=20, search_query=None):
    db = DatabaseManager(db_path)
    offset = (page - 1) * per_page
    
    with db.get_connection() as conn:
        cursor = db.get_cursor(conn)
        
        if search_query:
            query = '''
                SELECT id, url, status, risk_score, scan_date 
                FROM scan_history 
                WHERE url LIKE ? 
                ORDER BY scan_date DESC LIMIT ? OFFSET ?
            '''
            cursor.execute(db.convert_placeholder(query), (f'%{search_query}%', per_page, offset))
            
            count_query = 'SELECT COUNT(*) as count FROM scan_history WHERE url LIKE ?'
            cursor.execute(db.convert_placeholder(count_query), (f'%{search_query}%',))
        else:
            query = '''
                SELECT id, url, status, risk_score, scan_date 
                FROM scan_history 
                ORDER BY scan_date DESC LIMIT ? OFFSET ?
            '''
            cursor.execute(db.convert_placeholder(query), (per_page, offset))
            
            count_query = 'SELECT COUNT(*) as count FROM scan_history'
            cursor.execute(db.convert_placeholder(count_query))
            
        items = [format_row(row, db.is_postgres) for row in cursor.fetchall()]
        total_items = cursor.fetchone()['count']
        
        return {
            'items': items,
            'total': total_items,
            'page': page,
            'per_page': per_page,
            'total_pages': (total_items + per_page - 1) // per_page
        }
