import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(303, '/dashboard');
	return {};
};

export const actions: Actions = {
	signUpEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString() ?? '';

		if (!email || !password || !name.trim()) {
			return fail(400, { email, name, error: 'Name, email, and password are required.' });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name: name.trim(),
					callbackURL: '/dashboard'
				},
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { email, name, error: error.message || 'Could not create account.' });
			}
			return fail(500, { email, name, error: 'Unexpected error.' });
		}

		throw redirect(303, '/dashboard');
	}
};
