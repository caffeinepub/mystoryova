import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  type: "merch" | "audiobook";
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  productId: string;
  selectedSize?: string;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("mystoryova_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("mystoryova_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.type === item.type &&
          i.selectedSize === item.selectedSize,
      );
      if (existing) {
        if (item.type === "audiobook") return prev;
        return prev.map((i) =>
          i.productId === item.productId &&
          i.type === item.type &&
          i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [
        ...prev,
        {
          ...item,
          id: `${item.type}_${item.productId}_${item.selectedSize ?? ""}_${Date.now()}`,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        if (i.type === "audiobook") return i;
        return { ...i, quantity };
      }),
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
