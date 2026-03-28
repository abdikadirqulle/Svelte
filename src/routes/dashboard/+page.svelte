<script lang="ts">
	let { data } = $props();

	const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
	const pct = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 0 });

	function formatWhen(iso: string) {
		try {
			return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(iso));
		} catch {
			return iso;
		}
	}
</script>

<svelte:head>
	<title>Dashboard · Finance Tracker</title>
</svelte:head>

<div class="mx-auto max-w-5xl">
	<header class="flex flex-col gap-1 border-b border-slate-800/80 pb-6">
		<h1 class="text-2xl font-semibold tracking-tight text-white md:text-3xl">Dashboard</h1>
		<p class="text-sm text-slate-400 md:text-base">
			Income, spending, and balance at a glance.
		</p>
	</header>

	<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<div
			class="group relative overflow-hidden rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-950/90 via-slate-900/95 to-slate-950 p-6 shadow-lg shadow-emerald-950/30 ring-1 ring-white/5"
		>
			<div
				class="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-opacity group-hover:opacity-80"
				aria-hidden="true"
			></div>
			<p class="text-xs font-medium uppercase tracking-wider text-emerald-300/80">Total income</p>
			<p class="mt-3 text-3xl font-bold tabular-nums tracking-tight text-emerald-400 md:text-4xl">
				{currency.format(data.summary.totalIncome)}
			</p>
			<p class="mt-3 text-xs text-emerald-200/50">All credits recorded in the tracker</p>
		</div>

		<div
			class="group relative overflow-hidden rounded-2xl border border-red-500/35 bg-gradient-to-br from-red-950/90 via-slate-900/95 to-slate-950 p-6 shadow-lg shadow-red-950/30 ring-1 ring-white/5"
		>
			<div
				class="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-red-500/10 blur-2xl transition-opacity group-hover:opacity-80"
				aria-hidden="true"
			></div>
			<p class="text-xs font-medium uppercase tracking-wider text-red-300/80">Total expenses</p>
			<p class="mt-3 text-3xl font-bold tabular-nums tracking-tight text-red-400 md:text-4xl">
				{currency.format(data.summary.totalExpenses)}
			</p>
			{#if data.stats.spendPercentOfIncome !== null}
				<p class="mt-3 text-xs text-red-200/50">
					{pct.format(data.stats.spendPercentOfIncome)}% of income outflow
				</p>
			{:else}
				<p class="mt-3 text-xs text-red-200/50">Add income to see spend ratio</p>
			{/if}
		</div>

		<div
			class="group relative overflow-hidden rounded-2xl border border-slate-600/80 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg ring-1 ring-white/5 sm:col-span-2 lg:col-span-1"
		>
			<div
				class="pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl"
				aria-hidden="true"
			></div>
			<p class="text-xs font-medium uppercase tracking-wider text-slate-400">Current balance</p>
			<p
				class="mt-3 text-3xl font-bold tabular-nums tracking-tight md:text-4xl {data.summary.balance >=
				0
					? 'text-emerald-400'
					: 'text-red-400'}"
			>
				{currency.format(data.summary.balance)}
			</p>
			{#if data.stats.netPercentOfIncome !== null && data.summary.totalIncome > 0}
				<p class="mt-3 text-xs text-slate-500">
					Net {data.summary.balance >= 0 ? 'surplus' : 'deficit'}: {pct.format(
						Math.abs(data.stats.netPercentOfIncome)
					)}% of income
				</p>
			{:else}
				<p class="mt-3 text-xs text-slate-500">{data.stats.transactionCount} transactions on file</p>
			{/if}
		</div>
	</div>

	<div class="mt-10 grid gap-6 lg:grid-cols-3">
		<section
			class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-inner shadow-black/20 lg:col-span-2"
		>
			<div class="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
				<div>
					<h2 class="text-base font-semibold text-white">Recent activity</h2>
					<p class="mt-0.5 text-xs text-slate-500">Latest five movements</p>
				</div>
				<a
					href="/transactions"
					class="shrink-0 rounded-lg border border-slate-600 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-emerald-500/45 hover:text-white"
				>
					View all
				</a>
			</div>

			{#if data.recentTransactions.length === 0}
				<p class="py-10 text-center text-sm text-slate-500">No transactions yet.</p>
			{:else}
				<div class="mt-4 overflow-hidden rounded-xl border border-slate-800/80">
					<div class="overflow-x-auto">
						<table class="w-full min-w-[32rem] text-left text-sm">
							<thead>
								<tr class="border-b border-slate-800 bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
									<th class="px-4 py-3 font-medium">Description</th>
									<th class="px-4 py-3 font-medium">Type</th>
									<th class="px-4 py-3 text-right font-medium">Date</th>
									<th class="px-4 py-3 text-right font-medium">Amount</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-800/90">
								{#each data.recentTransactions as row (row.id)}
									<tr class="bg-slate-900/30 transition-colors hover:bg-slate-800/40">
										<td class="max-w-[12rem] truncate px-4 py-3 font-medium text-slate-200 md:max-w-xs">
											{row.description}
										</td>
										<td class="px-4 py-3">
											<span
												class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium {row.type ===
												'income'
													? 'bg-emerald-500/15 text-emerald-300'
													: 'bg-red-500/15 text-red-300'}"
											>
												{row.type === 'income' ? 'Income' : 'Expense'}
											</span>
										</td>
										<td class="whitespace-nowrap px-4 py-3 text-right text-slate-500">
											{formatWhen(row.createdAt)}
										</td>
										<td
											class="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums {row.type ===
											'income'
												? 'text-emerald-400'
												: 'text-red-400'}"
										>
											{row.type === 'income' ? '+' : '−'}{currency.format(row.amount)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</section>

		<aside class="flex flex-col gap-4">
			<div
				class="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 ring-1 ring-violet-500/10"
			>
				<h2 class="text-sm font-semibold text-white">Quick stats</h2>
				<dl class="mt-4 space-y-4 text-sm">
					<div class="flex justify-between gap-4 border-b border-slate-800/80 pb-3">
						<dt class="text-slate-500">Transactions</dt>
						<dd class="font-semibold tabular-nums text-slate-200">{data.stats.transactionCount}</dd>
					</div>
					<div class="flex justify-between gap-4 border-b border-slate-800/80 pb-3">
						<dt class="text-slate-500">Net position</dt>
						<dd
							class="font-semibold tabular-nums {data.summary.balance >= 0
								? 'text-emerald-400'
								: 'text-red-400'}"
						>
							{data.summary.balance >= 0 ? 'Positive' : 'Negative'}
						</dd>
					</div>
					<div class="flex justify-between gap-4">
						<dt class="text-slate-500">Cash flow</dt>
						<dd class="text-right text-xs leading-relaxed text-slate-400">
							Income minus expenses for your account.
						</dd>
					</div>
				</dl>
			</div>
			<a
				href="/transactions"
				class="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-600/15 px-4 py-4 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-600/25 hover:text-emerald-200"
			>
				<span>Add or edit transactions</span>
				<span aria-hidden="true">→</span>
			</a>
		</aside>
	</div>
</div>
