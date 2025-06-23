import BetterSqlite3 from 'better-sqlite3';
import { join } from 'path';
import fs from 'fs';

// Make sure the database directory exists
const dbDir = join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize the database
const dbPath = join(dbDir, 'queue.db');
const db = new BetterSqlite3(dbPath);

// Enable foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER NOT NULL,
    name1 TEXT NOT NULL,
    name2 TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'waiting',
    position INTEGER NOT NULL,
    joinedAt TEXT NOT NULL,
    processingStartedAt TEXT,
    completedAt TEXT,
    cancelledAt TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Initialize settings if not present
const currentNumberExists = db.prepare('SELECT COUNT(*) as count FROM settings WHERE key = ?').get('currentNumber');
if (!currentNumberExists.count) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('currentNumber', '1');
}

// Export the database instance
export default db;
