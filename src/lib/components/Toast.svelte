<script lang="ts">
	import { toastStore } from '$lib/toast.svelte';

	const iconMap = {
		success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
		error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
		info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
	};

	const styleMap = {
		success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
		error: 'border-red-500/30 bg-red-500/10 text-red-200',
		info: 'border-sky-500/30 bg-sky-500/10 text-sky-200'
	};
</script>

<div class="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2" aria-live="polite">
	{#each toastStore.toasts as toast (toast.id)}
		<div
			class="pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-md transition-all {styleMap[
				toast.type
			]}"
		>
			{@html iconMap[toast.type]}
			<span>{toast.message}</span>
			<button
				onclick={() => toastStore.remove(toast.id)}
				class="ml-auto opacity-60 transition-opacity hover:opacity-100"
				aria-label="Dismiss"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>
	{/each}
</div>
