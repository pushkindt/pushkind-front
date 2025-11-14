import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

import.meta.env.VITE_HUB_ID = "test-hub";
import.meta.env.VITE_API_URL = "http://localhost:8000";

afterEach(() => {
  cleanup();
});
