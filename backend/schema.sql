-- This schema is automatically executed by app.py on startup.
-- Included here for reference purposes.

CREATE TABLE IF NOT EXISTS scan_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    status TEXT NOT NULL,
    risk_score INTEGER NOT NULL,
    reasons TEXT NOT NULL,
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scan_date ON scan_history(scan_date);
CREATE INDEX IF NOT EXISTS idx_status ON scan_history(status);
CREATE INDEX IF NOT EXISTS idx_url ON scan_history(url);
