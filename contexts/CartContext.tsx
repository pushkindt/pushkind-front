/**
 * @file CartContext.tsx stores cart state and exposes mutation helpers.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem, Product, User } from "../types";
import { fetchProductById } from "../services/api";

/**
 * Shape of the cart context consumers receive.
 */
interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  refreshPricesForUser: (user: User | null) => Promise<void>;
  itemCount: number;
  subtotalCents: number;
  subtotalCurrency: string | null;
  hasPricedItems: boolean;
}

/** React context that holds cart data. */
const CartContext = createContext<CartContextValue | undefined>(undefined);

/** Props accepted by the `CartProvider`. */
interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that keeps cart state in sync for the entire app.
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const itemsRef = useRef<CartItem[]>(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  /** Adds a product to the cart, incrementing quantity when necessary. */
  const addItem = useCallback((product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  /** Removes a product entirely from the cart. */
  const removeItem = useCallback((productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  /** Adjusts the quantity of a specific product, removing it if below 1. */
  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeItem],
  );

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const subtotalCents = useMemo(
    () =>
      items.reduce((acc, item) => {
        if (item.priceCents === null) {
          return acc;
        }
        return acc + item.priceCents * item.quantity;
      }, 0),
    [items],
  );

  const hasPricedItems = useMemo(
    () => items.some((item) => item.priceCents !== null),
    [items],
  );

  const subtotalCurrency = useMemo(() => items[0]?.currency ?? null, [items]);

  /**
   * Refreshes cart items with user-aware pricing when a shopper authenticates.
   */
  const refreshPricesForUser = useCallback(async (user: User | null) => {
    if (!user) {
      return;
    }

    const itemsSnapshot = itemsRef.current;
    if (itemsSnapshot.length === 0) {
      return;
    }

    const updatedItems = await Promise.all(
      itemsSnapshot.map(async (item) => {
        const latestProduct = await fetchProductById(item.id);
        return {
          ...item,
          ...(latestProduct ?? {}),
          quantity: item.quantity,
        };
      }),
    );

    const updatedMap = new Map(updatedItems.map((item) => [item.id, item]));

    setItems((prevItems) =>
      prevItems.map((prevItem) => {
        const updatedItem = updatedMap.get(prevItem.id);
        if (!updatedItem) {
          return prevItem;
        }

        return {
          ...prevItem,
          ...updatedItem,
          quantity: prevItem.quantity,
        };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      refreshPricesForUser,
      itemCount,
      subtotalCents,
      subtotalCurrency,
      hasPricedItems,
    }),
    [
      items,
      addItem,
      updateQuantity,
      removeItem,
      refreshPricesForUser,
      itemCount,
      subtotalCents,
      subtotalCurrency,
      hasPricedItems,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/** Hook that guarantees the cart context is available. */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
