import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

if(!process.env.DATABASE_URL) {
    throw new Error("❌ DATABASE_URL missing from environment variables!")
}

const pool = new pg.Pool(
    {
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    }
)

pool.on('connect', () => {
    console.log('🐘 PostgreSQL connection pool initialized successfully.');
})

pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle PostgreSQL client:', err);
});

export const db = drizzle(pool);