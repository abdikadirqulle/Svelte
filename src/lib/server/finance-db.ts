/**
 * In-memory finance data. Swap this module for a real database when ready.
 * Note: this repo already uses `$lib/server/db` for Drizzle/better-auth, so this file is named `finance-db.ts`.
 */
export const FINANCE_SESSION_COOKIE = 'finance_session';
export interface Transaction {
	id: string;
	type: 'income' | 'expense';
	amount: number;
	description: string;
	createdAt: string;
	userId: string;
}

interface MockUser {
	id: string;
	email: string;
	password: string;
}

const users: MockUser[] = [
	{ id: 'user-1', email: 'demo@example.com', password: 'demo12345' },
	{ id: 'user-2', email: 'test@example.com', password: 'password' }
];

let transactions: Transaction[] = [
	{
		id: crypto.randomUUID(),
		type: 'income',
		amount: 3500,
		description: 'Salary',
		createdAt: new Date().toISOString(),
		userId: 'user-1'
	},
	{
		id: crypto.randomUUID(),
		type: 'expense',
		amount: 89.5,
		description: 'Groceries',
		createdAt: new Date().toISOString(),
		userId: 'user-1'
	}
];

export function findUserByCredentials(
	email: string,
	password: string
): Pick<MockUser, 'id' | 'email'> | null {
	const user = users.find((u) => u.email === email && u.password === password);
	if (!user) return null;
	return { id: user.id, email: user.email };
}

export function listTransactionsForUser(userId: string): Transaction[] {
	return transactions
		.filter((t) => t.userId === userId)
		.slice()
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addTransaction(
	userId: string,
	input: { type: 'income' | 'expense'; amount: number; description: string }
): Transaction {
	const row: Transaction = {
		id: crypto.randomUUID(),
		type: input.type,
		amount: input.amount,
		description: input.description.trim(),
		createdAt: new Date().toISOString(),
		userId
	};
	transactions = [row, ...transactions];
	return row;
}

export function deleteTransaction(userId: string, id: string): boolean {
	const before = transactions.length;
	transactions = transactions.filter((t) => !(t.id === id && t.userId === userId));
	return transactions.length < before;
}

export function getSummaryForUser(userId: string): {
	totalIncome: number;
	totalExpenses: number;
	balance: number;
} {
	const mine = transactions.filter((t) => t.userId === userId);
	let totalIncome = 0;
	let totalExpenses = 0;
	for (const t of mine) {
		if (t.type === 'income') totalIncome += t.amount;
		else totalExpenses += t.amount;
	}
	return {
		totalIncome,
		totalExpenses,
		balance: totalIncome - totalExpenses
	};
}
