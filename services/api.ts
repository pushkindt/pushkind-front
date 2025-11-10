import { API_URL, HUB_ID } from "../constants";
import { showToast } from "./toast";
import type { Category, Product, Tag, User } from "../types";

const BASE_API_URL = API_URL.replace(/\/$/, "");

const handleApiError = (message: string, error: unknown) => {
  console.error(message, error);
  showToast(message, "error");
};

const buildUrl = (path: string) => `${BASE_API_URL}/${HUB_ID}${path}`;

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

export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const response = await fetch(buildUrl("/tags"), {
      headers: { Accept: "application/json" },
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

export const fetchProducts = async (
  user: User | null,
  filter: { categoryId?: number; tagId?: number } = {},
): Promise<Product[]> => {
  const url = new URL(buildUrl("/products"));
  if (filter.categoryId !== undefined) {
    url.searchParams.set("categoryId", String(filter.categoryId));
  }
  if (filter.tagId !== undefined) {
    url.searchParams.set("tagId", String(filter.tagId));
  }
  if (user?.id) {
    url.searchParams.set("userId", String(user.id));
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
    handleApiError("Не удалось загрузить товары.", error);
    return [];
  }
};

export const fetchProductById = async (
  user: User | null,
  productId: number,
): Promise<Product | undefined> => {
  const url = new URL(buildUrl(`/products/${productId}`));
  if (user?.id) {
    url.searchParams.set("userId", String(user.id));
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
    handleApiError(`Не удалось загрузить товар ${productId}.`, error);
    return undefined;
  }
};

const normalizePhone = (phone: string) =>
  phone.startsWith("+") ? phone : `+${phone}`;

export const sendOtp = async (phone: string): Promise<{ success: boolean }> => {
  const payloadPhone = normalizePhone(phone);
  try {
    const response = await fetch(buildUrl("/auth/otp"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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
