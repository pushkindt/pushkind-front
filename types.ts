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
}

export interface User {
  id: string;
  phone: string;
  name: string;
  priceLevel: "default" | "silver" | "gold";
}

export interface CartItem extends Product {
  quantity: number;
}

export type View =
  | { type: "home" }
  | { type: "category"; categoryId: number; categoryName: string }
  | { type: "product"; productId: number }
  | { type: "tag"; tagId: number; tagName: string };
