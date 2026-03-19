/**
 * @file constants.ts validates and exports build-time environment constants.
 */
const hubId = import.meta.env.VITE_HUB_ID;
if (!hubId) {
  throw new Error("Отсутствует переменная окружения VITE_HUB_ID");
}

const ordersApiUrl = import.meta.env.VITE_ORDERS_API_URL;
if (!ordersApiUrl) {
  throw new Error("Отсутствует переменная окружения VITE_ORDERS_API_URL");
}

const crmApiUrl = import.meta.env.VITE_CRM_API_URL;
if (!crmApiUrl) {
  throw new Error("Отсутствует переменная окружения VITE_CRM_API_URL");
}

export const HUB_ID = hubId;
export const ORDERS_API_URL = ordersApiUrl;
export const CRM_API_URL = crmApiUrl;

export const USER_STORAGE_KEY = "pushkind-user";
/** Key for persisting the catalog layout preference. */
export const PRODUCT_LAYOUT_STORAGE_KEY = "pushkind-product-layout";
/** Key for persisting the catalog amount filter preference. */
export const PRODUCT_AMOUNT_FILTER_STORAGE_KEY =
  "pushkind-product-amount-filter";
