/**
 * @file types.ts contains shared domain interfaces used across the app.
 */

/** Domain category metadata. */
export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

/** Product tag metadata. */
export interface Tag {
  id: number;
  name: string;
}

/** Storefront product representation. */
export interface Product {
  id: number;
  categoryId: number | null;
  name: string;
  vendorName?: string | null;
  sku: string | null;
  description: string;
  units: string | null;
  currency: string;
  priceCents: number | null;
  basePriceCents: number | null;
  tags: Tag[];
  imageUrls: string[];
  amount: number | null;
}

/** Authenticated customer profile. */
export interface User {
  id: number;
  hub_id: number;
  name: string;
  email: string | null;
  phone: string;
}

/** Product plus quantity stored inside the cart. */
export interface CartItem extends Product {
  quantity: number;
}

/** Individual item within an order. */
export interface OrderLineItem {
  productId: number;
  quantity: number;
  priceCents: number | null;
  name: string;
  approvedQuantity: number | null;
}

/** Customer order metadata. */
export interface Order {
  id: number;
  status: string;
  currency: string;
  totalCents: number;
  createdAt: string;
  products: OrderLineItem[];
  // Optional shipping address.
  shippingAddress: string | null;
  // Optional consignee.
  consignee: string | null;
  // Optional delivery notes.
  deliveryNotes: string | null;
  // Optional payer.
  payer: string | null;
}

/** Supported product layout toggles. */
export type ProductLayout = "grid" | "list";

/**
 * Typed representation of the current navigation target rendered by `App`.
 */
export type View =
  | { type: "home" }
  | { type: "category"; categoryId: number; categoryName: string }
  | { type: "product"; productId: number }
  | { type: "tag"; tagId: number; tagName: string }
  | { type: "orders" };
