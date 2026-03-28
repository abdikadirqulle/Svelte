<script lang="ts">
	import './layout.css';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/Toast.svelte';

	let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen bg-slate-950 text-slate-100 {data.user ? 'flex-row' : 'flex-col'}">
	{#if data.user}
		<aside
			class="flex w-60 flex-col border-r border-slate-800/90 bg-slate-900/90 backdrop-blur-md"
			aria-label="Main navigation"
		>
			<div class="border-b border-slate-800 px-4 py-5">
				<a href="/dashboard" class="text-lg font-semibold tracking-tight text-white"
					>Finance Tracker</a
				>
				<p class="mt-1 truncate text-xs text-slate-500">{data.user.email}</p>
			</div>
			<nav class="flex flex-1 flex-col gap-1 p-3">
				<a
					href="/dashboard"
					class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {page
						.url.pathname === '/dashboard'
						? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
						: 'text-slate-400 hover:bg-slate-800/70 hover:text-white'}"
				>
					<span
						class="h-1.5 w-1.5 rounded-full {page.url.pathname === '/dashboard'
							? 'bg-emerald-400'
							: 'bg-slate-600'}"
						aria-hidden="true"
					></span>
					Dashboard
				</a>
				<a
					href="/transactions"
					class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {page
						.url.pathname === '/transactions'
						? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
						: 'text-slate-400 hover:bg-slate-800/70 hover:text-white'}"
				>
					<span
						class="h-1.5 w-1.5 rounded-full {page.url.pathname === '/transactions'
							? 'bg-emerald-400'
							: 'bg-slate-600'}"
						aria-hidden="true"
					></span>
					Transactions
				</a>
				<a
					href="/report"
					class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {page
						.url.pathname === '/report'
						? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
						: 'text-slate-400 hover:bg-slate-800/70 hover:text-white'}"
				>
					<span
						class="h-1.5 w-1.5 rounded-full {page.url.pathname === '/report'
							? 'bg-emerald-400'
							: 'bg-slate-600'}"
						aria-hidden="true"
					></span>
					Reports
				</a>
				
				<!-- ERP Module Links -->
				<div class="mt-4 mb-1 pl-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
					Enterprise
				</div>
				<a
					href="/products"
					class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {page
						.url.pathname.startsWith('/products')
						? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
						: 'text-slate-400 hover:bg-slate-800/70 hover:text-white'}"
				>
					<span
						class="h-1.5 w-1.5 rounded-full {page.url.pathname.startsWith('/products')
							? 'bg-emerald-400'
							: 'bg-slate-600'}"
						aria-hidden="true"
					></span>
					Products
				</a>
				<a
					href="/sales"
					class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {page
						.url.pathname.startsWith('/sales')
						? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
						: 'text-slate-400 hover:bg-slate-800/70 hover:text-white'}"
				>
					<span
						class="h-1.5 w-1.5 rounded-full {page.url.pathname.startsWith('/sales')
							? 'bg-emerald-400'
							: 'bg-slate-600'}"
						aria-hidden="true"
					></span>
					Sales & POS
				</a>
				<a
					href="/invoices"
					class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {page
						.url.pathname.startsWith('/invoices')
						? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
						: 'text-slate-400 hover:bg-slate-800/70 hover:text-white'}"
				>
					<span
						class="h-1.5 w-1.5 rounded-full {page.url.pathname.startsWith('/invoices')
							? 'bg-emerald-400'
							: 'bg-slate-600'}"
						aria-hidden="true"
					></span>
					Invoices
				</a>
			</nav>
			<div class="border-t border-slate-800 p-3">
				<form method="POST" action="/login?/signOut" use:enhance>
					<button
						type="submit"
						class="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-white"
					>
						Log out
					</button>
				</form>
			</div>
		</aside>
	{:else}
		<header
			class="flex w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur"
		>
			<a href="/login" class="text-lg font-semibold tracking-tight text-white">Finance Tracker</a>
			<div class="flex items-center gap-3">
				<a
					href="/sign-up"
					class="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
				>
					Sign up
				</a>
				<a
					href="/login"
					class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
				>
					Sign in
				</a>
			</div>
		</header>
	{/if}

	<main class="flex flex-1 flex-col {data.user ? 'overflow-auto' : ''}">
		{#if !data.user}
			<div class="flex flex-1 flex-col">
				{@render children()}
			</div>
		{:else}
			<div class="flex-1 p-6 md:p-8">
				{@render children()}
			</div>
		{/if}
	</main>
</div>

<Toast />
