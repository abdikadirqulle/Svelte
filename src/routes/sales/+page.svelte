<script lang="ts">
	import { enhance } from '$app/forms';
	import { toastStore } from '$lib/toast.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData & { field_errors?: Record<string, string[]> } } = $props();

	// POS Cart State
	type CartItem = {
		product: typeof data.products[0];
		quantity: number;
	};

	let cart = $state<CartItem[]>([]);
	let customerName = $state('');
	let isSubmitting = $state(false);

	// Derived stores
	let cartTotal = $derived(cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0));
	let cartItemCount = $derived(cart.reduce((count, item) => count + item.quantity, 0));

	$effect(() => {
		if (form?.success) {
			toastStore.add(form.message as string, 'success');
			cart = [];
			customerName = '';
		} else if (form?.message) {
			toastStore.add(form.message as string, 'error');
		}
	});

	function productFromId(id: string) {
		return data.products.find((p) => p.id === id);
	}

	function addToCart(productId: string) {
		const product = productFromId(productId);
		if (!product) return;

		const existing = cart.find((i) => i.product.id === productId);
		
		if (existing) {
			if (existing.quantity >= product.stockQuantity) {
				toastStore.add(`Cannot add more. Only ${product.stockQuantity} in stock.`, 'error');
				return;
			}
			existing.quantity += 1;
		} else {
			if (product.stockQuantity < 1) {
				toastStore.add('Out of stock', 'error');
				return;
			}
			cart.push({ product, quantity: 1 });
		}
	}

	function removeFromCart(productId: string) {
		cart = cart.filter((i) => i.product.id !== productId);
	}

	function updateQuantity(productId: string, qty: number) {
		const item = cart.find(i => i.product.id === productId);
		const product = productFromId(productId);
		if (!item || !product) return;

		if (qty > product.stockQuantity) {
			item.quantity = product.stockQuantity;
			toastStore.add(`Max stock is ${product.stockQuantity}`, 'info');
		} else if (qty < 1) {
			removeFromCart(productId);
		} else {
			item.quantity = qty;
		}
	}

</script>

<svelte:head>
	<title>Point of Sale | Finance Tracker ERP</title>
</svelte:head>

<div class="flex flex-col gap-6 lg:flex-row">
	<!-- Left side: Products catalog -->
	<div class="flex flex-1 flex-col gap-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-white">Point of Sale</h1>
			<p class="text-sm text-slate-400">Add items to cart and process sale.</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{#each data.products as product (product.id)}
				<button 
					type="button"
					onclick={() => addToCart(product.id)}
					disabled={product.stockQuantity === 0}
					class="flex flex-col items-start rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-left shadow-sm transition-all hover:border-emerald-500/50 hover:bg-slate-800 disabled:opacity-50 disabled:hover:border-slate-800 disabled:hover:bg-slate-900/50"
				>
					<span class="text-xs font-medium text-slate-500">{product.category}</span>
					<span class="mt-1 text-base font-medium text-white line-clamp-1">{product.name}</span>
					<div class="mt-3 flex w-full flex-row items-center justify-between">
						<span class="text-lg font-bold text-emerald-400">${Number(product.price).toFixed(2)}</span>
						<span class="text-xs text-slate-400">Stock: {product.stockQuantity}</span>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Right side: Cart context -->
	<div class="flex w-full flex-col lg:w-96 xl:w-[400px]">
		<div class="sticky top-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
			<h2 class="text-lg font-semibold text-white">Order Summary</h2>

			<!-- Cart Items -->
			<div class="flex max-h-80 flex-col gap-3 overflow-y-auto pr-2">
				{#each cart as item (item.product.id)}
					<div class="flex items-center justify-between border-b border-slate-800/50 pb-3">
						<div class="flex flex-1 flex-col">
							<span class="text-sm font-medium text-white">{item.product.name}</span>
							<span class="text-xs text-slate-400 font-mono">{item.product.sku}</span>
						</div>
						<div class="flex flex-col items-end gap-2">
							<span class="text-sm font-bold text-slate-200">${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
							<div class="flex items-center gap-1 rounded-lg bg-slate-950 p-1">
								<button type="button" aria-label="Decrease quantity" onclick={() => updateQuantity(item.product.id, item.quantity - 1)} class="text-slate-400 hover:text-white px-1">-</button>
								<span class="text-xs w-6 text-center text-slate-200">{item.quantity}</span>
								<button type="button" aria-label="Increase quantity" onclick={() => updateQuantity(item.product.id, item.quantity + 1)} class="text-slate-400 hover:text-white px-1">+</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="flex h-32 flex-col items-center justify-center text-slate-500">
						<svg class="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
						</svg>
						<span class="text-sm">Cart is empty</span>
					</div>
				{/each}
			</div>

			<div class="border-t border-slate-700 pt-4">
				<div class="flex justify-between text-base font-semibold text-white">
					<span>Total</span>
					<span>${cartTotal.toFixed(2)}</span>
				</div>
				<p class="mt-1 text-xs text-slate-400">{cartItemCount} items</p>
			</div>

			<form 
				method="POST" 
				action="?/processSale"
				use:enhance={({ cancel }) => {
					if (cart.length === 0) {
						toastStore.add('Cart is empty', 'error');
						cancel();
						return;
					}
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="mt-4 flex flex-col gap-4"
			>
				<div>
					<label for="customerName" class="sr-only">Customer Name</label>
					<input 
						type="text" 
						id="customerName" 
						name="customerName" 
						bind:value={customerName}
						placeholder="Customer Name" 
						required 
						class="w-full rounded-xl border-slate-700 bg-slate-950 py-2.5 px-3 text-sm text-white placeholder-slate-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
					/>
					{#if form?.field_errors?.customerName}
						<p class="mt-1 text-xs text-red-500">{form.field_errors.customerName[0]}</p>
					{/if}
				</div>

				<input 
					type="hidden" 
					name="items" 
					value={JSON.stringify(cart.map(i => ({ productId: i.product.id, quantity: i.quantity })))} 
				/>

				<button 
					type="submit" 
					disabled={cart.length === 0 || isSubmitting || !customerName.trim()}
					class="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500 disabled:opacity-50"
				>
					{isSubmitting ? 'Processing...' : 'Complete Sale'}
				</button>
			</form>
		</div>
	</div>
</div>
