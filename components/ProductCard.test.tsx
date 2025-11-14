import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import { CartProvider } from "../contexts/CartContext";

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

    it("renders list layout with metadata and placeholder image", () => {
        const listProduct = {
            ...mockProduct,
            description: "Detailed list description",
            imageUrls: [],
        };

        const { container } = renderWithRouter(
            <ProductCard product={listProduct} layout="list" />,
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain("sm:flex");

        expect(screen.getByText(/Артикул: SKU123/i)).toBeTruthy();
        expect(screen.getByText(/за 1 kg/i)).toBeTruthy();

        const img = screen.getByAltText("Test Product") as HTMLImageElement;
        expect(img.src).toContain("placeholder.png");

        expect(
            screen.queryByText(/Detailed list description/),
        ).toBeNull();
    });
});
