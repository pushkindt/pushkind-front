const hubId = import.meta.env.VITE_HUB_ID;
if (!hubId) {
  throw new Error("Missing VITE_HUB_ID environment variable");
}

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
  throw new Error("Missing VITE_API_URL environment variable");
}

export const HUB_ID = hubId;
export const API_URL = apiUrl;
