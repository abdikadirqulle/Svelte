import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(303, '/dashboard');
	return {};
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		throw redirect(303, '/login');
	},

	signInEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { email, error: 'Email and password are required.' });
		}

		try {
			await auth.api.signInEmail({
				body: { email, password, callbackURL: '/dashboard' },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { email, error: error.message || 'Sign-in failed.' });
			}
			return fail(500, { email, error: 'Unexpected error.' });
		}

		throw redirect(303, '/dashboard');
	},

	signInSocial: async (event) => {
		const formData = await event.request.formData();
		const provider = formData.get('provider')?.toString() ?? 'github';
		const callbackURL = formData.get('callbackURL')?.toString() ?? '/dashboard';

		try {
			const result = await auth.api.signInSocial({
				body: {
					provider: provider as 'github',
					callbackURL
				},
				headers: event.request.headers
			});

			if (result.url) {
				throw redirect(302, result.url);
			}
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { error: error.message || 'Social sign-in failed.' });
			}
			throw error;
		}

		return fail(400, { error: 'Social sign-in failed.' });
	}
};
