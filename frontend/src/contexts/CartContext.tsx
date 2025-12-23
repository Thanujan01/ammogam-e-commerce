// contexts/CartContext.tsx
import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { IProduct, ICartItem } from '../types';
import { api } from '../api/api';

type CartContextType = {
  items: ICartItem[];
  addToCart: (product: IProduct, qty?: number, variationId?: string, color?: string, colorCode?: string) => void;
  removeFromCart: (productId: string, variationId?: string) => void;
  updateQty: (productId: string, qty: number, variationId?: string) => void;
  clearCart: () => void;
  totalAmount: number;
  shippingFee: number;
  feePerAdditionalItem: number;
  freeShippingThreshold: number;
  totalItems: number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ICartItem[]>(() => {
    try {
      const raw = localStorage.getItem('ammogam_cart'); 
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });
  const [shippingFee, setShippingFee] = useState(10);
  const [feePerAdditionalItem, setFeePerAdditionalItem] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100);

  useEffect(() => {
    localStorage.setItem('ammogam_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    api.get('/settings').then(res => {
      setShippingFee(res.data.shippingFee);
      setFeePerAdditionalItem(res.data.feePerAdditionalItem || 0);
      setFreeShippingThreshold(res.data.freeShippingThreshold);
    }).catch(console.error);
  }, []);

  // Sync prices with backend to ensure they are never 0 if products have prices
  useEffect(() => {
    const syncPrices = async () => {
      if (items.length === 0) return;
      try {
        const res = await api.get('/products');
        const products = res.data;
        setItems(prev => prev.map(item => {
          const fresh = products.find((p: any) => p._id === (item.product._id || (item.product as any).id));
          if (fresh && fresh.price !== undefined && fresh.price !== item.product.price) {
            console.log(`Syncing price for ${item.product.name}: ${item.product.price} -> ${fresh.price}`);
            return { 
              ...item, 
              product: { 
                ...item.product, 
                price: fresh.price,
                discount: fresh.discount,
                stock: fresh.stock 
              } 
            };
          }
          return item;
        }));
      } catch (err) {
        console.error("Price sync failed", err);
      }
    };
    syncPrices();
  }, [items.length]);

  function addToCart(product: IProduct, qty = 1, variationId?: string, color?: string, colorCode?: string) {
    if (!product) return;
    const pid = product._id || (product as any).id;
    if (!pid) return;

    // Ensure price is a number
    const processedProduct = {
      ...product,
      _id: pid as string,
      price: Number(product.price) || 0
    };

    setItems(prev => {
      const exist = prev.find(it => 
        (it.product._id || (it.product as any).id) === pid && 
        it.variationId === variationId
      );
      
      if (exist) {
        return prev.map(it => 
          (it.product._id || (it.product as any).id) === pid && it.variationId === variationId
            ? { ...it, quantity: it.quantity + qty }
            : it
        );
      }
      return [...prev, { 
        product: processedProduct, 
        quantity: qty,
        variationId,
        selectedColor: color,
        selectedColorCode: colorCode
      }];
    });
  }

  function removeFromCart(productId: string, variationId?: string) {
    setItems(prev => prev.filter(it => 
      !(it.product._id === productId && it.variationId === variationId)
    ));
  }

  function updateQty(productId: string, qty: number, variationId?: string) {
    setItems(prev => prev.map(it => 
      it.product._id === productId && it.variationId === variationId
        ? { ...it, quantity: qty }
        : it
    ));
  }

  function clearCart() {
    setItems([]);
  }

  const totalAmount = items.reduce((s, it) => {
    const price = it.product.discount && it.product.discount > 0
      ? Math.round(it.product.price * (100 - it.product.discount) / 100)
      : it.product.price;
    return s + (price || 0) * it.quantity;
  }, 0);

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalAmount,
      shippingFee,
      feePerAdditionalItem,
      freeShippingThreshold,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};