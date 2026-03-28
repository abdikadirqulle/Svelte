import { redirect, fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { erpInvoice, erpSale } from '$lib/server/db/schema';
import { generateInvoiceSchema, markPaidSchema } from '$lib/schemas/erp';
import type { PageServerLoad, Actions } from './$types';

function generateInvoiceNumber(): string {
	const date = new Date();
	const datePart = date
		.toISOString()
		.slice(0, 10)
		.replace(/-/g, '');
	const seq = String(Math.floor(Math.random() * 9000) + 1000);
	return `INV-${datePart}-${seq}`;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const invoices = await db.query.erpInvoice.findMany({
		orderBy: (inv, { desc }) => [desc(inv.createdAt)],
		with: {
			sale: {
				with: { saleItems: { with: { product: true } } }
			}
		}
	});

	// Fetch sales that don't yet have invoices
	const salesWithInvoices = invoices.map((inv) => inv.saleId);
	const allSales = await db.query.erpSale.findMany({
		orderBy: (s, { desc }) => [desc(s.createdAt)],
		with: { saleItems: true }
	});

	const uninvoicedSales = allSales.filter((s) => !salesWithInvoices.includes(s.id));

	return { invoices, uninvoicedSales };
};

export const actions: Actions = {
	generateInvoice: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const parsed = generateInvoiceSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, {
				action: 'generateInvoice',
				field_errors: parsed.error.flatten().fieldErrors
			});
		}

		const { saleId } = parsed.data;

		// Verify the sale exists
		const sale = await db
			.select()
			.from(erpSale)
			.where(eq(erpSale.id, saleId))
			.limit(1)
			.then((r) => r[0]);

		if (!sale) {
			return fail(404, { action: 'generateInvoice', message: 'Sale not found' });
		}

		// Guard: prevent duplicate invoices
		const existingInvoice = await db
			.select({ id: erpInvoice.id })
			.from(erpInvoice)
			.where(eq(erpInvoice.saleId, saleId))
			.limit(1);

		if (existingInvoice.length > 0) {
			return fail(409, {
				action: 'generateInvoice',
				message: 'An invoice already exists for this sale'
			});
		}

		const invoiceNumber = generateInvoiceNumber();
		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 30);
		const dueDateStr = dueDate.toISOString().slice(0, 10);

		await db.insert(erpInvoice).values({
			id: randomUUID(),
			saleId,
			invoiceNumber,
			dueDate: dueDateStr,
			status: 'UNPAID'
		});

		return {
			success: true,
			action: 'generateInvoice',
			message: `Invoice ${invoiceNumber} generated successfully`
		};
	},

	markPaid: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const parsed = markPaidSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, {
				action: 'markPaid',
				field_errors: parsed.error.flatten().fieldErrors
			});
		}

		await db
			.update(erpInvoice)
			.set({ status: 'PAID' })
			.where(eq(erpInvoice.id, parsed.data.invoiceId));

		return { success: true, action: 'markPaid', message: 'Invoice marked as paid' };
	}
};
