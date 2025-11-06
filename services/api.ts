import { API_URL, HUB_ID } from "../constants";
import type { Category, Product, Tag, User } from "../types";

// --- MOCK DATABASE ---

const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    parentId: null,
    name: "Электроника",
    description: "Новейшие гаджеты, устройства и аксессуары.",
    imageUrl: "https://picsum.photos/seed/electronics/600/400",
  },
  {
    id: 5,
    parentId: 1,
    name: "Смартфоны",
    description: "Флагманские и доступные модели ведущих брендов.",
    imageUrl: "https://picsum.photos/seed/smartphones/600/400",
  },
  {
    id: 6,
    parentId: 1,
    name: "Аудио и наушники",
    description: "Наушники, гарнитуры и портативные колонки.",
    imageUrl: "https://picsum.photos/seed/audio/600/400",
  },
  {
    id: 2,
    parentId: null,
    name: "Одежда",
    description: "Стильная одежда и аксессуары.",
    imageUrl: "https://picsum.photos/seed/apparel/600/400",
  },
  {
    id: 7,
    parentId: 2,
    name: "Мужская одежда",
    description: "Повседневные базовые вещи и сезонные новинки.",
    imageUrl: "https://picsum.photos/seed/mens-clothing/600/400",
  },
  {
    id: 8,
    parentId: 2,
    name: "Женская одежда",
    description: "От базовых повседневных вещей до ярких образов.",
    imageUrl: "https://picsum.photos/seed/womens-clothing/600/400",
  },
  {
    id: 3,
    parentId: null,
    name: "Продукты питания",
    description: "Свежие продукты, товары для кухни и многое другое.",
    imageUrl: "https://picsum.photos/seed/groceries/600/400",
  },
  {
    id: 9,
    parentId: 3,
    name: "Свежие овощи и фрукты",
    description: "Фрукты и овощи прямо с фермы.",
    imageUrl: "https://picsum.photos/seed/produce/600/400",
  },
  {
    id: 10,
    parentId: 3,
    name: "Базовые продукты",
    description: "Бакалея, специи и необходимые ингредиенты для готовки.",
    imageUrl: "https://picsum.photos/seed/pantry/600/400",
  },
  {
    id: 4,
    parentId: null,
    name: "Товары для дома",
    description: "Мебель, декор и незаменимые вещи для дома.",
    imageUrl: "https://picsum.photos/seed/homegoods/600/400",
  },
  {
    id: 11,
    parentId: 4,
    name: "Кухня и сервировка",
    description: "Посуда, текстиль и все для приема гостей.",
    imageUrl: "https://picsum.photos/seed/kitchen-dining/600/400",
  },
  {
    id: 12,
    parentId: 4,
    name: "Домашний офис",
    description: "Мебель, свет и органайзеры для рабочего места.",
    imageUrl: "https://picsum.photos/seed/home-office/600/400",
  },
];

const MOCK_TAGS: Tag[] = [
  { id: 1, name: "Новинка" },
  { id: 2, name: "Скидка" },
  { id: 3, name: "Бестселлер" },
  { id: 4, name: "Экологично" },
];

const [tagNewArrival, tagOnSale, tagBestseller, tagEcoFriendly] = MOCK_TAGS;

const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "Умные наушники с шумоподавлением",
    sku: "SKU-101",
    description:
      "Погрузитесь в мир чистого звука с этими стильными беспроводными наушниками. Долгое время работы и удобная посадка.",
    units: "шт.",
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
    name: "Футболка из органического хлопка",
    sku: "SKU-102",
    description:
      "Классическая и удобная футболка из 100% органического хлопка. Идеальна для повседневной носки.",
    units: "шт.",
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
    name: "Ремесленный хлеб на закваске",
    sku: "SKU-103",
    description:
      "Свежевыпеченный хлеб на закваске с хрустящей коркой и мягким мякишем. Изготовлен из локальных ингредиентов.",
    units: "буханка",
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
    name: "Современная минималистичная настольная лампа",
    sku: "SKU-104",
    description:
      "Осветите рабочее место стильной и функциональной светодиодной лампой. Регулировка яркости обеспечивает комфорт.",
    units: "шт.",
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
    name: "Портативный пауэрбанк 20000 мА·ч",
    sku: "SKU-105",
    description:
      "Больше никакой разряженной техники — емкий пауэрбанк заряжает сразу несколько устройств.",
    units: "шт.",
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
    name: "Функциональная куртка для любой погоды",
    sku: "SKU-106",
    description:
      "Оставайтесь сухими и в комфорте в любую погоду – водонепроницаемая и дышащая куртка сейчас со скидкой!",
    units: "шт.",
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
    name: "Премиальные кофейные зерна",
    sku: "SKU-107",
    description:
      "Насыщенная ароматная арабика одного происхождения. Этично выращена и профессионально обжарена.",
    units: "пакет",
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
    name: "Эргономичное офисное кресло",
    sku: "SKU-108",
    description:
      "Улучшите осанку и комфорт благодаря полностью регулируемому эргономичному креслу. Бестселлер не случайно.",
    units: "шт.",
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
  { id: "user-1", phone: "5551112222", name: "Алиса", priceLevel: "gold" },
  { id: "user-2", phone: "5553334444", name: "Борис", priceLevel: "silver" },
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
        `Не удалось загрузить категории: ${response.status} ${response.statusText}`,
      );
    }

    const categories = (await response.json()) as Category[];
    return categories;
  } catch (error) {
    console.error(
      "Не удалось получить категории из API, используем тестовые данные.",
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
        `Не удалось загрузить теги: ${response.status} ${response.statusText}`,
      );
    }
    return (await response.json()) as Tag[];
  } catch (error) {
    console.error(
      "Не удалось получить теги из API, используем тестовые данные.",
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
        `Не удалось загрузить товары: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Product[];
  } catch (error) {
    console.error(
      "Не удалось получить товары из API, используем тестовые данные.",
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
        `Не удалось загрузить товар: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Product;
  } catch (error) {
    console.error(
      `Не удалось получить товар ${productId} из API, используем тестовые данные.`,
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
    console.log(`Демо-код для ${phone}: 123456`);
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
