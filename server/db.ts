/* Setup Database: */

import { DatabaseSync } from 'node:sqlite';

export function initDB(dbPath: string): DatabaseSync {
    const database = new DatabaseSync(dbPath);

    /* a. Create Table */
    const query = `
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL
        )
    `;

    /* b. Execute Query */ 
    database.exec(query);

    return database;
}