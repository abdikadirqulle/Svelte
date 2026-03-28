import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSummaryForUser, listTransactionsForUser } from '$lib/server/finance-db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const summary = await getSummaryForUser(locals.user.id);
	const all = await listTransactionsForUser(locals.user.id);
	const recentTransactions = all.slice(0, 5);

	const incomeSafe = summary.totalIncome > 0 ? summary.totalIncome : null;
	const spendPercentOfIncome =
		incomeSafe !== null ? Math.min(100, (summary.totalExpenses / incomeSafe) * 100) : null;
	const netPercentOfIncome = incomeSafe !== null ? (summary.balance / incomeSafe) * 100 : null;

	return {
		summary,
		user: locals.user,
		recentTransactions,
		stats: {
			transactionCount: all.length,
			spendPercentOfIncome,
			netPercentOfIncome
		}
	};
};
