"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { getProductById, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "./products";

type CartItem = { id: string; qty: number };

type CartContextType = {
  items: Record<string, number>;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  lines: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nbl_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem("nbl_cart", JSON.stringify(items)); } catch {}
    }
  }, [items, mounted]);

  const addToCart = useCallback((id: string, qty = 1) => {
    const p = getProductById(id);
    if (!p || p.stock <= 0) return;
    setItems((prev) => ({ ...prev, [id]: Math.min(99, (prev[id] || 0) + qty) }));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } else {
      setItems((prev) => ({ ...prev, [id]: Math.min(99, qty) }));
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }, []);

  const clearCart = useCallback(() => setItems({}), []);

  const lines = Object.entries(items).map(([id, qty]) => ({ id, qty })).filter((l) => getProductById(l.id));
  const cartCount = Object.values(items).reduce((a, b) => a + b, 0);
  const subtotal = lines.reduce((a, l) => {
    const p = getProductById(l.id);
    return a + (p ? p.price * l.qty : 0);
  }, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider value={{ items, addToCart, setQty, removeItem, clearCart, cartCount, subtotal, shipping, total, lines, isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
