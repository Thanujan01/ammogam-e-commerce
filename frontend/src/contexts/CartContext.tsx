// contexts/CartContext.tsx
import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { IProduct, ICartItem } from '../types';
import { api } from '../api/api';

type CartContextType = {
  items: ICartItem[];
  selectedItems: Set<string>;
  selectedCartItems: ICartItem[];
  addToCart: (product: IProduct, qty?: number, variationId?: string, color?: string, colorCode?: string) => string;
  removeFromCart: (productId: string, variationId?: string) => void;
  updateQty: (productId: string, qty: number, variationId?: string) => void;
  clearCart: () => void;
  updateSelectedItems: (itemIds: Set<string>) => void;
  toggleSelectItem: (item: ICartItem) => void;
  toggleSelectAll: () => void;
  getItemKey: (item: ICartItem) => string;
  totalAmount: number;
  selectedTotalAmount: number;
  shippingFee: number;
  selectedShippingFee: number;
  feePerAdditionalItem: number;
  totalItems: number;
  selectedItemsCount: number;
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

  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('ammogam_selected_items');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (error) {
      console.error("Error parsing selected items from localStorage:", error);
      return new Set();
    }
  });

  const feePerAdditionalItem = 0;

  // Save both cart items and selected items to localStorage
  useEffect(() => {
    localStorage.setItem('ammogam_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('ammogam_selected_items', JSON.stringify(Array.from(selectedItems)));
  }, [selectedItems]);

  // Sync prices with backend
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
                stock: fresh.stock,
                seller: fresh.seller
              }
            };
          }
          if (fresh && fresh.seller && !item.product.seller) {
            return {
              ...item,
              product: {
                ...item.product,
                seller: fresh.seller
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

  // Helper function to get item key
  const getItemKey = (item: ICartItem) => {
    return `${item.product._id}-${item.variationId || 'default'}`;
  };

  // Get selected cart items
  const selectedCartItems = items.filter(item => selectedItems.has(getItemKey(item)));

  // Calculate selected totals
  const selectedTotalAmount = selectedCartItems.reduce((s, it) => {
    const price = it.product.discount && it.product.discount > 0
      ? Math.round(it.product.price * (100 - it.product.discount) / 100)
      : it.product.price;
    return s + (price || 0) * it.quantity;
  }, 0);

  const selectedShippingFee = selectedCartItems.reduce((acc, it, idx) => {
    const isFirstOccurrence = selectedCartItems.findIndex(i => i.product._id === it.product._id) === idx;
    if (!isFirstOccurrence) return acc;
    return acc + (it.product.shippingFee || 0);
  }, 0);

  const selectedItemsCount = selectedCartItems.reduce((s, it) => s + it.quantity, 0);

  // ✅ FIXED: addToCart function now returns the item key
  function addToCart(product: IProduct, qty = 1, variationId?: string, color?: string, colorCode?: string): string {
    if (!product) return '';
    const pid = product._id || (product as any).id;
    if (!pid) return '';

    const processedProduct = {
      ...product,
      _id: pid as string,
      price: Number(product.price) || 0
    };

    const itemKey = `${pid}-${variationId || 'default'}`;

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
      
      // Add new item and auto-select it
      const newSelectedItems = new Set(selectedItems);
      newSelectedItems.add(itemKey);
      setSelectedItems(newSelectedItems);
      
      return [...prev, {
        product: processedProduct,
        quantity: qty,
        variationId,
        selectedColor: color,
        selectedColorCode: colorCode
      }];
    });

    // ✅ Return the item key
    return itemKey;
  }

  function removeFromCart(productId: string, variationId?: string) {
    const itemKey = `${productId}-${variationId || 'default'}`;
    setItems(prev => prev.filter(it =>
      !(it.product._id === productId && it.variationId === variationId)
    ));
    
    // Also remove from selected items
    const newSelectedItems = new Set(selectedItems);
    newSelectedItems.delete(itemKey);
    setSelectedItems(newSelectedItems);
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
    setSelectedItems(new Set());
  }

  // Selected items functions
  const updateSelectedItems = (itemIds: Set<string>) => {
    setSelectedItems(itemIds);
  };

  const toggleSelectItem = (item: ICartItem) => {
    const key = getItemKey(item);
    const newSelected = new Set(selectedItems);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      const allKeys = items.map(getItemKey);
      setSelectedItems(new Set(allKeys));
    }
  };

  const totalAmount = items.reduce((s, it) => {
    const price = it.product.discount && it.product.discount > 0
      ? Math.round(it.product.price * (100 - it.product.discount) / 100)
      : it.product.price;
    return s + (price || 0) * it.quantity;
  }, 0);

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);

  // Dynamic Shipping Fee Calculation (Per Unique Product)
  const shippingFee = items.reduce((acc, it, idx) => {
    const isFirstOccurrence = items.findIndex(i => i.product._id === it.product._id) === idx;
    if (!isFirstOccurrence) return acc;
    return acc + (it.product.shippingFee || 0);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      selectedItems,
      selectedCartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      updateSelectedItems,
      toggleSelectItem,
      toggleSelectAll,
      getItemKey,
      totalAmount,
      selectedTotalAmount,
      shippingFee,
      selectedShippingFee,
      feePerAdditionalItem,
      totalItems,
      selectedItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};