<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Sign in · Finance Tracker</title>
</svelte:head>

<div class="flex flex-1 flex-col items-center justify-center px-4 py-16">
	<div class="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-black/40">
		<h1 class="text-center text-2xl font-semibold text-white">Welcome back</h1>
		<p class="mt-1 text-center text-sm text-slate-400">Sign in to your Finance Tracker</p>

		<p class="mt-4 rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-2 text-center text-xs text-slate-400">
			Demo: <span class="font-mono text-emerald-300/90">demo@example.com</span> /
			<span class="font-mono text-emerald-300/90">demo12345</span>
		</p>

		<form method="POST" action="?/login" class="mt-8 space-y-4" use:enhance>
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-slate-300">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="username"
					value={form?.email ?? ''}
					class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					required
				/>
			</div>
			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-slate-300">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					required
				/>
			</div>

			{#if form?.error}
				<p class="text-sm text-red-400" role="alert">{form.error}</p>
			{/if}

			<button
				type="submit"
				class="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
			>
				Sign in
			</button>
		</form>
	</div>
</div>
