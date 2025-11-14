import React from "react";
import type { CartItem, User } from "../types";
import { formatPrice, getPrimaryImage } from "../utils/formatPrice";
import { PlusIcon, MinusIcon, TrashIcon, XIcon } from "./Icons";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  user: User | null;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onLoginClick: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cartItems,
  user,
  onUpdateQuantity,
  onRemoveItem,
  onLoginClick,
}) => {
  const subtotalCents = cartItems.reduce((acc, item) => {
    if (item.priceCents === null) return acc;
    return acc + item.priceCents * item.quantity;
  }, 0);
  const subtotalCurrency = cartItems[0]?.currency ?? "USD";
  const hasPricedItems = cartItems.some((item) => item.priceCents !== null);
  const priceFallback = { fallback: "Нет данных" } as const;
  const subtotalDisplay = formatPrice(
    hasPricedItems ? subtotalCents : null,
    subtotalCurrency,
    priceFallback,
  );

  const handleCheckout = () => {
    alert("Начат процесс оформления заказа! (демо)");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Корзина</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              <img
                src="https://picsum.photos/seed/emptycart/200/200"
                alt="Пустая корзина"
                className="w-40 h-40 rounded-full mb-4 opacity-50"
              />
              <h3 className="text-lg font-semibold text-gray-700">
                Ваша корзина пуста
              </h3>
              <p className="text-gray-500 mt-1">
                Похоже, вы еще ничего не добавили.
              </p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex py-4">
                    <img
                      src={getPrimaryImage(item.imageUrls)}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">
                            {formatPrice(
                              item.priceCents !== null
                                ? item.priceCents * item.quantity
                                : null,
                              item.currency,
                              priceFallback,
                            )}
                          </p>
                        </div>
                        {item.sku && (
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Артикул: {item.sku}
                          </p>
                        )}
                        {item.units && (
                          <p className="text-xs text-gray-500">
                            Единицы: {item.units}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 text-gray-600 hover:text-indigo-600 disabled:text-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 text-gray-600 hover:text-indigo-600"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="font-medium text-red-600 hover:text-red-800 flex items-center"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" /> Удалить
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between text-lg font-medium text-gray-900">
                <p>Итого</p>
                <p>{subtotalDisplay}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Стоимость доставки и налоги рассчитываются при оформлении
                заказа.
              </p>
              <div className="mt-6">
                {user ? (
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Оформить заказ
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onLoginClick();
                    }}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Войти, чтобы оформить
                  </button>
                )}
              </div>
              <div className="mt-4 flex justify-center text-sm text-center text-gray-500">
                <p>
                  или{" "}
                  <button
                    onClick={onClose}
                    className="text-indigo-600 font-medium hover:text-indigo-500"
                  >
                    Продолжить покупки
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
