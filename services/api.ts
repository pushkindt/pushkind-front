import { API_URL, HUB_ID } from "../constants";
import type { Category, Product, Tag, User } from "../types";

// --- MOCK DATABASE ---

const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    parentId: null,
    name: "Electronics",
    description: "Latest gadgets, devices, and accessories.",
    imageUrl: "https://picsum.photos/seed/electronics/600/400",
  },
  {
    id: 5,
    parentId: 1,
    name: "Smartphones",
    description: "Flagship and budget phones from top brands.",
    imageUrl: "https://picsum.photos/seed/smartphones/600/400",
  },
  {
    id: 6,
    parentId: 1,
    name: "Audio & Headphones",
    description: "Headphones, earbuds, and portable speakers.",
    imageUrl: "https://picsum.photos/seed/audio/600/400",
  },
  {
    id: 2,
    parentId: null,
    name: "Apparel",
    description: "Fashionable clothing and accessories.",
    imageUrl: "https://picsum.photos/seed/apparel/600/400",
  },
  {
    id: 7,
    parentId: 2,
    name: "Men's Clothing",
    description: "Everyday staples and seasonal menswear.",
    imageUrl: "https://picsum.photos/seed/mens-clothing/600/400",
  },
  {
    id: 8,
    parentId: 2,
    name: "Women's Clothing",
    description: "From casual basics to statement pieces.",
    imageUrl: "https://picsum.photos/seed/womens-clothing/600/400",
  },
  {
    id: 3,
    parentId: null,
    name: "Groceries",
    description: "Fresh produce, pantry staples, and more.",
    imageUrl: "https://picsum.photos/seed/groceries/600/400",
  },
  {
    id: 9,
    parentId: 3,
    name: "Fresh Produce",
    description: "Farm-fresh fruits and vegetables.",
    imageUrl: "https://picsum.photos/seed/produce/600/400",
  },
  {
    id: 10,
    parentId: 3,
    name: "Pantry Staples",
    description: "Dry goods, spices, and everyday cooking needs.",
    imageUrl: "https://picsum.photos/seed/pantry/600/400",
  },
  {
    id: 4,
    parentId: null,
    name: "Home Goods",
    description: "Furniture, decor, and household must-haves.",
    imageUrl: "https://picsum.photos/seed/homegoods/600/400",
  },
  {
    id: 11,
    parentId: 4,
    name: "Kitchen & Dining",
    description: "Cookware, tableware, and entertaining essentials.",
    imageUrl: "https://picsum.photos/seed/kitchen-dining/600/400",
  },
  {
    id: 12,
    parentId: 4,
    name: "Home Office",
    description: "Workspace furniture, lighting, and organizers.",
    imageUrl: "https://picsum.photos/seed/home-office/600/400",
  },
];

const MOCK_TAGS: Tag[] = [
  { id: 1, name: "New Arrival" },
  { id: 2, name: "On Sale" },
  { id: 3, name: "Bestseller" },
  { id: 4, name: "Eco-Friendly" },
];

const [tagNewArrival, tagOnSale, tagBestseller, tagEcoFriendly] = MOCK_TAGS;

const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "Smart Noise-Cancelling Headphones",
    sku: "SKU-101",
    description:
      "Immerse yourself in high-fidelity audio with these sleek, wireless headphones. Long-lasting battery and comfortable design.",
    units: "pcs",
    currency: "USD",
    imageUrls: [
      "https://picsum.photos/seed/product101/600/600",
      "https://picsum.photos/seed/product101-alt/600/600",
    ],
    categoryId: 1,
    tags: [tagNewArrival, tagBestseller],
    priceCents: 24999,
  },
  {
    id: 102,
    name: "Organic Cotton T-Shirt",
    sku: "SKU-102",
    description:
      "A classic, comfortable t-shirt made from 100% organic cotton. Perfect for everyday wear.",
    units: "pcs",
    currency: "USD",
    imageUrls: [
      "https://picsum.photos/seed/product102/600/600",
      "https://picsum.photos/seed/product102-alt/600/600",
    ],
    categoryId: 2,
    tags: [tagEcoFriendly],
    priceCents: 2500,
  },
  {
    id: 103,
    name: "Artisanal Sourdough Bread",
    sku: "SKU-103",
    description:
      "Freshly baked sourdough bread with a crispy crust and soft, chewy interior. Made with locally sourced ingredients.",
    units: "loaf",
    currency: "USD",
    imageUrls: [
      "https://picsum.photos/seed/product103/600/600",
      "https://picsum.photos/seed/product103-alt/600/600",
    ],
    categoryId: 3,
    tags: [tagBestseller],
    priceCents: 750,
  },
  {
    id: 104,
    name: "Modern Minimalist Desk Lamp",
    sku: "SKU-104",
    description:
      "Illuminate your workspace with this stylish and functional LED desk lamp. Features adjustable brightness.",
    units: "pcs",
    currency: "USD",
    imageUrls: [
      "https://picsum.photos/seed/product104/600/600",
      "https://picsum.photos/seed/product104-alt/600/600",
    ],
    categoryId: 4,
    tags: [tagNewArrival],
    priceCents: 5999,
  },
  {
    id: 105,
    name: "Portable Power Bank 20000mAh",
    sku: "SKU-105",
    description:
      "Never run out of battery again with this high-capacity power bank. Charges multiple devices at once.",
    units: "pcs",
    currency: "USD",
    imageUrls: [
      "https://picsum.photos/seed/product105/600/600",
      "https://picsum.photos/seed/product105-alt/600/600",
    ],
    categoryId: 1,
    tags: [],
    priceCents: 4500,
  },
  {
    id: 106,
    name: "All-Weather Performance Jacket",
    sku: "SKU-106",
    description:
      "Stay dry and comfortable in any weather with this waterproof and breathable jacket. On sale now!",
    units: "pcs",
    currency: "USD",
    imageUrls: [
      "https://picsum.photos/seed/product106/600/600",
      "https://picsum.photos/seed/product106-alt/600/600",
    ],
    categoryId: 2,
    tags: [tagOnSale],
    priceCents: 12000,
  },
  {
    id: 107,
    name: "Gourmet Coffee Beans",
    sku: "SKU-107",
    description:
      "A rich and aromatic blend of single-origin Arabica coffee beans. Ethically sourced and expertly roasted.",
    units: "bag",
    currency: "USD",
    imageUrls: [
      "https://picsum.photos/seed/product107/600/600",
      "https://picsum.photos/seed/product107-alt/600/600",
    ],
    categoryId: 3,
    tags: [tagBestseller, tagEcoFriendly],
    priceCents: 1899,
  },
  {
    id: 108,
    name: "Ergonomic Office Chair",
    sku: "SKU-108",
    description:
      "Improve your posture and comfort with this fully adjustable ergonomic office chair. A bestseller for a reason.",
    units: "pcs",
    currency: "USD",
    imageUrls: [
      "https://picsum.photos/seed/product108/600/600",
      "https://picsum.photos/seed/product108-alt/600/600",
    ],
    categoryId: 4,
    tags: [tagBestseller],
    priceCents: 35000,
  },
];

