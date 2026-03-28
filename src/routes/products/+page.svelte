<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { toastStore } from '$lib/toast.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: (ActionData & { values?: Record<string, string>, field_errors?: Record<string, string[]> }) | null } = $props();

	let showModal = $state(false);
	let isSubmitting = $state(false);
	let currentForm = $state<'addProduct' | 'updateProduct' | null>(null);

	// Derived state to check if modal should be open due to errors
	$effect(() => {
		if (form && !form.success) {
			showModal = true;
			currentForm = form.action as 'addProduct' | 'updateProduct';
		}
	});

	$effect(() => {
		if (form?.success && form.message) {
			toastStore.add(form.message as string, 'success');
			showModal = false;
			currentForm = null;
		} else if (form?.message) {
			toastStore.add(form.message as string, 'error');
		}
	});

	// Search query handled by native GET form with value={data.search}

	function openAddModal() {
		form = null;
		currentForm = 'addProduct';
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		currentForm = null;
		form = null;
	}

</script>

<svelte:head>
	<title>Products | Finance Tracker ERP</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-white">Products</h1>
			<p class="text-sm text-slate-400">Manage your inventory, SKUs, and pricing.</p>
		</div>
		<button
			type="button"
			onclick={openAddModal}
			class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-500"
		>
			Add Product
		</button>
	</div>

	<!-- Search Bar -->
	<form class="flex max-w-md items-center gap-2" method="GET" data-sveltekit-keepfocus>
		<label for="search" class="sr-only">Search products</label>
		<div class="relative flex-1">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<svg class="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
				</svg>
			</div>
			<input
				id="search"
				name="search"
				type="search"
				value={data.search}
				placeholder="Search by name or SKU..."
				class="block w-full rounded-xl border-slate-700 bg-slate-900/50 py-2 pl-10 pr-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
			/>
		</div>
		<button
			type="submit"
			class="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
		>
			Search
		</button>
	</form>

	<!-- Products Table -->
	<div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
		<table class="min-w-full divide-y divide-slate-800">
			<thead class="bg-slate-900/80">
				<tr>
					<th scope="col" class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">Product Details</th>
					<th scope="col" class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">SKU</th>
					<th scope="col" class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">Price</th>
					<th scope="col" class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-300 uppercase">Stock</th>
					<th scope="col" class="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-300 uppercase">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-800">
				{#each data.products as product (product.id)}
					<tr class="transition-colors hover:bg-slate-800/40">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex flex-col">
								<span class="text-sm font-medium text-white">{product.name}</span>
								<span class="text-xs text-slate-500">{product.category}</span>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">
							{product.sku}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
							${Number(product.price).toFixed(2)}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span
								class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset {product.stockQuantity < 5 ? 'bg-red-400/10 text-red-400 ring-red-400/20' : 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20'}"
							>
								{product.stockQuantity} in stock
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<!-- For now, we only have Add. Update can be added to this action list. -->
							<button class="text-slate-400 hover:text-emerald-400" aria-label="Edit">
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
								</svg>
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-sm text-slate-500">
							No products found. Start by adding one.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		
		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="flex items-center justify-between border-t border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-6">
				<div class="flex flex-1 justify-between sm:hidden">
					<a href="?page={Math.max(1, data.page - 1)}&search={data.search}" class="relative inline-flex items-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700">Previous</a>
					<a href="?page={Math.min(data.totalPages, data.page + 1)}&search={data.search}" class="relative ml-3 inline-flex items-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700">Next</a>
				</div>
				<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
					<div>
						<p class="text-sm text-slate-400">
							Showing <span class="font-medium text-white">{Math.min(data.totalCount, (data.page - 1) * 20 + 1)}</span> to <span class="font-medium text-white">{Math.min(data.totalCount, data.page * 20)}</span> of <span class="font-medium text-white">{data.totalCount}</span> results
						</p>
					</div>
					<div>
						<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
							<a href="?page={Math.max(1, data.page - 1)}&search={data.search}" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-800 hover:bg-slate-800 focus:z-20 focus:outline-offset-0">
								<span class="sr-only">Previous</span>
								<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
									<path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
								</svg>
							</a>
							<span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-slate-800 focus:z-20 focus:outline-offset-0">Page {data.page} of {data.totalPages}</span>
							<a href="?page={Math.min(data.totalPages, data.page + 1)}&search={data.search}" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-800 hover:bg-slate-800 focus:z-20 focus:outline-offset-0">
								<span class="sr-only">Next</span>
								<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
									<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
								</svg>
							</a>
						</nav>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Modal Form for Add/Edit -->
{#if showModal}
	<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"></div>

		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div class="relative transform overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
					<form 
						method="POST" 
						action="?/{currentForm}" 
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								await update();
							};
						}}
					>
						<div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
								<div class="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
									<h3 class="text-xl font-semibold leading-6 text-white" id="modal-title">
										{currentForm === 'addProduct' ? 'Add New Product' : 'Edit Product'}
									</h3>
									<div class="mt-6 flex flex-col gap-4">
										<div>
											<label for="name" class="block text-sm font-medium text-slate-300 text-left">Product Name</label>
											<input type="text" name="name" id="name" value={form?.values?.name ?? ''} class="mt-1 block w-full rounded-xl border-slate-700 bg-slate-950 py-2 px-3 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="e.g. Wireless Mouse" />
											{#if form?.field_errors?.name}
												<p class="mt-1 text-sm text-red-500 text-left">{form.field_errors.name[0]}</p>
											{/if}
										</div>

										<div class="grid grid-cols-2 gap-4">
											<div>
												<label for="sku" class="block text-sm font-medium text-slate-300 text-left">SKU</label>
												<input type="text" name="sku" id="sku" value={form?.values?.sku ?? ''} class="mt-1 block w-full rounded-xl border-slate-700 bg-slate-950 py-2 px-3 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm font-mono" placeholder="MOUSE-001" />
												{#if form?.field_errors?.sku}
													<p class="mt-1 text-sm text-red-500 text-left">{form.field_errors.sku[0]}</p>
												{/if}
											</div>
											<div>
												<label for="category" class="block text-sm font-medium text-slate-300 text-left">Category</label>
												<input type="text" name="category" id="category" value={form?.values?.category ?? ''} class="mt-1 block w-full rounded-xl border-slate-700 bg-slate-950 py-2 px-3 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="Electronics" />
												{#if form?.field_errors?.category}
													<p class="mt-1 text-sm text-red-500 text-left">{form.field_errors.category[0]}</p>
												{/if}
											</div>
										</div>

										<div class="grid grid-cols-2 gap-4">
											<div>
												<label for="price" class="block text-sm font-medium text-slate-300 text-left">Price ($)</label>
												<input type="number" step="0.01" min="0" name="price" id="price" value={form?.values?.price ?? ''} class="mt-1 block w-full rounded-xl border-slate-700 bg-slate-950 py-2 px-3 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="29.99" />
												{#if form?.field_errors?.price}
													<p class="mt-1 text-sm text-red-500 text-left">{form.field_errors.price[0]}</p>
												{/if}
											</div>
											<div>
												<label for="stockQuantity" class="block text-sm font-medium text-slate-300 text-left">Stock Quantity</label>
												<input type="number" min="0" step="1" name="stockQuantity" id="stockQuantity" value={form?.values?.stockQuantity ?? '0'} class="mt-1 block w-full rounded-xl border-slate-700 bg-slate-950 py-2 px-3 text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
												{#if form?.field_errors?.stockQuantity}
													<p class="mt-1 text-sm text-red-500 text-left">{form.field_errors.stockQuantity[0]}</p>
												{/if}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="bg-slate-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button type="submit" disabled={isSubmitting} class="inline-flex w-full justify-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 sm:ml-3 sm:w-auto">
								{isSubmitting ? 'Saving...' : 'Save Product'}
							</button>
							<button type="button" onclick={closeModal} class="mt-3 inline-flex w-full justify-center rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 shadow-sm ring-1 ring-inset ring-slate-700 hover:bg-slate-700 sm:mt-0 sm:w-auto">
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}
