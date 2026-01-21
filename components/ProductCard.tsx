/**
 * @file ProductCard.tsx renders the reusable grid/list card for a product.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import type { Product, ProductLayout } from "../types";
import {
  formatPrice,
  formatUnitPrice,
  getPrimaryImage,
} from "../utils/formatPrice";
import { sanitizeHtml } from "../utils/sanitizeHtml";
import { useCart } from "../contexts/CartContext";
import useTransientFlag from "../hooks/useTransientFlag";

/**
 * Props accepted by the `ProductCard` component.
 */
interface ProductCardProps {
  product: Product;
  layout?: ProductLayout;
}

/**
 * Responsive product tile that adapts to grid/list layouts and exposes add to
 * cart actions.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = "grid",
}) => {
  const navigate = useNavigate();
  const primaryImage = getPrimaryImage(product.imageUrls);
  const formattedPrice = formatPrice(product.priceCents, product.currency);
  const formattedBasePrice =
    typeof product.basePriceCents === "number" &&
      Number.isFinite(product.basePriceCents)
      ? formatPrice(product.basePriceCents, product.currency)
      : null;
  const unitPriceLabel =
    product.priceCents !== null
      ? formatUnitPrice(product.amount, product.units)
      : null;
  const hasTag = (tagId: number) =>
    product.tags.some((tag) => tag.id === tagId);
  const { addItem } = useCart();
  const { isActive: isButtonFeedbackActive, activate: triggerButtonFeedback } =
    useTransientFlag();
  const previewDescription = React.useMemo(() => {
    const sanitized = sanitizeHtml(product.description);
    if (!sanitized) {
      return "";
    }

    const textOnly = sanitized.replace(/<[^>]*>/g, "");
    const clipped = textOnly.substring(0, 150);
    return `${clipped}${textOnly.length > 150 ? "..." : ""}`;
  }, [product.description]);

  /**
   * Adds the product to the cart while triggering transient button feedback.
   */
  const handleAddClick = () => {
    addItem(product);
    triggerButtonFeedback();
  };

  const isList = layout === "list";
  const descriptionVisible = Boolean(product.description);

  if (isList) {
    return (
      <article
        className="bg-white rounded-lg shadow-md px-5 py-4 grid gap-6 items-center sm:grid-cols-[280px_minmax(0,1fr)] md:grid-cols-[350px_minmax(0,1fr)] lg:grid-cols-[350px_minmax(0,1fr)_auto]"
        aria-label={product.name}
      >
        <div className="min-w-0">
          <h3
            onClick={() => navigate(`/products/${product.id}`)}
            className="text-lg font-semibold text-gray-800 truncate cursor-pointer hover:text-indigo-600"
          >
            {product.name}
          </h3>
          {product.sku && (
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
              <span className="mr-1">Артикул:</span>
              <span>{product.sku}</span>
            </p>
          )}
        </div>
        <div className="min-w-0 text-sm text-gray-500">
          {descriptionVisible ? previewDescription : ""}
        </div>
        <div className="flex flex-wrap items-center gap-4 justify-between sm:col-span-2 sm:justify-end lg:col-span-1">
          <div className="flex items-baseline gap-3 whitespace-nowrap">
            {formattedBasePrice && (
              <span className="text-sm text-gray-400 line-through">
                {formattedBasePrice}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              {formattedPrice}
            </span>
            {unitPriceLabel && (
              <span className="text-sm text-gray-600">{unitPriceLabel}</span>
            )}
          </div>
          <button
            onClick={handleAddClick}
            className={`min-w-[190px] text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ${isButtonFeedbackActive
              ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
              : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              } py-2 text-sm`}
          >
            Добавить в корзину
          </button>
        </div>
      </article>
    );
  }

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
            {previewDescription}
          </p>
        )}
        <div
          className={`flex items-center justify-between space-x-2 ${isList ? "mt-2" : "mt-4"}`}
        >
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            {formattedBasePrice && (
              <span className="text-sm text-gray-400 line-through">
                {formattedBasePrice}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              {formattedPrice}
            </span>
          </div>
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
