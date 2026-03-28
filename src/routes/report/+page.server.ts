import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { listTransactionsForUser } from '$lib/server/finance-db';

export interface MonthReportRow {
	period: string;
	label: string;
	income: number;
	expenses: number;
	net: number;
	transactionCount: number;
}

function monthKey(d: Date): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(period: string): string {
	const [y, m] = period.split('-').map(Number);
	const date = new Date(y, m - 1, 1);
	return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date);
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const txs = await listTransactionsForUser(locals.user.id);
	const bucket = new Map<string, { income: number; expenses: number; count: number }>();

	for (const t of txs) {
		const key = monthKey(new Date(t.createdAt));
		const cur = bucket.get(key) ?? { income: 0, expenses: 0, count: 0 };
		cur.count += 1;
		if (t.type === 'income') cur.income += t.amount;
		else cur.expenses += t.amount;
		bucket.set(key, cur);
	}

	const monthly: MonthReportRow[] = [...bucket.entries()]
		.sort(([a], [b]) => b.localeCompare(a))
		.map(([period, v]) => ({
			period,
			label: monthLabel(period),
			income: v.income,
			expenses: v.expenses,
			net: v.income - v.expenses,
			transactionCount: v.count
		}));

	const totals = monthly.reduce(
		(acc, r) => {
			acc.income += r.income;
			acc.expenses += r.expenses;
			acc.net += r.net;
			acc.transactions += r.transactionCount;
			return acc;
		},
		{ income: 0, expenses: 0, net: 0, transactions: 0 }
	);

	return { monthly, totals, user: locals.user };
};
