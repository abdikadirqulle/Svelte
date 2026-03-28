import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

/**
 * Supabase "Session" pooler (PgBouncer, often :6543) runs in transaction mode and
 * breaks prepared statements. postgres-js + Drizzle use those by default → cryptic
 * "Failed query" on inserts. `prepare: false` fixes it. Direct :5432 connections work too.
 */
const client = postgres(env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
