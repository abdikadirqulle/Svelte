import {
	doublePrecision,
	index,
	pgTable,
	serial,
	integer,
	text,
	timestamp,
	numeric,
	unique,
	pgEnum,
	date
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
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

// ─── ERP: Enums ────────────────────────────────────────────────────────────────

export const saleStatusEnum = pgEnum('sale_status', ['PENDING', 'COMPLETED', 'CANCELLED']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['PAID', 'UNPAID']);

// ─── ERP: Product ──────────────────────────────────────────────────────────────

export const erpProduct = pgTable(
	'erp_product',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		sku: text('sku').notNull(),
		price: numeric('price', { precision: 12, scale: 2 }).notNull(),
		stockQuantity: integer('stock_quantity').notNull().default(0),
		category: text('category').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		unique('erp_product_sku_unique').on(table.sku),
		index('erp_product_sku_idx').on(table.sku)
	]
);

// ─── ERP: Sale ─────────────────────────────────────────────────────────────────

export const erpSale = pgTable('erp_sale', {
	id: text('id').primaryKey(),
	customerName: text('customer_name').notNull(),
	totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull().default('0'),
	status: saleStatusEnum('status').notNull().default('PENDING'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─── ERP: SaleItem ─────────────────────────────────────────────────────────────

export const erpSaleItem = pgTable('erp_sale_item', {
	id: text('id').primaryKey(),
	saleId: text('sale_id')
		.notNull()
		.references(() => erpSale.id, { onDelete: 'cascade' }),
	productId: text('product_id')
		.notNull()
		.references(() => erpProduct.id, { onDelete: 'restrict' }),
	quantity: integer('quantity').notNull(),
	priceAtSale: numeric('price_at_sale', { precision: 12, scale: 2 }).notNull()
});

// ─── ERP: Invoice ──────────────────────────────────────────────────────────────

export const erpInvoice = pgTable(
	'erp_invoice',
	{
		id: text('id').primaryKey(),
		saleId: text('sale_id')
			.notNull()
			.unique()
			.references(() => erpSale.id, { onDelete: 'cascade' }),
		invoiceNumber: text('invoice_number').notNull(),
		dueDate: date('due_date').notNull(),
		status: invoiceStatusEnum('status').notNull().default('UNPAID'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		unique('erp_invoice_number_unique').on(table.invoiceNumber),
		index('erp_invoice_number_idx').on(table.invoiceNumber)
	]
);

// ─── ERP: Relations ────────────────────────────────────────────────────────────

export const erpProductRelations = relations(erpProduct, ({ many }) => ({
	saleItems: many(erpSaleItem)
}));

export const erpSaleRelations = relations(erpSale, ({ many, one }) => ({
	saleItems: many(erpSaleItem),
	invoice: one(erpInvoice, {
		fields: [erpSale.id],
		references: [erpInvoice.saleId]
	})
}));

export const erpSaleItemRelations = relations(erpSaleItem, ({ one }) => ({
	sale: one(erpSale, {
		fields: [erpSaleItem.saleId],
		references: [erpSale.id]
	}),
	product: one(erpProduct, {
		fields: [erpSaleItem.productId],
		references: [erpProduct.id]
	})
}));

export const erpInvoiceRelations = relations(erpInvoice, ({ one }) => ({
	sale: one(erpSale, {
		fields: [erpInvoice.saleId],
		references: [erpSale.id]
	})
}));
