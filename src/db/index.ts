import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Pro produkční prostředí
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Pro vývojové prostředí - používáme connection pool
const queryClient = postgres(connectionString, { max: 1 });
export const queryDb = drizzle(queryClient, { schema }); 