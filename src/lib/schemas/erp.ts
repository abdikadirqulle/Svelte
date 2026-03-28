import { z } from 'zod';

// ─── Product schemas ──────────────────────────────────────────────────────────

export const addProductSchema = z.object({
	name: z.string().min(1, 'Name is required').max(200),
	sku: z.string().min(1, 'SKU is required').max(100).regex(/^\S+$/, 'SKU must not contain spaces'),
	price: z.coerce.number().positive('Price must be positive'),
	stockQuantity: z.coerce
		.number()
		.int('Stock must be a whole number')
		.min(0, 'Stock cannot be negative'),
	category: z.string().min(1, 'Category is required').max(100)
});

export const updateProductSchema = addProductSchema.extend({
	id: z.string().min(1)
});

export type AddProductInput = z.infer<typeof addProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ─── Sale schemas ─────────────────────────────────────────────────────────────

export const saleItemSchema = z.object({
	productId: z.string().min(1, 'Product ID is required'),
	quantity: z.coerce.number().int().positive('Quantity must be at least 1')
});

export const processSaleSchema = z.object({
	customerName: z.string().min(1, 'Customer name is required').max(200),
	items: z.array(saleItemSchema).min(1, 'At least one item is required')
});

export type ProcessSaleInput = z.infer<typeof processSaleSchema>;
export type SaleItemInput = z.infer<typeof saleItemSchema>;

// ─── Invoice schemas ──────────────────────────────────────────────────────────

export const generateInvoiceSchema = z.object({
	saleId: z.string().min(1, 'Sale ID is required')
});

export const markPaidSchema = z.object({
	invoiceId: z.string().min(1, 'Invoice ID is required')
});

export type GenerateInvoiceInput = z.infer<typeof generateInvoiceSchema>;
