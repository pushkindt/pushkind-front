/**
 * @file ProductCard.test.tsx validates the grid/list card behaviors.
 */
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import { CartProvider } from "../contexts/CartContext";

/** Wraps ProductCard with router + cart context for testing. */
const renderWithRouter = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>,
  );

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    categoryId: 1,
    name: "Test Product",
    sku: "SKU123",
    description: "Test description",
    units: "kg",
    currency: "RUB",
    priceCents: 10000,
    basePriceCents: null,
    tags: [],
    imageUrls: ["test.jpg"],
    amount: 1,
  };

  it("renders product name and price", () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeTruthy();
    expect(screen.getByText(/100/)).toBeTruthy();
  });

  it("shows placeholder when no image", () => {
    const noImageProduct = { ...mockProduct, imageUrls: [] };
    renderWithRouter(<ProductCard product={noImageProduct} />);
    const img = screen.getByAltText("Test Product") as HTMLImageElement;
    expect(img.src).toContain("placeholder.png");
  });

  it("renders list layout with metadata and description", () => {
    const listProduct = {
      ...mockProduct,
      description: "Detailed list description",
      imageUrls: [],
      vendorName: "Test Vendor",
    };

    const { container } = renderWithRouter(
      <ProductCard product={listProduct} layout="list" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("grid");

    const skuRow = screen.getByText(/Артикул:/i).parentElement;
    expect(skuRow).toBeTruthy();
    expect(skuRow?.textContent).toMatch(/Артикул:\s*SKU123/i);
    expect(screen.getByText(/Поставщик:/i).textContent).toMatch(
      /Поставщик:\s*Test Vendor/i,
    );
    expect(screen.getByText(/за 1 kg/i)).toBeTruthy();
    expect(screen.getByText(/Detailed list description/)).toBeTruthy();
    expect(screen.queryByAltText("Test Product")).toBeNull();
  });

  it("renders base price as striked when present", () => {
    renderWithRouter(
      <ProductCard product={{ ...mockProduct, basePriceCents: 15000 }} />,
    );

    const basePrice = screen.getByText(/150/);
    expect(basePrice.className).toContain("line-through");
  });
});
