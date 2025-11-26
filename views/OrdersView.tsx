/**
 * @file OrdersView.tsx renders the authenticated customer's order history with
 * expandable line items.
 */
import React, { useEffect, useMemo, useState } from "react";
import type { Order, User } from "../types";
import { fetchOrders } from "../services/api";
import { formatPrice } from "../utils/formatPrice";
import { SpinnerIcon } from "../components/Icons";

interface OrdersViewProps {
  user: User | null;
  onLoginClick: () => void;
}

/**
 * Displays an overview of all orders with collapsible detail rows.
 */
const OrdersView: React.FC<OrdersViewProps> = ({ user, onLoginClick }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime(),
      ),
    [orders],
  );

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedOrders = await fetchOrders();
        if (isMounted) {
          setOrders(fetchedOrders);
        }
      } catch (requestError) {
        if (isMounted) {
          console.error("Failed to load orders", requestError);
          setError("Не удалось загрузить список заказов. Попробуйте еще раз.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const toggleExpanded = (orderId: number) => {
    setExpandedOrders((current) => {
      const nextExpanded = new Set(current);
      if (nextExpanded.has(orderId)) {
        nextExpanded.delete(orderId);
      } else {
        nextExpanded.add(orderId);
      }
      return nextExpanded;
    });
  };

  if (!user) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Войдите, чтобы увидеть свои заказы
        </h2>
        <p className="text-gray-600 mb-4">
          История заказов доступна после входа в аккаунт.
        </p>
        <button
          onClick={onLoginClick}
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          Войти
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <SpinnerIcon className="w-10 h-10 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
        {error}
      </div>
    );
  }

  if (!sortedOrders.length) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          У вас пока нет заказов
        </h2>
        <p className="text-gray-600">
          Как только вы оформите заказ, он появится здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedOrders.map((order) => {
        const currency = order.currency || "RUB";
        const totalLabel = formatPrice(order.totalCents, currency, {
          fallback: "Сумма недоступна",
        });
        const isExpanded = expandedOrders.has(order.id);

        return (
          <div key={order.id} className="bg-white shadow rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Заказ #{order.id}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {totalLabel}
                </p>
                <p className="text-sm text-gray-600">
                  Статус: <span className="font-medium">{order.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Оформлен: {new Date(order.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>
              <button
                onClick={() => toggleExpanded(order.id)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {isExpanded ? "Скрыть товары" : "Показать товары"}
              </button>
            </div>

            {isExpanded && (
              <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                {order.products.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Количество: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.priceCents, currency)}
                      </p>
                      <p className="text-xs text-gray-500">{currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersView;
