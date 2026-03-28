import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { addTransaction, deleteTransaction, listTransactionsForUser } from '$lib/server/finance-db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	return {
		transactions: await listTransactionsForUser(locals.user.id)
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const data = await request.formData();
		const typeRaw = String(data.get('type') ?? '');
		const amountRaw = String(data.get('amount') ?? '');
		const description = String(data.get('description') ?? '').trim();

		const type = typeRaw === 'income' || typeRaw === 'expense' ? typeRaw : null;
		const amount = Number.parseFloat(amountRaw);

		if (!type) {
			return fail(400, {
				error: 'Choose income or expense.',
				type: typeRaw,
				amount: amountRaw,
				description
			});
		}
		if (!Number.isFinite(amount) || amount <= 0) {
			return fail(400, {
				error: 'Enter a valid amount greater than zero.',
				type,
				amount: amountRaw,
				description
			});
		}
		if (!description) {
			return fail(400, { error: 'Description is required.', type, amount: amountRaw, description });
		}

		await addTransaction(locals.user.id, { type, amount, description });
		return { success: true as const };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		if (!id) {
			return fail(400, { error: 'Missing transaction.' });
		}

		const removed = await deleteTransaction(locals.user.id, id);
		if (!removed) {
			return fail(400, { error: 'Could not delete that transaction.' });
		}
		return { success: true as const };
	}
};
