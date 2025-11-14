import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "../types";

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  itemCount: number;
  subtotalCents: number;
  subtotalCurrency: string | null;
  hasPricedItems: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const removeItem = useCallback((productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

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

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
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
      itemCount,
      subtotalCents,
      subtotalCurrency,
      hasPricedItems,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
