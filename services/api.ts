/**
 * @file api.ts wraps Pushkind backend endpoints with typed helper functions.
 */
import { API_URL, HUB_ID } from "../constants";
import { showToast } from "./toast";
import type { Category, Order, Product, Tag, User } from "../types";

const BASE_API_URL = API_URL.replace(/\/$/, "");

/** Shows a toast and logs an error for failed API interactions. */
const handleApiError = (message: string, error: unknown) => {
  console.error(message, error);
  showToast(message, "error");
};

/** Builds an absolute API URL for the current hub. */
const buildUrl = (path: string) => `${BASE_API_URL}/${HUB_ID}${path}`;

/** Payload item used when creating an order. */
export type OrderItemPayload = { productId: number; quantity: number };

/** Fetches categories optionally filtered by a parent id. */
export const fetchCategories = async (
  parentId?: number | null,
): Promise<Category[]> => {
  const url = new URL(buildUrl("/categories"));
  if (typeof parentId === "number" && Number.isFinite(parentId)) {
    url.searchParams.set("parentId", String(parentId));
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Не удалось загрузить категории: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Category[];
  } catch (error) {
    handleApiError("Не удалось загрузить категории.", error);
    return [];
  }
};

/** Fetches all available tags for the storefront. */
export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const response = await fetch(buildUrl("/tags"), {
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Не удалось загрузить теги: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Tag[];
  } catch (error) {
    handleApiError("Не удалось загрузить теги.", error);
    return [];
  }
};

/**
 * Fetches a list of products optionally filtered by category, tag, or search.
 * User context is inferred from the session cookie, so no userId query is sent.
 */
export const fetchProducts = async (
  filter: { categoryId?: number; tagId?: number; search?: string } = {},
): Promise<Product[]> => {
  const url = new URL(buildUrl("/products"));
  if (filter.categoryId !== undefined) {
    url.searchParams.set("categoryId", String(filter.categoryId));
  }
  if (filter.tagId !== undefined) {
    url.searchParams.set("tagId", String(filter.tagId));
  }
  const searchQuery =
    typeof filter.search === "string" ? filter.search.trim() : "";
  if (searchQuery) {
    url.searchParams.set("search", searchQuery);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Не удалось загрузить товары: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Product[];
  } catch (error) {
    handleApiError("Не удалось загрузить товары.", error);
    return [];
  }
};

/**
 * Fetches a single product by id, returning undefined when not found.
 * User identity is derived from the session cookie.
 */
export const fetchProductById = async (
  productId: number,
): Promise<Product | undefined> => {
  const url = new URL(buildUrl(`/products/${productId}`));

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      credentials: "include",
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
    handleApiError(`Не удалось загрузить товар ${productId}.`, error);
    return undefined;
  }
};

/** Loads the authenticated customer when the session cookie is present. */
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(buildUrl("/auth/session"), {
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Не удалось загрузить сессию: ${response.status} ${response.statusText}`,
      );
    }

    const payload = await response.json();
    const candidate = extractCustomerFromPayload(payload);
    return candidate;
  } catch (error) {
    handleApiError("Не удалось загрузить сессию.", error);
    return null;
  }
};

const extractCustomerFromPayload = (payload: unknown): User | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const nestedCustomer = record.customer;
  const customerRecord =
    nestedCustomer && typeof nestedCustomer === "object"
      ? (nestedCustomer as Record<string, unknown>)
      : record;

  return mapRecordToUser(customerRecord);
};

const mapRecordToUser = (record: Record<string, unknown>): User | null => {
  if (
    typeof record.id !== "number" ||
    typeof record.hub_id !== "number" ||
    typeof record.name !== "string" ||
    typeof record.phone !== "string"
  ) {
    return null;
  }

  const emailValue = record.email;
  const email =
    emailValue === null || typeof emailValue === "string"
      ? (emailValue as string | null)
      : null;

  return {
    id: record.id,
    hub_id: record.hub_id,
    name: record.name,
    email,
    phone: record.phone,
  };
};

/** Prefixes a phone number with `+` if it is missing. */
const normalizePhone = (phone: string) =>
  phone.startsWith("+") ? phone : `+${phone}`;

/** Sends an OTP challenge to the provided phone number. */
export const sendOtp = async (phone: string): Promise<{ success: boolean }> => {
  const payloadPhone = normalizePhone(phone);
  try {
    const response = await fetch(buildUrl("/auth/otp"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ phone: payloadPhone }),
    });

    if (!response.ok) {
      throw new Error(
        `Не удалось отправить код: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as { success: boolean };
  } catch (error) {
    handleApiError("Не удалось отправить код подтверждения.", error);
    return { success: false };
  }
};

/** Verifies a previously requested OTP code. */
export const verifyOtp = async (
  phone: string,
  otp: string,
): Promise<{ success: boolean; user?: User }> => {
  const payloadPhone = normalizePhone(phone);
  try {
    const response = await fetch(buildUrl("/auth/otp/verify"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ phone: payloadPhone, otp }),
    });

    if (!response.ok) {
      throw new Error(
        `Не удалось подтвердить код: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      success: boolean;
      customer?: {
        id: number;
        hub_id: number;
        name: string;
        email: string | null;
        phone: string;
      };
    };

    if (data.customer) {
      const user: User = {
        id: data.customer.id,
        hub_id: data.customer.hub_id,
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
      };
      return { success: data.success, user };
    }

    return { success: data.success };
  } catch (error) {
    handleApiError("Не удалось подтвердить код.", error);
    return { success: false };
  }
};

/** Fetches orders belonging to the authenticated customer. */
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(buildUrl("/orders"), {
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Не удалось загрузить заказы: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Order[];
  } catch (error) {
    handleApiError("Не удалось загрузить заказы.", error);
    return [];
  }
};

/** Creates a new order for the authenticated customer. */
export const createOrder = async (
  items: OrderItemPayload[],
): Promise<boolean> => {
  try {
    const response = await fetch(buildUrl("/orders"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(items),
    });

    if (!response.ok) {
      throw new Error(
        `Не удалось оформить заказ: ${response.status} ${response.statusText}`,
      );
    }

    return true;
  } catch (error) {
    console.error("Не удалось оформить заказ.", error);
    return false;
  }
};
