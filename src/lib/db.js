import BetterSqlite3 from 'better-sqlite3';
import { join } from 'path';
import fs from 'fs';

// Use /tmp directory for Vercel compatibility
// Note: This is temporary storage and data will be lost between deployments
const dbDir = process.env.NODE_ENV === 'production' 
  ? '/tmp'
  : join(process.cwd(), 'data');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize the database
const dbPath = join(dbDir, 'queue.db');
const db = new BetterSqlite3(dbPath);

// Enable foreign keys and optimize for serverless
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 1000');
db.pragma('temp_store = memory');

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
    cancelledAt TEXT,
    resetDate TEXT DEFAULT NULL
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
