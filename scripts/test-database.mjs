/**
 * Run: npm run db:test
 * Checks DATABASE_URL from .env (via dotenv) and lists public tables.
 */
import 'dotenv/config';
import dns from 'node:dns/promises';
import pg from 'pg';

const rawUrl = process.env.DATABASE_URL?.trim();
if (!rawUrl) {
	console.error('DATABASE_URL is missing. Add it to .env in the project root.');
	process.exit(1);
}

/** Parse host from URI for debugging (no password printed). */
function parsedHost(connectionString) {
	try {
		const normalized = connectionString.trim().replace(/^postgres(ql)?:\/\//i, 'http://');
		return new URL(normalized).hostname;
	} catch {
		return null;
	}
}

const host = parsedHost(rawUrl);
if (!host) {
	console.error('Could not parse DATABASE_URL. Encode special characters in the password (@ → %40, # → %23).');
	process.exit(1);
}

console.log('DATABASE_URL host (compare with Supabase → Database → Host):', host);

try {
	const addresses = await dns.lookup(host, { all: true });
	console.log('DNS lookup OK:', addresses.map((a) => a.address).join(', '));
} catch (dnsErr) {
	console.error('DNS lookup FAILED for', host, '→', dnsErr.message);
	console.error('');
	console.error('Fix ENOTFOUND:');
	console.error('  1) Supabase → Settings → General → "Reference ID" must equal the part after db. in db.<REF>.supabase.co');
	console.error('  2) Settings → Database → copy the Host field again (no spaces / line breaks in .env).');
	console.error('  3) PowerShell: nslookup', host, '8.8.8.8   — if that works, set Windows DNS to 8.8.8.8');
	console.error('  4) Try the Session pooler host from Supabase (aws-0-....pooler.supabase.com) if direct db.* never resolves.');
	process.exit(1);
}

const needsSsl =
	rawUrl.includes('supabase.co') ||
	rawUrl.includes('pooler.supabase.com') ||
	rawUrl.includes('sslmode=require') ||
	rawUrl.includes('ssl=true');

const pool = new pg.Pool({
	connectionString: rawUrl,
	max: 1,
	...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {})
});

try {
	const ping = await pool.query('select 1 as ok');
	console.log('Connection:', ping.rows[0]?.ok === 1 ? 'OK' : ping.rows);

	const tables = await pool.query(`
		select table_name
		from information_schema.tables
		where table_schema = 'public' and table_type = 'BASE TABLE'
		order by table_name;
	`);
	const names = tables.rows.map((r) => r.table_name);
	console.log(
		'Public tables (' + names.length + '):',
		names.length ? names.join(', ') : '(none — run npm run db:push)'
	);

	const need = ['user', 'session', 'account', 'verification', 'finance_transaction'];
	const missing = need.filter((n) => !names.includes(n));
	if (missing.length) {
		console.warn('Missing expected tables:', missing.join(', '));
		console.warn('Run: npm run db:push');
		process.exitCode = 2;
	}
} catch (err) {
	console.error('FAILED:', err.message);
	if (err.cause) console.error('Cause:', err.cause);
	process.exit(1);
} finally {
	await pool.end();
}
