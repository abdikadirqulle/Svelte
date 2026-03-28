<script lang="ts">
	import './layout.css';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="flex min-h-screen bg-slate-950 text-slate-100 {data.financeUser
		? 'flex-row'
		: 'flex-col'}"
>
	{#if data.financeUser}
		<aside
			class="flex w-56 flex-col border-r border-slate-800 bg-slate-900/80 backdrop-blur"
			aria-label="Main navigation"
		>
			<div class="border-b border-slate-800 px-4 py-5">
				<a href="/dashboard" class="text-lg font-semibold tracking-tight text-white">Finance Tracker</a>
				<p class="mt-0.5 truncate text-xs text-slate-400">{data.financeUser.email}</p>
			</div>
			<nav class="flex flex-1 flex-col gap-1 p-3">
				<a
					href="/dashboard"
					class="rounded-lg px-3 py-2 text-sm font-medium transition-colors {page.url.pathname ===
					'/dashboard'
						? 'bg-emerald-500/15 text-emerald-300'
						: 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
				>
					Dashboard
				</a>
				<a
					href="/transactions"
					class="rounded-lg px-3 py-2 text-sm font-medium transition-colors {page.url.pathname ===
					'/transactions'
						? 'bg-emerald-500/15 text-emerald-300'
						: 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
				>
					Transactions
				</a>
			</nav>
			<div class="border-t border-slate-800 p-3">
				<form method="POST" action="/?/logout" use:enhance>
					<button
						type="submit"
						class="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
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
			<a
				href="/login"
				class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
			>
				Sign in
			</a>
		</header>
	{/if}

	<main class="flex flex-1 flex-col {data.financeUser ? 'overflow-auto' : ''}">
		{#if !data.financeUser}
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
