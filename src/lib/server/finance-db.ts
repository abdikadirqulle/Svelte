import { randomUUID } from 'node:crypto';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { financeTransaction } from '$lib/server/db/schema';

export interface Transaction {
	id: string;
	type: 'income' | 'expense';
	amount: number;
	description: string;
	createdAt: string;
	userId: string;
}

function mapRow(row: typeof financeTransaction.$inferSelect): Transaction {
	return {
		id: row.id,
		type: row.type === 'income' ? 'income' : 'expense',
		amount: row.amount,
		description: row.description,
		createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
		userId: row.userId
	};
}

export async function listTransactionsForUser(userId: string): Promise<Transaction[]> {
	const rows = await db
		.select()
		.from(financeTransaction)
		.where(eq(financeTransaction.userId, userId))
		.orderBy(desc(financeTransaction.createdAt));
	return rows.map(mapRow);
}

export async function addTransaction(
	userId: string,
	input: { type: 'income' | 'expense'; amount: number; description: string }
): Promise<Transaction> {
	const id = randomUUID();
	const values = {
		id,
		userId,
		type: input.type,
		amount: input.amount,
		description: input.description.trim()
	};
	const [row] = await db.insert(financeTransaction).values(values).returning();
	if (!row) throw new Error('Insert failed');
	return mapRow(row);
}

export async function deleteTransaction(userId: string, id: string): Promise<boolean> {
	const res = await db
		.delete(financeTransaction)
		.where(and(eq(financeTransaction.id, id), eq(financeTransaction.userId, userId)))
		.returning({ id: financeTransaction.id });
	return res.length > 0;
}

export async function getSummaryForUser(userId: string): Promise<{
	totalIncome: number;
	totalExpenses: number;
	balance: number;
}> {
	const [row] = await db
		.select({
			totalIncome: sql<number>`coalesce(sum(case when ${financeTransaction.type} = 'income' then ${financeTransaction.amount} else 0 end), 0)`,
			totalExpenses: sql<number>`coalesce(sum(case when ${financeTransaction.type} = 'expense' then ${financeTransaction.amount} else 0 end), 0)`
		})
		.from(financeTransaction)
		.where(eq(financeTransaction.userId, userId));

	const totalIncome = Number(row?.totalIncome ?? 0);
	const totalExpenses = Number(row?.totalExpenses ?? 0);
	return {
		totalIncome,
		totalExpenses,
		balance: totalIncome - totalExpenses
	};
}
