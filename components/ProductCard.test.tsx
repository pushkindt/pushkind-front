import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";

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
        render(
            <ProductCard
                product={mockProduct}
                onProductClick={vi.fn()}
                onAddToCart={vi.fn()}
            />,
        );
        expect(screen.getByText("Test Product")).toBeTruthy();
        expect(screen.getByText(/100/)).toBeTruthy();
    });

    it("shows placeholder when no image", () => {
        const noImageProduct = { ...mockProduct, imageUrls: [] };
        render(
            <ProductCard
                product={noImageProduct}
                onProductClick={vi.fn()}
                onAddToCart={vi.fn()}
            />,
        );
        const img = screen.getByAltText("Test Product") as HTMLImageElement;
        expect(img.src).toContain("placeholder.png");
    });
});
