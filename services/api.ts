import { API_URL, HUB_ID } from "../constants";
import type { Category, Product, Tag, User } from "../types";

// --- MOCK DATABASE ---

const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Electronics",
    imageUrl: "https://picsum.photos/seed/electronics/600/400",
  },
  {
    id: 2,
    name: "Apparel",
    imageUrl: "https://picsum.photos/seed/apparel/600/400",
  },
  {
    id: 3,
    name: "Groceries",
    imageUrl: "https://picsum.photos/seed/groceries/600/400",
  },
  {
    id: 4,
    name: "Home Goods",
    imageUrl: "https://picsum.photos/seed/homegoods/600/400",
  },
];

const MOCK_TAGS: Tag[] = [
  { id: 1, name: "New Arrival" },
  { id: 2, name: "On Sale" },
  { id: 3, name: "Bestseller" },
  { id: 4, name: "Eco-Friendly" },
];

const MOCK_PRODUCTS: Omit<Product, "price" | "originalPrice">[] = [
  {
    id: 101,
    name: "Smart Noise-Cancelling Headphones",
    description:
      "Immerse yourself in high-fidelity audio with these sleek, wireless headphones. Long-lasting battery and comfortable design.",
    imageUrl: "https://picsum.photos/seed/product101/600/600",
    categoryId: 1,
    tags: [1, 3],
  },
  {
    id: 102,
    name: "Organic Cotton T-Shirt",
    description:
      "A classic, comfortable t-shirt made from 100% organic cotton. Perfect for everyday wear.",
    imageUrl: "https://picsum.photos/seed/product102/600/600",
    categoryId: 2,
    tags: [4],
  },
  {
    id: 103,
    name: "Artisanal Sourdough Bread",
    description:
      "Freshly baked sourdough bread with a crispy crust and soft, chewy interior. Made with locally sourced ingredients.",
    imageUrl: "https://picsum.photos/seed/product103/600/600",
    categoryId: 3,
    tags: [3],
  },
  {
    id: 104,
    name: "Modern Minimalist Desk Lamp",
    description:
      "Illuminate your workspace with this stylish and functional LED desk lamp. Features adjustable brightness.",
    imageUrl: "https://picsum.photos/seed/product104/600/600",
    categoryId: 4,
    tags: [1],
  },
  {
    id: 105,
    name: "Portable Power Bank 20000mAh",
    description:
      "Never run out of battery again with this high-capacity power bank. Charges multiple devices at once.",
    imageUrl: "https://picsum.photos/seed/product105/600/600",
    categoryId: 1,
    tags: [],
  },
  {
    id: 106,
    name: "All-Weather Performance Jacket",
    description:
      "Stay dry and comfortable in any weather with this waterproof and breathable jacket. On sale now!",
    imageUrl: "https://picsum.photos/seed/product106/600/600",
    categoryId: 2,
    tags: [2],
  },
  {
    id: 107,
    name: "Gourmet Coffee Beans",
    description:
      "A rich and aromatic blend of single-origin Arabica coffee beans. Ethically sourced and expertly roasted.",
    imageUrl: "https://picsum.photos/seed/product107/600/600",
    categoryId: 3,
    tags: [3, 4],
  },
  {
    id: 108,
    name: "Ergonomic Office Chair",
    description:
      "Improve your posture and comfort with this fully adjustable ergonomic office chair. A bestseller for a reason.",
    imageUrl: "https://picsum.photos/seed/product108/600/600",
    categoryId: 4,
    tags: [3],
  },
];

const MOCK_USERS: User[] = [
  { id: "user-1", phone: "5551112222", name: "Alice", priceLevel: "gold" },
  { id: "user-2", phone: "5553334444", name: "Bob", priceLevel: "silver" },
];

const MOCK_BASE_PRICES: { [productId: number]: number } = {
  101: 249.99,
  102: 25.0,
  103: 7.5,
  104: 59.99,
  105: 45.0,
  106: 120.0,
  107: 18.99,
  108: 350.0,
};

// --- MOCK API LOGIC ---

const applyPriceLevel = (
  basePrice: number,
  priceLevel: User["priceLevel"],
): { price: number; originalPrice?: number } => {
  let price = basePrice;
  let originalPrice: number | undefined = undefined;

  if (priceLevel !== "default") {
    originalPrice = basePrice;
    if (priceLevel === "silver") price *= 0.95; // 5% discount
    if (priceLevel === "gold") price *= 0.9; // 10% discount
  }

  return { price: parseFloat(price.toFixed(2)), originalPrice };
};

const getProductWithPrice = (
  product: Omit<Product, "price" | "originalPrice">,
  user: User | null,
): Product => {
  const basePrice = MOCK_BASE_PRICES[product.id];
  const priceLevel = user ? user.priceLevel : "default";
  const { price, originalPrice } = applyPriceLevel(basePrice, priceLevel);
  return { ...product, price, originalPrice };
};

const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const BASE_API_URL = API_URL.replace(/\/$/, "");
const logMockRequest = (
  method: string,
  path: string,
  hubId: string,
  details?: unknown,
) => {
  const url = `${BASE_API_URL}/hubs/${hubId}${path}`;
  if (details !== undefined) {
    console.log(`[mock:${method}] ${url}`, details);
  } else {
    console.log(`[mock:${method}] ${url}`);
  }
};

// --- EXPORTED API FUNCTIONS ---

export const fetchCategories = async (
  hubId: string = HUB_ID,
): Promise<Category[]> => {
  logMockRequest("GET", "/categories", hubId);
  await simulateDelay(300);
  return MOCK_CATEGORIES;
};

export const fetchTags = async (hubId: string = HUB_ID): Promise<Tag[]> => {
  logMockRequest("GET", "/tags", hubId);
  await simulateDelay(200);
  return MOCK_TAGS;
};

export const fetchProducts = async (
  hubId: string = HUB_ID,
  user: User | null,
  filter: { categoryId?: number; tagId?: number } = {},
): Promise<Product[]> => {
  logMockRequest("GET", "/products", hubId, filter);
  await simulateDelay(500);
  let products = MOCK_PRODUCTS;

  if (filter.categoryId) {
    products = products.filter((p) => p.categoryId === filter.categoryId);
  }
  if (filter.tagId) {
    products = products.filter((p) => p.tags.includes(filter.tagId!));
  }

  return products.map((p) => getProductWithPrice(p, user));
};

export const fetchProductById = async (
  hubId: string = HUB_ID,
  user: User | null,
  productId: number,
): Promise<Product | undefined> => {
  logMockRequest("GET", `/products/${productId}`, hubId);
  await simulateDelay(400);
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  return product ? getProductWithPrice(product, user) : undefined;
};

export const sendOtp = async (
  hubId: string = HUB_ID,
  phone: string,
): Promise<{ success: boolean }> => {
  logMockRequest("POST", "/auth/otp", hubId, { phone });
  await simulateDelay(1000);
  const userExists = MOCK_USERS.some((u) => u.phone === phone);
  if (userExists) {
    // In a real app, an OTP like '123456' would be sent via SMS
    console.log(`Mock OTP for ${phone} is 123456`);
    return { success: true };
  }
  return { success: false };
};

export const verifyOtp = async (
  hubId: string = HUB_ID,
  phone: string,
  otp: string,
): Promise<{ success: boolean; user?: User }> => {
  logMockRequest("POST", "/auth/otp/verify", hubId, { phone, otp });
  await simulateDelay(1000);
  if (otp === "123456") {
    const user = MOCK_USERS.find((u) => u.phone === phone);
    if (user) {
      return { success: true, user };
    }
  }
  return { success: false };
};
