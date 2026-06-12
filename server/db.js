import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'data.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    guests INTEGER DEFAULT 0,
    companionNames TEXT DEFAULT '[]',
    tableNumber INTEGER DEFAULT 0,
    confirmed INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS confirmed (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    guests INTEGER DEFAULT 0,
    dietary TEXT DEFAULT '',
    message TEXT DEFAULT '',
    songs TEXT DEFAULT '',
    confirmedAt TEXT DEFAULT '',
    tableNumber INTEGER DEFAULT 0,
    checkedIn INTEGER DEFAULT 0,
    checkedInAt TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS tables_data (
    id TEXT PRIMARY KEY,
    number INTEGER DEFAULT 0,
    capacity INTEGER DEFAULT 8,
    x REAL DEFAULT 0,
    y REAL DEFAULT 0,
    w REAL DEFAULT 100,
    h REAL DEFAULT 100,
    rotation REAL DEFAULT 0,
    shape TEXT DEFAULT 'circle',
    type TEXT DEFAULT 'guest'
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

export default db;
