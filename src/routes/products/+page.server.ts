import { redirect, fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { erpProduct } from '$lib/server/db/schema';
import { addProductSchema, updateProductSchema } from '$lib/schemas/erp';
import type { PageServerLoad, Actions } from './$types';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, '/login');

	const search = url.searchParams.get('search') ?? '';
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
	const offset = (page - 1) * PAGE_SIZE;

	const where = search
		? or(
				ilike(erpProduct.name, `%${search}%`),
				ilike(erpProduct.sku, `%${search}%`)
			)
		: undefined;

	const [products, [{ count }]] = await Promise.all([
		db
			.select()
			.from(erpProduct)
			.where(where)
			.orderBy(erpProduct.createdAt)
			.limit(PAGE_SIZE)
			.offset(offset),
		db
			.select({ count: sql<number>`count(*)::int` })
			.from(erpProduct)
			.where(where)
	]);

	return {
		products,
		search,
		page,
		totalPages: Math.ceil(count / PAGE_SIZE),
		totalCount: count
	};
};

export const actions: Actions = {
	addProduct: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const parsed = addProductSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, {
				action: 'addProduct',
				field_errors: parsed.error.flatten().fieldErrors,
				values: raw
			});
		}

		const { name, sku, price, stockQuantity, category } = parsed.data;

		// Check SKU uniqueness
		const existing = await db
			.select({ id: erpProduct.id })
			.from(erpProduct)
			.where(eq(erpProduct.sku, sku))
			.limit(1);

		if (existing.length > 0) {
			return fail(400, {
				action: 'addProduct',
				field_errors: { sku: ['A product with this SKU already exists'] } as Record<string, string[]>,
				values: raw
			});
		}

		await db.insert(erpProduct).values({
			id: randomUUID(),
			name,
			sku,
			price: String(price),
			stockQuantity,
			category
		});

		return { success: true, action: 'addProduct', message: `Product "${name}" added successfully` };
	},

	updateProduct: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const parsed = updateProductSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, {
				action: 'updateProduct',
				field_errors: parsed.error.flatten().fieldErrors,
				values: raw
			});
		}

		const { id, name, sku, price, stockQuantity, category } = parsed.data;

		// Check SKU uniqueness (exclude self)
		const existing = await db
			.select({ id: erpProduct.id })
			.from(erpProduct)
			.where(eq(erpProduct.sku, sku))
			.limit(1);

		if (existing.length > 0 && existing[0].id !== id) {
			return fail(400, {
				action: 'updateProduct',
				field_errors: { sku: ['A product with this SKU already exists'] } as Record<string, string[]>,
				values: raw
			});
		}

		await db
			.update(erpProduct)
			.set({ name, sku, price: String(price), stockQuantity, category, updatedAt: new Date() })
			.where(eq(erpProduct.id, id));

		return {
			success: true,
			action: 'updateProduct',
			message: `Product "${name}" updated successfully`
		};
	}
};
