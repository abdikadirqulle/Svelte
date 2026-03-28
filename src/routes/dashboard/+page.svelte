<script lang="ts">
	let { data } = $props();

	const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
</script>

<svelte:head>
	<title>Dashboard · Finance Tracker</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<h1 class="text-2xl font-semibold text-white md:text-3xl">Dashboard</h1>
	<p class="mt-1 text-slate-400">Overview of your income, expenses, and balance.</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-3">
		<div
			class="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 to-slate-900 p-6 shadow-lg shadow-emerald-900/20"
		>
			<p class="text-sm font-medium text-emerald-200/80">Total income</p>
			<p class="mt-2 text-3xl font-bold tabular-nums text-emerald-400">
				{currency.format(data.summary.totalIncome)}
			</p>
		</div>

		<div
			class="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/80 to-slate-900 p-6 shadow-lg shadow-red-900/20"
		>
			<p class="text-sm font-medium text-red-200/80">Total expenses</p>
			<p class="mt-2 text-3xl font-bold tabular-nums text-red-400">
				{currency.format(data.summary.totalExpenses)}
			</p>
		</div>

		<div
			class="rounded-2xl border border-slate-600 bg-slate-900/90 p-6 shadow-lg ring-1 ring-white/5"
		>
			<p class="text-sm font-medium text-slate-400">Current balance</p>
			<p
				class="mt-2 text-3xl font-bold tabular-nums {data.summary.balance >= 0
					? 'text-emerald-400'
					: 'text-red-400'}"
			>
				{currency.format(data.summary.balance)}
			</p>
		</div>
	</div>

	<div class="mt-10">
		<a
			href="/transactions"
			class="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-500/50 hover:text-white"
		>
			Manage transactions
			<span aria-hidden="true">→</span>
		</a>
	</div>
</div>
