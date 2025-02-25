"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { MenuItem } from "@/types/menu";

interface CartItem extends MenuItem {
  quantity: number;
  selectedOption?: "full" | "half";
  uniqueId: string;
  categoryName: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    item: MenuItem,
    categoryName: string,
    selectedOption?: "full" | "half",
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (
    item: MenuItem,
    categoryName: string,
    selectedOption?: "full" | "half",
  ) => {
    const uniqueId = `${item.id}-${selectedOption}`;

    setItems((current) => {
      const itemIndex = current.findIndex(
        (cartItem) => cartItem.uniqueId === uniqueId,
      );

      if (itemIndex !== -1) {
        return current.map((cartItem) =>
          cartItem.uniqueId === uniqueId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [
        ...current,
        {
          ...item,
          quantity: 1,
          selectedOption,
          uniqueId,
          categoryName,
        },
      ];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((current) => current.filter((item) => item.uniqueId !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.uniqueId === itemId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const total = items.reduce((sum, item) => {
    const price =
      item.selectedOption === "half"
        ? item.halfPrice
        : item.promotion?.inPromotion
          ? item.promotion.promotionPrice
          : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
