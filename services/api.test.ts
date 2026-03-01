/**
 * @file api.test.ts verifies API helper URL building behavior.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { showToast } = vi.hoisted(() => ({
  showToast: vi.fn(),
}));

vi.mock("../constants", () => ({
  API_URL: "https://example.com/",
  HUB_ID: "hub",
}));

vi.mock("./toast", () => ({
  showToast,
}));

import { createOrder, fetchCategories } from "./api";

const mockFetch = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();

const jsonResponse = () =>
  new Response(JSON.stringify([]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

describe("fetchCategories", () => {
  const baseUrl = "https://example.com/hub/categories";

  beforeEach(() => {
    mockFetch.mockResolvedValue(jsonResponse() as ReturnType<typeof fetch>);
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
    showToast.mockReset();
  });

  it("omits the parentId query when no argument is provided", async () => {
    await fetchCategories();

    expect(mockFetch).toHaveBeenCalledWith(baseUrl, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  });

  it("keeps the URL clean when parentId is null", async () => {
    await fetchCategories(null);

    expect(mockFetch).toHaveBeenCalledWith(baseUrl, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  });

  it("adds the parentId query parameter when a finite number is provided", async () => {
    await fetchCategories(42);

    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}?parentId=42`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  });
});

describe("createOrder", () => {
  beforeEach(() => {
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
    showToast.mockReset();
  });

  it("shows the API validation error from a 422 response body", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ error: "mixed vendors are not allowed" }), {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: { "Content-Type": "application/json" },
      }) as ReturnType<typeof fetch>,
    );

    const result = await createOrder([{ productId: 10, quantity: 2 }]);

    expect(result).toEqual({ success: false });
    expect(showToast).toHaveBeenCalledWith(
      "mixed vendors are not allowed",
      "error",
    );
  });
});
