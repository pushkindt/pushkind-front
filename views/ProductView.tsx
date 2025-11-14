/**
 * @file ProductView.tsx displays full product details and gallery controls.
 */
import React from "react";
import type { Category, Product } from "../types";
import {
  appendResizedSuffix,
  formatPrice,
  formatUnitPrice,
  PLACEHOLDER_IMAGE,
} from "../utils/formatPrice";

/**
 * Props accepted by the `ProductView` component.
 */
interface ProductViewProps {
  product: Product | null;
  categories: Category[];
  isAddFeedbackActive: boolean;
  activeImageIndex: number;
  onAddToCart: (product: Product) => void;
  onImageIndexChange: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Detail page layout that surfaces imagery, pricing, metadata, and add-to-cart
 * actions for a single product.
 */
const ProductView: React.FC<ProductViewProps> = ({
  product,
  categories,
  isAddFeedbackActive,
  activeImageIndex,
  onAddToCart,
  onImageIndexChange,
}) => {
  if (!product) {
    return <p className="text-center text-gray-500">Товар не найден.</p>;
  }

  const baseImageUrls =
    product.imageUrls.length > 0 ? product.imageUrls : [PLACEHOLDER_IMAGE];
  const imageUrls = baseImageUrls.map((url) =>
    url === PLACEHOLDER_IMAGE ? url : appendResizedSuffix(url),
  );
  const formattedPrice = formatPrice(product.priceCents, product.currency);
  const unitPriceLabel =
    product.priceCents !== null
      ? formatUnitPrice(product.amount, product.units)
      : null;

  const boundedImageIndex = Math.min(activeImageIndex, imageUrls.length - 1);
  const activeImage = imageUrls[boundedImageIndex];
  const hasMultipleImages = imageUrls.length > 1;
  const categoryName = categories.find(
    (c) => c.id === product.categoryId,
  )?.name;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto">
      <div className="md:flex gap-6">
        <div className="md:flex-shrink-0 md:w-1/2">
          <div className="relative">
            <img
              className="h-96 w-full object-cover rounded-lg shadow-sm"
              src={activeImage}
              alt={`${product.name} ${boundedImageIndex + 1}`}
            />
            {hasMultipleImages && (
              <div className="absolute inset-x-0 bottom-2 flex justify-between px-4">
                <button
                  type="button"
                  onClick={() =>
                    onImageIndexChange(
                      (prev) =>
                        (prev - 1 + imageUrls.length) % imageUrls.length,
                    )
                  }
                  className="bg-white bg-opacity-70 text-gray-700 rounded-full px-3 py-1 shadow"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onImageIndexChange((prev) => (prev + 1) % imageUrls.length)
                  }
                  className="bg-white bg-opacity-70 text-gray-700 rounded-full px-3 py-1 shadow"
                >
                  →
                </button>
              </div>
            )}
          </div>
          {hasMultipleImages && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {imageUrls.map((url, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  type="button"
                  onClick={() => onImageIndexChange(index)}
                  className={`border rounded-lg overflow-hidden transition-transform duration-200 ${
                    boundedImageIndex === index
                      ? "border-indigo-600 scale-105"
                      : "border-gray-200 hover:scale-105"
                  }`}
                >
                  <img
                    className="h-16 w-24 object-cover"
                    src={url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {categoryName}
            </div>
            <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black">
              {product.name}
            </h1>
            {product.sku && (
              <p className="mt-2 text-sm text-gray-500 uppercase tracking-wide">
                Артикул: {product.sku}
              </p>
            )}
            {product.units && (
              <p className="text-sm text-gray-500">Единицы: {product.units}</p>
            )}
            <p className="mt-4 text-gray-600">{product.description}</p>
          </div>
          <div className="mt-6">
            <div className="flex items-baseline mb-4 space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {formattedPrice}
              </span>
              {unitPriceLabel && (
                <span className="text-sm text-gray-600">{unitPriceLabel}</span>
              )}
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className={`w-full text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-300 ${
                isAddFeedbackActive
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
