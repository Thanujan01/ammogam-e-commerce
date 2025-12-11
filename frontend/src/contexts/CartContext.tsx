import React, { createContext, useEffect, useState, ReactNode } from 'react';
import type { IProduct, ICartItem } from '../types';

type IProduct = {
  _id: string; name: string; price: number; stock?: number; image?: string;
};

type ICartItem = { product: IProduct; quantity: number; };

type CartContextType = {
  items: ICartItem[];
  addToCart: (product: IProduct, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalAmount: number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ICartItem[]>(() => {
    const raw = localStorage.getItem('ammogam_cart'); return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => { localStorage.setItem('ammogam_cart', JSON.stringify(items)); }, [items]);

  function addToCart(product: IProduct, qty = 1) {
    setItems(prev => {
      const exist = prev.find(it => it.product._id === product._id);
      if (exist) return prev.map(it => it.product._id === product._id ? { ...it, quantity: it.quantity + qty } : it);
      return [...prev, { product, quantity: qty }];
    });
  }
  function removeFromCart(productId: string) { setItems(prev => prev.filter(it => it.product._id !== productId)); }
  function updateQty(productId: string, qty: number) { setItems(prev => prev.map(it => it.product._id === productId ? { ...it, quantity: qty } : it)); }
  function clearCart() { setItems([]); }
  const totalAmount = items.reduce((s, it) => s + it.product.price * it.quantity, 0);

  return <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalAmount }}>{children}</CartContext.Provider>;
};
