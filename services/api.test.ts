/**
 * @file api.test.ts verifies API helper URL building behavior.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { showToast } = vi.hoisted(() => ({
  showToast: vi.fn(),
}));

vi.mock("../constants", () => ({
  ORDERS_API_URL: "https://example.com/",
  CRM_API_URL: "https://crm.example.com/",
  HUB_ID: "hub",
}));

vi.mock("./toast", () => ({
  showToast,
}));

import {
  createOrder,
  fetchCategories,
  logoutUser,
  sendOtp,
  verifyOtp,
} from "./api";

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

describe("otp helpers", () => {
  beforeEach(() => {
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
    showToast.mockReset();
  });

  it("surfaces the sendOtp validation error from a 422 response body", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ error: "phone is invalid" }), {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: { "Content-Type": "application/json" },
      }) as ReturnType<typeof fetch>,
    );

    const result = await sendOtp("79990001122");

    expect(result).toEqual({ success: false });
    expect(showToast).toHaveBeenCalledWith("phone is invalid", "error");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://crm.example.com/hub/auth/otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ phone: "+79990001122" }),
      },
    );
  });

  it("surfaces the verifyOtp validation error from a 422 response body", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ error: "otp is expired" }), {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: { "Content-Type": "application/json" },
      }) as ReturnType<typeof fetch>,
    );

    const result = await verifyOtp("79990001122", "123456");

    expect(result).toEqual({ success: false });
    expect(showToast).toHaveBeenCalledWith("otp is expired", "error");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://crm.example.com/hub/auth/otp/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ phone: "+79990001122", otp: "123456" }),
      },
    );
  });

  it("posts logout to the CRM auth base URL", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }) as ReturnType<typeof fetch>,
    );

    const result = await logoutUser();

    expect(result).toEqual({ success: true });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://crm.example.com/hub/auth/logout",
      {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "include",
      },
    );
  });
});
