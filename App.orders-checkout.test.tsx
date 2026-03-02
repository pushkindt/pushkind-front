/**
 * @file App.orders-checkout.test.tsx verifies order-history refresh behavior
 * after a successful checkout.
 */
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { CartProvider } from "./contexts/CartContext";
import * as api from "./services/api";

vi.mock("./services/api", () => ({
  fetchCategories: vi.fn(),
  fetchTags: vi.fn(),
  fetchVendors: vi.fn(),
  fetchProducts: vi.fn(),
  fetchProductById: vi.fn(),
  fetchCurrentUser: vi.fn(),
}));

vi.mock("./components/Cart", () => ({
  default: ({ onCheckoutSuccess }: { onCheckoutSuccess?: () => void }) => (
    <button onClick={() => onCheckoutSuccess?.()} type="button">
      Complete checkout
    </button>
  ),
}));

vi.mock("./views/OrdersView", () => ({
  default: ({ refreshToken = 0 }: { refreshToken?: number }) => (
    <div>Orders view refresh token: {refreshToken}</div>
  ),
}));

const mockCategory = {
  id: 1,
  parentId: null,
  name: "Категория",
  description: null,
  imageUrl: null,
};

const mockTag = {
  id: 1,
  name: "Tag",
};

const mockProduct = {
  id: 10,
  categoryId: 1,
  name: "Sample Product",
  sku: "SP-10",
  description: "Sample description",
  units: "шт",
  currency: "RUB",
  priceCents: 2500,
  basePriceCents: null,
  tags: [mockTag],
  imageUrls: ["/sample.jpg"],
  amount: 1,
};

const mockUser = {
  id: 1,
  hub_id: 1,
  name: "Тестовый пользователь",
  email: null,
  phone: "+79990000000",
};

describe("App order checkout navigation", () => {
  beforeEach(() => {
    vi.mocked(api.fetchCategories).mockResolvedValue([mockCategory]);
    vi.mocked(api.fetchTags).mockResolvedValue([mockTag]);
    vi.mocked(api.fetchVendors).mockResolvedValue([]);
    vi.mocked(api.fetchProducts).mockResolvedValue([mockProduct]);
    vi.mocked(api.fetchProductById).mockResolvedValue(mockProduct);
    vi.mocked(api.fetchCurrentUser).mockResolvedValue(mockUser);
  });

  it("reloads the orders view when checkout succeeds from the orders route", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("Orders view refresh token: 0"),
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Complete checkout" }));

    expect(
      await screen.findByText("Orders view refresh token: 1"),
    ).toBeTruthy();
  });

  it("keeps redirecting to the orders view when checkout succeeds from another route", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </MemoryRouter>,
    );

    await screen.findByText("Sample Product");

    await user.click(screen.getByRole("button", { name: "Complete checkout" }));

    expect(
      await screen.findByText("Orders view refresh token: 0"),
    ).toBeTruthy();
  });
});
