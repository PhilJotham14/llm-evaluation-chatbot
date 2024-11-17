import sqlite3 from 'sqlite3';
import { open, Database as SqliteDatabase } from 'sqlite';

export const initDb = async (): Promise<SqliteDatabase> => {
  return open({
    filename: './chatbot.db',
    driver: sqlite3.Database,
  });
};

export const createTable = async (db: SqliteDatabase) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      response TEXT NOT NULL
    );
  `);
};
