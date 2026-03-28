<script lang="ts">
	let { data } = $props();

	const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
</script>

<svelte:head>
	<title>Reports · Finance Tracker</title>
</svelte:head>

<div class="mx-auto max-w-5xl">
	<header class="border-b border-slate-800/80 pb-6">
		<h1 class="text-2xl font-semibold tracking-tight text-white md:text-3xl">Reports</h1>
		<p class="mt-1 text-sm text-slate-400 md:text-base">
			Monthly income, expenses, and net cash flow from your transaction history.
		</p>
	</header>

	<section class="mt-8 grid gap-4 sm:grid-cols-3">
		<div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 ring-1 ring-white/5">
			<p class="text-xs font-medium tracking-wide text-slate-500 uppercase">All-time income</p>
			<p class="mt-2 text-2xl font-bold text-emerald-400 tabular-nums">
				{currency.format(data.totals.income)}
			</p>
		</div>
		<div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 ring-1 ring-white/5">
			<p class="text-xs font-medium tracking-wide text-slate-500 uppercase">All-time expenses</p>
			<p class="mt-2 text-2xl font-bold text-red-400 tabular-nums">
				{currency.format(data.totals.expenses)}
			</p>
		</div>
		<div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 ring-1 ring-white/5">
			<p class="text-xs font-medium tracking-wide text-slate-500 uppercase">Net (all months)</p>
			<p
				class="mt-2 text-2xl font-bold tabular-nums {data.totals.net >= 0
					? 'text-emerald-400'
					: 'text-red-400'}"
			>
				{currency.format(data.totals.net)}
			</p>
			<p class="mt-1 text-xs text-slate-500">{data.totals.transactions} line items</p>
		</div>
	</section>

	<section class="mt-10">
		<h2 class="text-lg font-semibold text-white">By month</h2>
		<p class="mt-0.5 text-sm text-slate-500">Sorted with the most recent month first.</p>

		{#if data.monthly.length === 0}
			<div
				class="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 px-6 py-14 text-center text-slate-500"
			>
				No data yet. Add transactions to see monthly breakdowns.
			</div>
		{:else}
			<div class="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
				<div class="overflow-x-auto">
					<table class="w-full min-w-[42rem] text-left text-sm">
						<thead>
							<tr
								class="border-b border-slate-800 bg-slate-950/70 text-xs tracking-wide text-slate-500 uppercase"
							>
								<th class="px-5 py-3.5 font-semibold">Month</th>
								<th class="px-5 py-3.5 text-right font-semibold">Income</th>
								<th class="px-5 py-3.5 text-right font-semibold">Expenses</th>
								<th class="px-5 py-3.5 text-right font-semibold">Net</th>
								<th class="px-5 py-3.5 text-right font-semibold">Items</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-800/90">
							{#each data.monthly as row (row.period)}
								<tr class="transition-colors hover:bg-slate-800/35">
									<td class="px-5 py-4 font-medium text-slate-100">{row.label}</td>
									<td class="px-5 py-4 text-right text-emerald-400 tabular-nums">
										{currency.format(row.income)}
									</td>
									<td class="px-5 py-4 text-right text-red-400 tabular-nums">
										{currency.format(row.expenses)}
									</td>
									<td
										class="px-5 py-4 text-right font-semibold tabular-nums {row.net >= 0
											? 'text-emerald-300'
											: 'text-red-300'}"
									>
										{currency.format(row.net)}
									</td>
									<td class="px-5 py-4 text-right text-slate-500 tabular-nums">
										{row.transactionCount}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</section>
</div>
