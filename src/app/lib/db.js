import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'queue.db');

let db;

try {
  db = new Database(dbPath);
  
  // Initialize tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER NOT NULL,
      name1 TEXT NOT NULL,
      name2 TEXT,
      notes TEXT,
      status TEXT NOT NULL,
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

    INSERT OR IGNORE INTO settings (key, value) VALUES ('currentNumber', '1');
  `);
} catch (error) {
  console.error('Database initialization error:', error);
}

export default db;
