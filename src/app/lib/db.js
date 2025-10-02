import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Use /tmp directory for Vercel compatibility
// Note: This is temporary storage and data will be lost between deployments
const dataDir = process.env.NODE_ENV === 'production' 
  ? '/tmp'
  : path.join(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'queue.db');

let db;

function initializeDatabase() {
  try {
    db = new Database(dbPath);
    
    // Configure for better performance and reliability
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    // Initialize tables if they don't exist
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

      INSERT OR IGNORE INTO settings (key, value) VALUES ('currentNumber', '1');
    `);
    
    console.log('Database initialized successfully at:', dbPath);
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize database
db = initializeDatabase();

export default db;
