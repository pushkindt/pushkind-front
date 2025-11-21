/**
 * @file CategoryView.tsx renders nested categories and associated products.
 */
import React from "react";
import ProductCard from "../components/ProductCard";
import type { Category, Product, ProductLayout } from "../types";

/**
 * Props consumed by `CategoryView`.
 */
interface CategoryViewProps {
  categories: Category[];
  products: Product[];
  productLayout: ProductLayout;
  showCategories: boolean;
  onCategorySelect: (categoryId: number, categoryName?: string) => void;
}

/**
 * Category-focused view that shows sibling categories (for drill-down) and the
 * filtered product list.
 */
const CategoryView: React.FC<CategoryViewProps> = ({
  categories,
  products,
  productLayout,
  showCategories,
  onCategorySelect,
}) => {
  return (
    <>
      {showCategories && categories.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => onCategorySelect(category.id, category.name)}
                className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={category.imageUrl ?? "/placeholder.png"}
                  alt={category.name}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </>
  );
};

export default CategoryView;
