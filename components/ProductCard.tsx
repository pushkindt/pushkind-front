import React from "react";
import { useNavigate } from "react-router-dom";
import type { Product, ProductLayout } from "../types";
import {
  formatPrice,
  formatUnitPrice,
  getPrimaryImage,
} from "../utils/formatPrice";
import { useCart } from "../contexts/CartContext";
import useTransientFlag from "../hooks/useTransientFlag";

interface ProductCardProps {
  product: Product;
  layout?: ProductLayout;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = "grid",
}) => {
  const navigate = useNavigate();
  const primaryImage = getPrimaryImage(product.imageUrls);
  const formattedPrice = formatPrice(product.priceCents, product.currency);
  const unitPriceLabel =
    product.priceCents !== null
      ? formatUnitPrice(product.amount, product.units)
      : null;
  const hasTag = (tagId: number) =>
    product.tags.some((tag) => tag.id === tagId);
  const { addItem } = useCart();
  const { isActive: isButtonFeedbackActive, activate: triggerButtonFeedback } =
    useTransientFlag();

  const handleAddClick = () => {
    addItem(product);
    triggerButtonFeedback();
  };

  const isList = layout === "list";
  const descriptionVisible = !isList && Boolean(product.description);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group ${isList ? "sm:flex sm:items-center" : ""}`}
    >
      <div className={`relative ${isList ? "sm:w-1/3" : ""}`}>
        <div
          onClick={() => navigate(`/products/${product.id}`)}
          className="cursor-pointer h-full"
        >
          <img
            className={`w-full object-cover ${isList ? "h-32 sm:h-32 md:h-40" : "h-48"}`}
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
        className={`flex flex-col flex-grow ${isList ? "sm:w-2/3 p-3 gap-1" : "p-4"}`}
      >
        <h3
          onClick={() => navigate(`/products/${product.id}`)}
          className="text-lg font-semibold text-gray-800 truncate cursor-pointer hover:text-indigo-600"
        >
          {product.name}
        </h3>
        {product.sku && (
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
            Артикул: {product.sku}
          </p>
        )}
        {descriptionVisible && (
          <p className="text-sm text-gray-500 mt-1 flex-grow">
            {product.description.substring(0, 50)}...
          </p>
        )}
        <div
          className={`flex items-center justify-between space-x-2 ${isList ? "mt-2" : "mt-4"}`}
        >
          <span className="text-xl font-bold text-gray-900">{formattedPrice}</span>
          {unitPriceLabel && (
            <span className="text-sm text-gray-600">{unitPriceLabel}</span>
          )}
        </div>
        <button
          onClick={handleAddClick}
          className={`w-full text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ${isButtonFeedbackActive
            ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            } ${isList ? "py-2 text-sm" : "py-2 px-4"}`}
        >
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
