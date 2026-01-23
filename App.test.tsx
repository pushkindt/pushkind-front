/**
 * @file App.test.tsx covers high-level storefront behaviors via routing.
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./routes";
import * as api from "./services/api";
import { CartProvider } from "./contexts/CartContext";

vi.mock("./services/api", () => ({
  fetchCategories: vi.fn(),
  fetchTags: vi.fn(),
  fetchVendors: vi.fn(),
  fetchProducts: vi.fn(),
  fetchProductById: vi.fn(),
  fetchCurrentUser: vi.fn(),
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

describe("App", () => {
  beforeEach(() => {
    vi.mocked(api.fetchCategories).mockResolvedValue([mockCategory]);
    vi.mocked(api.fetchTags).mockResolvedValue([mockTag]);
    vi.mocked(api.fetchVendors).mockResolvedValue([]);
    vi.mocked(api.fetchProducts).mockResolvedValue([mockProduct]);
    vi.mocked(api.fetchProductById).mockResolvedValue(mockProduct);
    vi.mocked(api.fetchCurrentUser).mockResolvedValue(null);
  });

  it("switches from grid to list layout when the selector is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </MemoryRouter>,
    );

    await screen.findByText("Sample Product");

    const layoutContainer = screen.getByTestId("product-layout");
    expect(layoutContainer.className).toContain("grid grid-cols-1");

    await user.click(screen.getByRole("button", { name: "Список" }));

    await waitFor(() => {
      expect(layoutContainer.className).toContain("flex flex-col");
    });
  });

  it("uses the search bar to request filtered products", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </MemoryRouter>,
    );

    const searchInput = await screen.findByLabelText("Поиск товаров");

    await user.type(searchInput, "tea");

    await waitFor(() => {
      expect(api.fetchProducts).toHaveBeenCalledWith({ search: "tea" });
    });
  });

  it("reads the search query from the URL and fetches filtered products", async () => {
    render(
      <MemoryRouter initialEntries={["/?search=карамель"]}>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </MemoryRouter>,
    );

    const searchInput = (await screen.findByLabelText(
      "Поиск товаров",
    )) as HTMLInputElement;
    expect(searchInput.value).toBe("карамель");

    await waitFor(() => {
      expect(api.fetchProducts).toHaveBeenCalledWith({ search: "карамель" });
    });
  });
});
