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
		class="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl ring-1 shadow-black/50 ring-white/5"
	>
		<h1 class="text-center text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
		<p class="mt-1 text-center text-sm text-slate-400">Sign in with email or GitHub.</p>

		<form method="POST" action="?/signInEmail" class="mt-8 space-y-5" use:enhance>
			<div>
				<label
					for="email"
					class="mb-1.5 block text-xs font-medium tracking-wide text-slate-400 uppercase"
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
					class="mb-1.5 block text-xs font-medium tracking-wide text-slate-400 uppercase"
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

		<div class="relative my-8">
			<div class="absolute inset-0 flex items-center" aria-hidden="true">
				<div class="w-full border-t border-slate-800"></div>
			</div>
			<div class="relative flex justify-center text-xs tracking-wide uppercase">
				<span class="bg-slate-900/70 px-3 text-slate-500">Or continue with</span>
			</div>
		</div>

		<form method="POST" action="?/signInSocial" use:enhance>
			<input type="hidden" name="provider" value="github" />
			<input type="hidden" name="callbackURL" value="/dashboard" />
			<button
				type="submit"
				class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-800"
			>
				<svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
					<path
						fill="currentColor"
						d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
					/>
				</svg>
				Continue with GitHub
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-slate-500">
			New here?
			<a href="/sign-up" class="font-medium text-emerald-400 hover:text-emerald-300"
				>Create an account</a
			>
		</p>
	</div>
</div>
