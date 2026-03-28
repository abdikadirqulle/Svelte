import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSummaryForUser } from '$lib/server/finance-db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.financeUser) throw redirect(303, '/login');

	const summary = getSummaryForUser(locals.financeUser.id);
	return {
		summary,
		user: locals.financeUser
	};
};
