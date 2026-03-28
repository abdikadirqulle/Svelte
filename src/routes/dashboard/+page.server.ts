import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSummaryForUser, listTransactionsForUser } from '$lib/server/finance-db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.financeUser) throw redirect(303, '/login');

	const summary = getSummaryForUser(locals.financeUser.id);
	const all = listTransactionsForUser(locals.financeUser.id);
	const recentTransactions = all.slice(0, 5);

	const incomeSafe = summary.totalIncome > 0 ? summary.totalIncome : null;
	const spendPercentOfIncome =
		incomeSafe !== null ? Math.min(100, (summary.totalExpenses / incomeSafe) * 100) : null;
	const netPercentOfIncome =
		incomeSafe !== null ? (summary.balance / incomeSafe) * 100 : null;

	return {
		summary,
		user: locals.financeUser,
		recentTransactions,
		stats: {
			transactionCount: all.length,
			spendPercentOfIncome,
			netPercentOfIncome
		}
	};
};
