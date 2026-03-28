import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { findUserByCredentials, FINANCE_SESSION_COOKIE } from '$lib/server/finance-db';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.financeUser) throw redirect(303, '/dashboard');
	return {};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete(FINANCE_SESSION_COOKIE, { path: '/' });
		redirect(303, '/login');
	},

	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '').trim();
		const password = String(data.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { email, error: 'Email and password are required.' });
		}

		const user = findUserByCredentials(email, password);
		if (!user) {
			return fail(400, { email, error: 'Invalid email or password.' });
		}

		cookies.set(FINANCE_SESSION_COOKIE, JSON.stringify({ id: user.id, email: user.email }), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, '/dashboard');
	}
};
