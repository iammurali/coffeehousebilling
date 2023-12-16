import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import 'dotenv/config';




async function migrateFiles() {
    
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
    });
    
    const db = drizzle(connection, {
      schema,
      mode: 'planetscale',
    });
    // This will run migrations on the database, skipping the ones already applied
    await migrate(db, { migrationsFolder: './migrations' });
    
    // Don't forget to close the connection, otherwise the script will hang
    await connection.end();

}

migrateFiles()