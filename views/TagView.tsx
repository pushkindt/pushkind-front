import React from "react";
import ProductCard from "../components/ProductCard";
import type { Product, ProductLayout } from "../types";

interface TagViewProps {
  products: Product[];
  productLayout: ProductLayout;
}

const TagView: React.FC<TagViewProps> = ({ products, productLayout }) => {
  return (
    <div
      data-testid="product-layout"
      className={
        productLayout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "flex flex-col gap-6"
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout={productLayout}
        />
      ))}
    </div>
  );
};

export default TagView;
