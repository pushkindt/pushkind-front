import React from "react";
import type { Product, ProductLayout } from "../types";

interface ProductCardProps {
  product: Product;
  layout?: ProductLayout;
  onProductClick: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = "grid",
  onProductClick,
  onAddToCart,
}) => {
  const primaryImage =
    product.imageUrls.length > 0 ? product.imageUrls[0] : "placeholder.png";
  const formattedPrice =
    product.priceCents !== null
      ? new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: product.currency,
        }).format(product.priceCents / 100)
      : "Цена недоступна";
  const hasTag = (tagId: number) =>
    product.tags.some((tag) => tag.id === tagId);

  const isList = layout === "list";

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group ${isList ? "sm:flex" : ""}`}
    >
      <div className={`relative ${isList ? "sm:w-1/3" : ""}`}>
        <div
          onClick={() => onProductClick(product.id)}
          className="cursor-pointer h-full"
        >
          <img
            className={`w-full object-cover ${isList ? "h-48 sm:h-full" : "h-48"}`}
            src={primaryImage}
            alt={product.name}
          />
        </div>
        <div className="absolute top-2 right-2 flex space-x-1">
          {hasTag(2) && (
            <span className="text-xs bg-red-500 text-white font-semibold px-2 py-1 rounded-full">
              Скидка
            </span>
          )}
          {hasTag(1) && (
            <span className="text-xs bg-blue-500 text-white font-semibold px-2 py-1 rounded-full">
              Новинка
            </span>
          )}
        </div>
      </div>
      <div
        className={`p-4 flex flex-col flex-grow ${isList ? "sm:w-2/3" : ""}`}
      >
        <h3
          onClick={() => onProductClick(product.id)}
          className="text-lg font-semibold text-gray-800 truncate cursor-pointer hover:text-indigo-600"
        >
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
            Артикул: {product.sku}
          </p>
        )}
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 flex-grow">
            {product.description.substring(0, 50)}...
          </p>
        )}
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formattedPrice}
              {product.priceCents !== null &&
              product.units &&
              product.amount !== null
                ? ` / ${product.amount} ${product.units}`
                : ""}
            </span>
          </div>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
