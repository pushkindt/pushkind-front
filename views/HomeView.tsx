import React from "react";
import ProductCard from "../components/ProductCard";
import type {
  Category,
  Product,
  ProductLayout,
  Tag,
} from "../types";

interface HomeViewProps {
  categories: Category[];
  tags: Tag[];
  products: Product[];
  productLayout: ProductLayout;
  onCategorySelect: (categoryId: number, categoryName?: string) => void;
  onTagSelect: (tagId: number, tagName?: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  categories,
  tags,
  products,
  productLayout,
  onCategorySelect,
  onTagSelect,
}) => {
  return (
    <>
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Категории</h2>
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
                <h3 className="text-white text-2xl font-bold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Фильтр по тегам</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagSelect(tag.id, tag.name)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-colors duration-200"
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

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

export default HomeView;
