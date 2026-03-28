<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

	function formatDate(iso: string) {
		try {
			return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
				new Date(iso)
			);
		} catch {
			return iso;
		}
	}
</script>

<svelte:head>
	<title>Transactions · Finance Tracker</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<h1 class="text-2xl font-semibold text-white md:text-3xl">Transactions</h1>
	<p class="mt-1 text-slate-400">Add, review, or remove income and expenses.</p>

	<section class="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
		<h2 class="text-lg font-medium text-white">Add transaction</h2>

		<form method="POST" action="?/add" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" use:enhance>
			<div class="sm:col-span-2 lg:col-span-1">
				<label for="type" class="mb-1 block text-sm font-medium text-slate-300">Type</label>
				<select
					id="type"
					name="type"
					class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					value={form?.type ?? 'expense'}
				>
					<option value="income">Income</option>
					<option value="expense">Expense</option>
				</select>
			</div>
			<div>
				<label for="amount" class="mb-1 block text-sm font-medium text-slate-300">Amount</label>
				<input
					id="amount"
					name="amount"
					type="number"
					step="0.01"
					min="0.01"
					placeholder="0.00"
					value={form?.amount ?? ''}
					class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					required
				/>
			</div>
			<div class="sm:col-span-2">
				<label for="description" class="mb-1 block text-sm font-medium text-slate-300"
					>Description</label
				>
				<input
					id="description"
					name="description"
					type="text"
					placeholder="e.g. Rent, Freelance"
					value={form?.description ?? ''}
					class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					required
				/>
			</div>
			<div class="flex items-end sm:col-span-2 lg:col-span-1">
				<button
					type="submit"
					class="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
				>
					Add
				</button>
			</div>
		</form>

		{#if form?.error}
			<p class="mt-3 text-sm text-red-400" role="alert">{form.error}</p>
		{/if}
	</section>

	<section class="mt-10">
		<h2 class="text-lg font-medium text-white">History</h2>

		{#if data.transactions.length === 0}
			<p class="mt-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-4 py-8 text-center text-slate-500">
				No transactions yet. Add one above.
			</p>
		{:else}
			<ul class="mt-4 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/40">
				{#each data.transactions as t (t.id)}
					<li class="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="min-w-0 flex-1">
							<p class="truncate font-medium text-slate-100">{t.description}</p>
							<p class="text-xs text-slate-500">{formatDate(t.createdAt)}</p>
						</div>
						<div class="flex shrink-0 items-center gap-4 sm:justify-end">
							<span
								class="text-sm font-semibold tabular-nums {t.type === 'income'
									? 'text-emerald-400'
									: 'text-red-400'}"
							>
								{t.type === 'income' ? '+' : '−'}
								{currency.format(t.amount)}
							</span>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={t.id} />
								<button
									type="submit"
									class="rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-900/40"
								>
									Delete
								</button>
							</form>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
