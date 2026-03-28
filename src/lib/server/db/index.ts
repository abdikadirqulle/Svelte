import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const databaseUrl = env.DATABASE_URL;

/** Supabase and many hosted Postgres URLs require TLS. */
const needsSsl =
	databaseUrl.includes('supabase.co') ||
	databaseUrl.includes('sslmode=require') ||
	databaseUrl.includes('ssl=true');

const pool = new pg.Pool({
	connectionString: databaseUrl,
	max: 10,
	...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {})
});

export const db = drizzle(pool, { schema });
