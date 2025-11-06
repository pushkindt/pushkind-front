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
