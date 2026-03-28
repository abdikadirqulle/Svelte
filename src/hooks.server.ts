import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { FINANCE_SESSION_COOKIE } from '$lib/server/finance-db';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleFinanceSession: Handle = async ({ event, resolve }) => {
	const raw = event.cookies.get(FINANCE_SESSION_COOKIE);
	if (raw) {
		try {
			const parsed = JSON.parse(raw) as { id?: string; email?: string };
			if (parsed?.id && parsed?.email) {
				event.locals.financeUser = { id: parsed.id, email: parsed.email };
			}
		} catch {
			event.cookies.delete(FINANCE_SESSION_COOKIE, { path: '/' });
		}
	}
	return resolve(event);
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleFinanceSession, handleBetterAuth);
