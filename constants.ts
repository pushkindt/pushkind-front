/**
 * @file constants.ts validates and exports build-time environment constants.
 */
const hubId = import.meta.env.VITE_HUB_ID;
if (!hubId) {
  throw new Error("Отсутствует переменная окружения VITE_HUB_ID");
}

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
  throw new Error("Отсутствует переменная окружения VITE_API_URL");
}

export const HUB_ID = hubId;
export const API_URL = apiUrl;

export const USER_STORAGE_KEY = "pushkind-user";
/** Key for persisting the catalog layout preference. */
export const PRODUCT_LAYOUT_STORAGE_KEY = "pushkind-product-layout";
