import sqlite3 from 'sqlite3';
import { open, Database as SqliteDatabase } from 'sqlite';

// Open the SQLite database
export const initDb = async (): Promise<SqliteDatabase> => {
  return open({
    filename: './chatbot.db',
    driver: sqlite3.Database,
  });
};

// Create the table if it doesn't exist
export const createTable = async (db: SqliteDatabase) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      response TEXT NOT NULL,
      rating INTEGER
    );
  `);
};


// import sqlite3 from 'sqlite3';
// import { open, Database as SqliteDatabase } from 'sqlite';

// // Open the SQLite database
// export const initDb = async (): Promise<SqliteDatabase> => {
//   return open({
//     filename: './chatbot.db',
//     driver: sqlite3.Database,
//   });
// };

// // Create the table if it doesn't exist
// export const createTable = async (db: SqliteDatabase) => {
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS responses (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       prompt TEXT NOT NULL,
//       response TEXT NOT NULL,
//       rating INTEGER
//     );
//   `);
// };
