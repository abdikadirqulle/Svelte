<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

	const inputClass =
		'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 shadow-inner shadow-black/20 transition-colors placeholder:text-slate-600 focus:border-emerald-500/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/25';

	const btnPrimaryClass =
		'inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/30 transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:w-auto lg:w-full';

	const btnRemoveClass =
		'rounded-lg border border-red-500/35 bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-200 transition-colors hover:border-red-400/50 hover:bg-red-900/50';

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

<div class="mx-auto max-w-5xl">
	<header class="border-b border-slate-800/80 pb-6">
		<h1 class="text-2xl font-semibold tracking-tight text-white md:text-3xl">Transactions</h1>
		<p class="mt-1 text-sm text-slate-400 md:text-base">
			Record income and expenses; data syncs on submit without a full reload.
		</p>
	</header>

	<section
		class="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-black/20 ring-1 ring-white/5"
	>
		<h2 class="flex items-center gap-2 text-lg font-semibold text-white">
			<span
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-sm font-bold text-emerald-400"
				aria-hidden="true">+</span
			>
			New transaction
		</h2>
		<p class="mt-1 text-sm text-slate-500">Required fields are validated on the server.</p>

		<form
			method="POST"
			action="?/add"
			class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-12"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update({ reset: result.type === 'success' });
				};
			}}
		>
			<div class="sm:col-span-1 lg:col-span-3">
				<label
					for="type"
					class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">Type</label
				>
				<select id="type" name="type" class={inputClass} value={form?.type ?? 'expense'}>
					<option value="income">Income</option>
					<option value="expense">Expense</option>
				</select>
			</div>
			<div class="sm:col-span-1 lg:col-span-3">
				<label
					for="amount"
					class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
					>Amount</label
				>
				<div class="relative">
					<span
						class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500"
						>$</span
					>
					<input
						id="amount"
						name="amount"
						type="number"
						step="0.01"
						min="0.01"
						placeholder="0.00"
						value={form?.amount ?? ''}
						class="{inputClass} pl-7"
						required
					/>
				</div>
			</div>
			<div class="sm:col-span-2 lg:col-span-4">
				<label
					for="description"
					class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
					>Description</label
				>
				<input
					id="description"
					name="description"
					type="text"
					placeholder="e.g. Rent, Freelance, Groceries"
					value={form?.description ?? ''}
					class={inputClass}
					required
				/>
			</div>
			<div class="flex items-end sm:col-span-2 lg:col-span-2">
				<button type="submit" class={btnPrimaryClass}> Add transaction </button>
			</div>
		</form>

		{#if form?.error}
			<p
				class="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300"
				role="alert"
			>
				{form.error}
			</p>
		{/if}
	</section>

	<section class="mt-10">
		<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h2 class="text-lg font-semibold text-white">All transactions</h2>
				<p class="text-sm text-slate-500">{data.transactions.length} total</p>
			</div>
		</div>

		{#if data.transactions.length === 0}
			<div
				class="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 px-6 py-14 text-center"
			>
				<p class="text-slate-500">No transactions yet. Use the form above to add your first entry.</p>
			</div>
		{:else}
			<div class="mt-4 hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 md:block">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[40rem] text-left text-sm">
						<thead>
							<tr
								class="border-b border-slate-800 bg-slate-950/70 text-xs uppercase tracking-wide text-slate-500"
							>
								<th class="px-5 py-3.5 font-semibold">Description</th>
								<th class="px-5 py-3.5 font-semibold">Type</th>
								<th class="px-5 py-3.5 font-semibold">When</th>
								<th class="px-5 py-3.5 text-right font-semibold">Amount</th>
								<th class="px-5 py-3.5 text-right font-semibold">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-800/90">
							{#each data.transactions as t (t.id)}
								<tr class="transition-colors hover:bg-slate-800/35">
									<td class="max-w-xs truncate px-5 py-4 font-medium text-slate-100"
										>{t.description}</td
									>
									<td class="px-5 py-4">
										<span
											class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold {t.type ===
											'income'
												? 'bg-emerald-500/15 text-emerald-300'
												: 'bg-red-500/15 text-red-300'}"
										>
											{t.type === 'income' ? 'Income' : 'Expense'}
										</span>
									</td>
									<td class="whitespace-nowrap px-5 py-4 text-slate-500">{formatDate(t.createdAt)}</td>
									<td class="whitespace-nowrap px-5 py-4 text-right">
										<span
											class="font-semibold tabular-nums {t.type === 'income'
												? 'text-emerald-400'
												: 'text-red-400'}"
										>
											{t.type === 'income' ? '+' : '−'}{currency.format(t.amount)}
										</span>
									</td>
									<td class="px-5 py-4 text-right">
										<form method="POST" action="?/delete" use:enhance>
											<input type="hidden" name="id" value={t.id} />
											<button type="submit" class={btnRemoveClass}>Remove</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<ul class="mt-4 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/40 md:hidden">
				{#each data.transactions as t (t.id)}
					<li class="flex flex-col gap-3 px-4 py-4">
						<div class="flex items-start justify-between gap-3">
							<div class="min-w-0 flex-1">
								<p class="font-medium text-slate-100">{t.description}</p>
								<p class="mt-0.5 text-xs text-slate-500">{formatDate(t.createdAt)}</p>
							</div>
							<span
								class="shrink-0 text-sm font-semibold tabular-nums {t.type === 'income'
									? 'text-emerald-400'
									: 'text-red-400'}"
							>
								{t.type === 'income' ? '+' : '−'}{currency.format(t.amount)}
							</span>
						</div>
						<div class="flex items-center justify-between gap-2">
							<span
								class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium {t.type === 'income'
									? 'bg-emerald-500/15 text-emerald-300'
									: 'bg-red-500/15 text-red-300'}"
							>
								{t.type === 'income' ? 'Income' : 'Expense'}
							</span>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={t.id} />
								<button type="submit" class={btnRemoveClass}>Remove</button>
							</form>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>
