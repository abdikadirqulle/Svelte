import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { FINANCE_SESSION_COOKIE } from '$lib/server/finance-db';

export const load: LayoutServerLoad = async ({ locals }) => {
	return { financeUser: locals.financeUser ?? null };
};

export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete(FINANCE_SESSION_COOKIE, { path: '/' });
		redirect(303, '/login');
	}
};
