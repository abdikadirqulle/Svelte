<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	const inputClass =
		'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 shadow-inner shadow-black/20 transition-colors placeholder:text-slate-600 focus:border-emerald-500/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/25';
</script>

<svelte:head>
	<title>Sign in · Finance Tracker</title>
</svelte:head>

<div class="flex flex-1 flex-col items-center justify-center px-4 py-16">
	<div
		class="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/50 ring-1 ring-white/5"
	>
		<h1 class="text-center text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
		<p class="mt-1 text-center text-sm text-slate-400">Sign in to your Finance Tracker</p>

		<p
			class="mt-5 rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2.5 text-center text-xs text-slate-400"
		>
			Demo:
			<span class="font-mono text-emerald-300/90">demo@example.com</span>
			·
			<span class="font-mono text-emerald-300/90">demo12345</span>
		</p>

		<form method="POST" action="?/login" class="mt-8 space-y-5" use:enhance>
			<div>
				<label for="email" class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
					>Email</label
				>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="username"
					value={form?.email ?? ''}
					class={inputClass}
					required
				/>
			</div>
			<div>
				<label
					for="password"
					class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
					>Password</label
				>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					class={inputClass}
					required
				/>
			</div>

			{#if form?.error}
				<p
					class="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-300"
					role="alert"
				>
					{form.error}
				</p>
			{/if}

			<button
				type="submit"
				class="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
			>
				Sign in
			</button>
		</form>
	</div>
</div>
