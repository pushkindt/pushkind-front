
export interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  categoryId: number;
  tags: number[];
}

export interface User {
  id: string;
  phone: string;
  name: string;
  priceLevel: 'default' | 'silver' | 'gold';
}

export interface CartItem extends Product {
  quantity: number;
}

export type View =
  | { type: 'home' }
  | { type: 'category'; categoryId: number; categoryName: string }
  | { type: 'product'; productId: number }
  | { type: 'tag'; tagId: number; tagName: string };
