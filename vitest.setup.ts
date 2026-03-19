import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

import.meta.env.VITE_HUB_ID = "test-hub";
import.meta.env.VITE_ORDERS_API_URL = "http://localhost:8000";
import.meta.env.VITE_CRM_API_URL = "http://localhost:8079/api/v1/store";

afterEach(() => {
  cleanup();
});
