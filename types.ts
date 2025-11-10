export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  categoryId: number | null;
  name: string;
  sku: string | null;
  description: string;
  units: string | null;
  currency: string;
  priceCents: number | null;
  tags: Tag[];
  imageUrls: string[];
  amount: number | null;
}

export interface User {
  id: number;
  hub_id: number;
  name: string;
  email: string | null;
  phone: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type View =
  | { type: "home" }
  | { type: "category"; categoryId: number; categoryName: string }
  | { type: "product"; productId: number }
  | { type: "tag"; tagId: number; tagName: string };
