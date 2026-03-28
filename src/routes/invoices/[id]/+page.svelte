<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { invoice } = data;
	const { sale } = invoice;
</script>

<svelte:head>
	<title>Invoice {invoice.invoiceNumber} | Finance Tracker ERP</title>
</svelte:head>

<div class="print:m-0 mx-auto max-w-4xl print:max-w-none">
	<!-- Actions (hidden when printing) -->
	<div class="print:hidden mb-6 flex items-center justify-between">
		<a href="/invoices" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
			</svg>
			Back to Invoices
		</a>
		<button
			type="button"
			onclick={() => window.print()}
			class="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6.728 6.728A10.5 10.5 0 0112 4.5c2.81 0 5.378 1.05 7.272 2.768M6.728 6.728A10.5 10.5 0 004.5 12c0 2.81 1.05 5.378 2.728 7.272m0-12.544l10.544 10.544M17.272 17.272A10.5 10.5 0 0022.5 12c0-2.81-1.05-5.378-2.728-7.272M17.272 17.272A10.5 10.5 0 0112 19.5c-2.81 0-5.378-1.05-7.272-2.768" />
			</svg>
			Print Invoice
		</button>
	</div>

	<!-- Printable Invoice Document -->
	<div class="print:shadow-none print:border-none rounded-2xl border border-slate-800 bg-white p-10 text-slate-900 shadow-xl print:text-black print:p-0">
		<!-- Header -->
		<div class="flex justify-between items-start border-b border-slate-200 pb-8">
			<div>
				<h1 class="text-3xl font-extrabold tracking-tight text-slate-900">INVOICE</h1>
				<p class="mt-2 text-sm text-slate-500 font-mono">{invoice.invoiceNumber}</p>
			</div>
			<div class="text-right">
				<h2 class="text-xl font-bold">Finance Tracker ERP</h2>
				<p class="text-sm text-slate-500 mt-1">123 Business Rd, Tech City</p>
				<p class="text-sm text-slate-500">contact@financetracker.local</p>
			</div>
		</div>

		<!-- Meta -->
		<div class="mt-8 flex justify-between">
			<div class="w-1/2">
				<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Bill To</h3>
				<p class="mt-2 text-lg font-medium text-slate-900">{sale.customerName}</p>
				<p class="text-sm text-slate-500 mt-1">Sale Ref: <span class="font-mono">{sale.id.slice(0, 8)}</span></p>
			</div>
			<div class="w-1/2 flex gap-12 justify-end text-right">
				<div>
					<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Date</h3>
					<p class="mt-2 font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</p>
				</div>
				<div>
					<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Due Date</h3>
					<p class="mt-2 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
				</div>
				<div>
					<h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Status</h3>
					<div class="mt-2">
						{#if invoice.status === 'PAID'}
							<span class="inline-flex rounded-md bg-emerald-100 px-2 py-1 text-sm font-bold text-emerald-800 print:bg-transparent print:border print:border-emerald-800">PAID</span>
						{:else}
							<span class="inline-flex rounded-md bg-rose-100 px-2 py-1 text-sm font-bold text-rose-800 print:bg-transparent print:border print:border-rose-800">UNPAID</span>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Line Items -->
		<div class="mt-12">
			<table class="min-w-full divide-y divide-slate-200">
				<thead>
					<tr>
						<th scope="col" class="py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Item Details</th>
						<th scope="col" class="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Qty</th>
						<th scope="col" class="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Rate</th>
						<th scope="col" class="py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each sale.saleItems as item (item.id)}
						<tr>
							<td class="py-4">
								<p class="font-medium text-slate-900">{item.product.name}</p>
								<p class="text-xs text-slate-500 font-mono mt-0.5">SKU: {item.product.sku}</p>
							</td>
							<td class="py-4 px-4 text-center text-slate-600">{item.quantity}</td>
							<td class="py-4 px-4 text-right text-slate-600">${Number(item.priceAtSale).toFixed(2)}</td>
							<td class="py-4 text-right font-medium text-slate-900">${(Number(item.priceAtSale) * item.quantity).toFixed(2)}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th scope="row" colspan="3" class="pt-8 text-right text-sm font-medium text-slate-500">Subtotal</th>
						<td class="pt-8 text-right text-sm text-slate-900">${Number(sale.totalAmount).toFixed(2)}</td>
					</tr>
					<tr>
						<th scope="row" colspan="3" class="pt-4 text-right text-sm font-bold text-slate-900">Total Due</th>
						<td class="pt-4 text-right text-xl font-bold text-slate-900">${Number(sale.totalAmount).toFixed(2)}</td>
					</tr>
				</tfoot>
			</table>
		</div>

		<!-- Footer -->
		<div class="mt-16 text-center text-sm text-slate-500 border-t border-slate-200 pt-8">
			<p>Thank you for your business!</p>
			<p class="mt-1">Please include invoice number on your check or remittance advice.</p>
		</div>
	</div>
</div>

<style>
	/* Print-specific layout hiding everything outside the main component area */
	@media print {
		:global(body) {
			background: white !important;
		}
		:global(aside), :global(header) {
			display: none !important;
		}
		:global(main) {
			padding: 0 !important;
			margin: 0 !important;
		}
	}
</style>
