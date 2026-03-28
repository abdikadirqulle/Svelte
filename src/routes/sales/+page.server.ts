import { redirect, fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { erpProduct, erpSale, erpSaleItem } from '$lib/server/db/schema';
import { processSaleSchema } from '$lib/schemas/erp';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const sales = await db.query.erpSale.findMany({
		orderBy: (s, { desc }) => [desc(s.createdAt)],
		with: {
			saleItems: {
				with: { product: true }
			},
			invoice: true
		}
	});

	const products = await db
		.select({
			id: erpProduct.id,
			name: erpProduct.name,
			sku: erpProduct.sku,
			price: erpProduct.price,
			stockQuantity: erpProduct.stockQuantity,
			category: erpProduct.category
		})
		.from(erpProduct)
		.orderBy(erpProduct.name);

	return { sales, products };
};

export const actions: Actions = {
	processSale: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const formData = await request.formData();
		const customerName = formData.get('customerName');
		const itemsRaw = formData.get('items');

		let parsedItems: unknown;
		try {
			parsedItems = JSON.parse(String(itemsRaw ?? '[]'));
		} catch {
			return fail(400, {
				action: 'processSale',
				field_errors: { items: ['Invalid items format'] }
			});
		}

		const parsed = processSaleSchema.safeParse({ customerName, items: parsedItems });
		if (!parsed.success) {
			return fail(400, {
				action: 'processSale',
				field_errors: parsed.error.flatten().fieldErrors
			});
		}

		const { customerName: customer, items } = parsed.data;

		try {
			const result = await db.transaction(async (tx) => {
				// 1. Verify stock availability for all items
				const productIds = items.map((i) => i.productId);
				const products = await Promise.all(
					productIds.map((pid) =>
						tx
							.select()
							.from(erpProduct)
							.where(eq(erpProduct.id, pid))
							.limit(1)
							.then((r) => r[0])
					)
				);

				for (const item of items) {
					const product = products.find((p) => p?.id === item.productId);
					if (!product) {
						throw new Error(`Product ${item.productId} not found`);
					}
					if (product.stockQuantity < item.quantity) {
						throw new Error(
							`Insufficient stock for "${product.name}": requested ${item.quantity}, available ${product.stockQuantity}`
						);
					}
				}

				// 2. Create Sale record
				const saleId = randomUUID();
				let totalAmount = 0;

				// 3. Calculate total and create SaleItems
				const saleItemRecords = items.map((item) => {
					const product = products.find((p) => p!.id === item.productId)!;
					const lineTotal = Number(product.price) * item.quantity;
					totalAmount += lineTotal;
					return {
						id: randomUUID(),
						saleId,
						productId: item.productId,
						quantity: item.quantity,
						priceAtSale: String(Number(product.price).toFixed(2))
					};
				});

				await tx.insert(erpSale).values({
					id: saleId,
					customerName: customer,
					totalAmount: String(totalAmount.toFixed(2)),
					status: 'COMPLETED'
				});

				await tx.insert(erpSaleItem).values(saleItemRecords);

				// 4. Decrement stock for each product
				for (const item of items) {
					await tx
						.update(erpProduct)
						.set({
							stockQuantity: db.$with('sq').as(
								db
									.select({ val: sql<number>`${erpProduct.stockQuantity} - ${item.quantity}` })
									.from(erpProduct)
									.where(eq(erpProduct.id, item.productId))
							)
						} as Partial<typeof erpProduct.$inferInsert>)
						.where(eq(erpProduct.id, item.productId));

					// Use raw decrement approach compatible with drizzle
					await tx.execute(
						sql`UPDATE erp_product SET stock_quantity = stock_quantity - ${item.quantity} WHERE id = ${item.productId}`
					);
				}

				return { saleId, totalAmount };
			});

			return {
				success: true,
				action: 'processSale',
				message: `Sale completed — total $${result.totalAmount.toFixed(2)}`,
				saleId: result.saleId
			};
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Sale processing failed';
			return fail(422, { action: 'processSale', message });
		}
	}
};
