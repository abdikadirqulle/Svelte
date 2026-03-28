export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

function createToastStore() {
	let toasts = $state<Toast[]>([]);

	function add(message: string, type: ToastType = 'info'): void {
		const id = crypto.randomUUID();
		toasts = [...toasts, { id, message, type }];
		setTimeout(() => remove(id), 4000);
	}

	function remove(id: string): void {
		toasts = toasts.filter((t) => t.id !== id);
	}

	return {
		get toasts() {
			return toasts;
		},
		add,
		remove
	};
}

export const toastStore = createToastStore();