const MOCK_USERS: User[] = [
  { id: "user-1", phone: "5551112222", name: "Alice", priceLevel: "gold" },
  { id: "user-2", phone: "5553334444", name: "Bob", priceLevel: "silver" },
];

// --- MOCK API LOGIC ---

const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const BASE_API_URL = API_URL.replace(/\/$/, "");
const logMockRequest = (method: string, path: string, details?: unknown) => {
  const url = `${BASE_API_URL}/${HUB_ID}${path}`;
  if (details !== undefined) {
    console.log(`[mock:${method}] ${url}`, details);
  } else {
    console.log(`[mock:${method}] ${url}`);
  }
};

// --- EXPORTED API FUNCTIONS ---

export const fetchCategories = async (
  parentId?: number | null,
): Promise<Category[]> => {
  const url = new URL(`${BASE_API_URL}/${HUB_ID}/categories`);
  if (parentId !== undefined) {
    url.searchParams.set(
      "parentId",
      parentId === null ? "null" : String(parentId),
    );
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`,
      );
    }

    const categories = (await response.json()) as Category[];
    return categories;
  } catch (error) {
    console.error(
      "Failed to fetch categories from API, falling back to mock data.",
      error,
    );
    if (parentId === undefined) {
      return MOCK_CATEGORIES;
    }
    return MOCK_CATEGORIES.filter((category) => category.parentId === parentId);
  }
};

export const fetchTags = async (): Promise<Tag[]> => {
  const url = `${BASE_API_URL}/${HUB_ID}/tags`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch tags: ${response.status} ${response.statusText}`,
      );
    }
    return (await response.json()) as Tag[];
  } catch (error) {
    console.error(
      "Failed to fetch tags from API, falling back to mock data.",
      error,
    );
    return MOCK_TAGS;
  }
};

export const fetchProducts = async (
  user: User | null,
  filter: { categoryId?: number; tagId?: number } = {},
): Promise<Product[]> => {
  const url = new URL(`${BASE_API_URL}/${HUB_ID}/products`);
  if (filter.categoryId !== undefined) {
    url.searchParams.set("categoryId", String(filter.categoryId));
  }
  if (filter.tagId !== undefined) {
    url.searchParams.set("tagId", String(filter.tagId));
  }
  if (user?.id) {
    url.searchParams.set("userId", user.id);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Product[];
  } catch (error) {
    console.error(
      "Failed to fetch products from API, falling back to mock data.",
      error,
    );
    logMockRequest("GET", "/products", filter);
    await simulateDelay(500);
    let products = MOCK_PRODUCTS;
    const { categoryId, tagId } = filter;

    if (typeof categoryId === "number") {
      products = products.filter((p) => p.categoryId === categoryId);
    }
    if (typeof tagId === "number") {
      products = products.filter((p) => p.tags.some((tag) => tag.id === tagId));
    }

    return products;
  }
};

export const fetchProductById = async (
  user: User | null,
  productId: number,
): Promise<Product | undefined> => {
  const url = new URL(`${BASE_API_URL}/${HUB_ID}/products/${productId}`);
  if (user?.id) {
    url.searchParams.set("userId", user.id);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Product;
  } catch (error) {
    console.error(
      `Failed to fetch product ${productId} from API, falling back to mock data.`,
      error,
    );
    logMockRequest("GET", `/products/${productId}`);
    await simulateDelay(400);
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    return product;
  }
};

export const sendOtp = async (phone: string): Promise<{ success: boolean }> => {
  logMockRequest("POST", "/auth/otp", { phone });
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
  phone: string,
  otp: string,
): Promise<{ success: boolean; user?: User }> => {
  logMockRequest("POST", "/auth/otp/verify", { phone, otp });
  await simulateDelay(1000);
  if (otp === "123456") {
    const user = MOCK_USERS.find((u) => u.phone === phone);
    if (user) {
      return { success: true, user };
    }
  }
  return { success: false };
};
