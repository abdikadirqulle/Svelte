import { redirect, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { erpInvoice } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(303, '/login');

	const invoice = await db.query.erpInvoice.findFirst({
		where: eq(erpInvoice.id, params.id),
		with: {
			sale: {
				with: {
					saleItems: {
						with: { product: true }
					}
				}
			}
		}
	});

	if (!invoice) throw error(404, 'Invoice not found');

	return { invoice };
};
