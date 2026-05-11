import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

export const connectDB = async(): Promise<NodePgDatabase> => {
    try {
        const db = drizzle(process.env.DATABASE_URL!);
        console.log("Database is connected ");
        return db;
    } catch (e: any) {
        console.error("Database connection error ::: ", e.message);
        throw e;
    }
}