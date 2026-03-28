<script lang="ts">
	import { enhance } from '$app/forms';
	import { toastStore } from '$lib/toast.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isGenerating = $state<string | null>(null);
	let isMarkingPaid = $state<string | null>(null);

	$effect(() => {
		if (form?.success) {
			toastStore.add(form.message as string, 'success');
		} else if (form?.message) {
			toastStore.add(form.message as string, 'error');
		}
	});
</script>

<svelte:head>
	<title>Invoices | Finance Tracker ERP</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-white">Invoices</h1>
		<p class="text-sm text-slate-400">Generate and track customer invoices.</p>
	</div>

	<!-- Uninvoiced Sales Section -->
	{#if data.uninvoicedSales.length > 0}
		<div class="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 backdrop-blur-sm">
			<div class="flex items-center gap-3 mb-4">
				<div class="rounded-full bg-amber-500/20 p-2 text-amber-500">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<h2 class="text-lg font-semibold text-amber-200">Pending Invoices ({data.uninvoicedSales.length})</h2>
			</div>
			
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.uninvoicedSales as sale (sale.id)}
					<div class="flex flex-col justify-between rounded-xl border border-amber-500/20 bg-slate-900/50 p-4">
						<div>
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium text-white">{sale.customerName}</span>
								<span class="text-xs text-slate-400">{new Date(sale.createdAt).toLocaleDateString()}</span>
							</div>
							<p class="mt-1 text-lg font-bold text-amber-400">${Number(sale.totalAmount).toFixed(2)}</p>
							<p class="mt-2 text-xs text-slate-400">{sale.saleItems.length} items</p>
						</div>
						
						<form
							method="POST"
							action="?/generateInvoice"
							use:enhance={() => {
								isGenerating = sale.id;
								return async ({ update }) => {
									isGenerating = null;
									await update();
								};
							}}
							class="mt-4"
						>
							<input type="hidden" name="saleId" value={sale.id} />
							<button
								type="submit"
								disabled={isGenerating !== null}
								class="w-full rounded-lg bg-amber-500/20 px-3 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/30 disabled:opacity-50"
							>
								{isGenerating === sale.id ? 'Generating...' : 'Generate Invoice'}
							</button>
						</form>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Invoices Table -->
	<div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
		<table class="min-w-full divide-y divide-slate-800">
			<thead class="bg-slate-900/80">
				<tr>
					<th scope="col" class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">Invoice #</th>
					<th scope="col" class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">Customer</th>
					<th scope="col" class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">Amount</th>
					<th scope="col" class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">Status & Due</th>
					<th scope="col" class="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-300 uppercase">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-800">
				{#each data.invoices as invoice (invoice.id)}
					<tr class="transition-colors hover:bg-slate-800/40">
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-mono">
							<a href="/invoices/{invoice.id}" class="hover:text-emerald-400 hover:underline">{invoice.invoiceNumber}</a>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
							{invoice.sale.customerName}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400">
							${Number(invoice.sale.totalAmount).toFixed(2)}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex flex-col gap-1 items-start">
								<span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset {invoice.status === 'PAID' ? 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20' : 'bg-rose-400/10 text-rose-400 ring-rose-400/20'}">
									{invoice.status}
								</span>
								<span class="text-xs text-slate-500">
									Due: {new Date(invoice.dueDate).toLocaleDateString()}
								</span>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<div class="flex items-center justify-end gap-3">
								<a href="/invoices/{invoice.id}" class="text-slate-400 hover:text-white" title="Print/View">
									<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6.728 6.728A10.5 10.5 0 0112 4.5c2.81 0 5.378 1.05 7.272 2.768M6.728 6.728A10.5 10.5 0 004.5 12c0 2.81 1.05 5.378 2.728 7.272m0-12.544l10.544 10.544M17.272 17.272A10.5 10.5 0 0022.5 12c0-2.81-1.05-5.378-2.728-7.272M17.272 17.272A10.5 10.5 0 0112 19.5c-2.81 0-5.378-1.05-7.272-2.768" />
									</svg>
								</a>
								
								{#if invoice.status === 'UNPAID'}
									<form
										method="POST"
										action="?/markPaid"
										use:enhance={() => {
											isMarkingPaid = invoice.id;
											return async ({ update }) => {
												isMarkingPaid = null;
												await update();
											};
										}}
									>
										<input type="hidden" name="invoiceId" value={invoice.id} />
										<button
											type="submit"
											disabled={isMarkingPaid !== null}
											class="text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
											title="Mark as Paid"
										>
											<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
											</svg>
										</button>
									</form>
								{/if}
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-sm text-slate-500">
							No invoices generated yet.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
