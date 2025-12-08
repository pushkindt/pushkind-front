/**
 * @file OrdersView.tsx renders the authenticated customer's order history with
 * expandable line items.
 */
import React, { useEffect, useMemo, useState } from "react";
import type { Order, User } from "../types";
import type { OrderUpdatePayload } from "../services/api";
import { fetchOrders, updateOrderDetails } from "../services/api";
import { formatPrice } from "../utils/formatPrice";
import { SpinnerIcon } from "../components/Icons";
import { showToast } from "../services/toast";

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
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [editingOrders, setEditingOrders] = useState<Set<number>>(new Set());
  const [orderDrafts, setOrderDrafts] = useState<
    Record<
      number,
      {
        shippingAddress: string;
        consignee: string;
        deliveryNotes: string;
        payer: string;
      }
    >
  >({});
  const [savingOrders, setSavingOrders] = useState<Set<number>>(new Set());
  const [saveStatuses, setSaveStatuses] = useState<
    Record<number, { type: "success" | "error"; message: string }>
  >({});

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

  const createDraftFromOrder = (order: Order) => ({
    shippingAddress: order.shippingAddress ?? "",
    consignee: order.consignee ?? "",
    deliveryNotes: order.deliveryNotes ?? "",
    payer: order.payer ?? "",
  });

  const toggleEditing = (order: Order) => {
    setEditingOrders((current) => {
      const nextEditing = new Set(current);
      if (nextEditing.has(order.id)) {
        nextEditing.delete(order.id);
      } else {
        nextEditing.add(order.id);
      }
      return nextEditing;
    });

    setOrderDrafts((currentDrafts) => ({
      ...currentDrafts,
      [order.id]: currentDrafts[order.id] ?? createDraftFromOrder(order),
    }));
    setSaveStatuses((current) => {
      const { [order.id]: _removed, ...rest } = current;
      return rest;
    });
  };

  const handleDraftChange = (
    orderId: number,
    field: keyof OrderUpdatePayload,
    value: string,
  ) => {
    setOrderDrafts((current) => ({
      ...current,
      [orderId]: {
        ...(current[orderId] ?? {
          shippingAddress: "",
          consignee: "",
          deliveryNotes: "",
          payer: "",
        }),
        [field]: value,
      },
    }));
  };

  const sanitizeValue = (value: string) => {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  };

  const handleSaveDetails = async (order: Order) => {
    const draft = orderDrafts[order.id] ?? createDraftFromOrder(order);
    const payload = {
      shippingAddress: sanitizeValue(draft.shippingAddress),
      consignee: sanitizeValue(draft.consignee),
      deliveryNotes: sanitizeValue(draft.deliveryNotes),
      payer: sanitizeValue(draft.payer),
    } as const;

    const previousOrders = orders;
    const optimisticOrder: Order = { ...order, ...payload };

    setSavingOrders((current) => new Set(current).add(order.id));
    setSaveStatuses((current) => {
      const { [order.id]: _removed, ...rest } = current;
      return rest;
    });
    setUpdateError(null);

    setOrders((current) =>
      current.map((existing) =>
        existing.id === order.id ? optimisticOrder : existing,
      ),
    );
    setOrderDrafts((current) => ({
      ...current,
      [order.id]: createDraftFromOrder(optimisticOrder),
    }));

    try {
      const updatedOrder = await updateOrderDetails(order.id, payload);
      setOrders((current) =>
        current.map((existing) =>
          existing.id === order.id ? updatedOrder : existing,
        ),
      );
      setOrderDrafts((current) => ({
        ...current,
        [order.id]: createDraftFromOrder(updatedOrder),
      }));
      try {
        const refreshedOrders = await fetchOrders();
        setOrders(refreshedOrders);
        const refreshedOrder = refreshedOrders.find(
          (existing) => existing.id === order.id,
        );
        if (refreshedOrder) {
          setOrderDrafts((current) => ({
            ...current,
            [order.id]: createDraftFromOrder(refreshedOrder),
          }));
        }
      } catch (refreshError) {
        console.error("Failed to refresh orders after update", refreshError);
      }
      setSaveStatuses((current) => ({
        ...current,
        [order.id]: {
          type: "success",
          message: "Данные заказа обновлены.",
        },
      }));
      showToast("Данные заказа обновлены.", "info");
    } catch (updateError) {
      console.error("Failed to update order", updateError);
      setOrders(previousOrders);
      setOrderDrafts((current) => ({
        ...current,
        [order.id]: createDraftFromOrder(order),
      }));
      setUpdateError(
        "Не удалось обновить данные заказа. Попробуйте еще раз.",
      );
      setSaveStatuses((current) => ({
        ...current,
        [order.id]: {
          type: "error",
          message: "Не удалось обновить данные заказа.",
        },
      }));
      showToast("Не удалось обновить данные заказа.", "error");
    } finally {
      setSavingOrders((current) => {
        const nextSaving = new Set(current);
        nextSaving.delete(order.id);
        return nextSaving;
      });
    }
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
      {updateError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {updateError}
        </div>
      )}
      {sortedOrders.map((order) => {
        const currency = order.currency || "RUB";
        const totalLabel = formatPrice(order.totalCents, currency, {
          fallback: "Сумма недоступна",
        });
        const isExpanded = expandedOrders.has(order.id);
        const isEditing = editingOrders.has(order.id);
        const isSaving = savingOrders.has(order.id);
        const draft = orderDrafts[order.id] ?? createDraftFromOrder(order);
        const optionalFields = [
          { label: "Адрес доставки", value: order.shippingAddress },
          { label: "Получатель", value: order.consignee },
          { label: "Примечания", value: order.deliveryNotes },
          { label: "Плательщик", value: order.payer },
        ]
          .map((field) => ({
            label: field.label,
            value: field.value?.trim(),
          }))
          .filter(
            (
              field,
            ): field is {
              label: string;
              value: string;
            } => Boolean(field.value),
          );

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
                {optionalFields.length > 0 && (
                  <dl className="mt-3 grid gap-2 text-sm text-gray-600">
                    {optionalFields.map((field) => (
                      <div key={`${order.id}-${field.label}`}>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {field.label}
                        </dt>
                        <dd className="text-sm text-gray-700">{field.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <button
                onClick={() => toggleExpanded(order.id)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {isExpanded ? "Скрыть товары" : "Показать товары"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => toggleEditing(order)}
                disabled={isSaving}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {isEditing ? "Скрыть редактирование" : "Редактировать данные"}
              </button>
              {isSaving && (
                <span className="text-sm text-gray-500">Сохранение...</span>
              )}
            </div>

            {isEditing && (
              <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Адрес доставки
                    <input
                      type="text"
                      value={draft.shippingAddress}
                      onChange={(event) =>
                        handleDraftChange(order.id, "shippingAddress", event.target.value)
                      }
                      disabled={isSaving}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Укажите адрес доставки"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Получатель
                    <input
                      type="text"
                      value={draft.consignee}
                      onChange={(event) =>
                        handleDraftChange(order.id, "consignee", event.target.value)
                      }
                      disabled={isSaving}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Имя получателя"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Примечания
                    <textarea
                      value={draft.deliveryNotes}
                      onChange={(event) =>
                        handleDraftChange(order.id, "deliveryNotes", event.target.value)
                      }
                      disabled={isSaving}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Дополнительные пожелания к доставке"
                      rows={3}
                    ></textarea>
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Плательщик
                    <input
                      type="text"
                      value={draft.payer}
                      onChange={(event) =>
                        handleDraftChange(order.id, "payer", event.target.value)
                      }
                      disabled={isSaving}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="ФИО плательщика"
                    />
                  </label>
                </div>

                {saveStatuses[order.id]?.message && (
                  <div
                    className={`text-sm ${
                      saveStatuses[order.id]?.type === "success"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {saveStatuses[order.id]?.message}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSaveDetails(order)}
                    disabled={isSaving}
                    className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md shadow-sm ${
                      isSaving
                        ? "bg-indigo-300 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    Сохранить изменения
                  </button>
                  <button
                    onClick={() => toggleEditing(order)}
                    disabled={isSaving}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

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
