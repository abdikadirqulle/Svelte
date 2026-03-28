import {
	doublePrecision,
	index,
	pgTable,
	serial,
	integer,
	text,
	timestamp
} from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export * from './auth.schema';

export const financeTransaction = pgTable(
	'finance_transaction',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		amount: doublePrecision('amount').notNull(),
		description: text('description').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('finance_transaction_user_id_idx').on(table.userId)]
);
