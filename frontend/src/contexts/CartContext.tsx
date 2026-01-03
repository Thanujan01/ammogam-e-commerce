// contexts/CartContext.tsx
import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { IProduct, ICartItem } from '../types';
import { api } from '../api/api';

type CartContextType = {
  items: ICartItem[];
  selectedItems: Set<string>;
  selectedCartItems: ICartItem[];
  addToCart: (product: IProduct, qty?: number, variationId?: string, color?: string, colorCode?: string, selectedImageIndex?: number, selectedSize?: string, selectedWeight?: string, price?: number) => string;
  removeFromCart: (productId: string, variationId?: string, selectedSize?: string, selectedWeight?: string) => void;
  updateQty: (productId: string, qty: number, variationId?: string, selectedSize?: string, selectedWeight?: string) => void;
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
    return `${item.product._id}-${item.variationId || 'default'}-${item.selectedSize || ''}-${item.selectedWeight || ''}`;
  };

  // Get selected cart items
  const selectedCartItems = items.filter(item => selectedItems.has(getItemKey(item)));

  // Calculate selected totals
  const selectedTotalAmount = selectedCartItems.reduce((s, it) => {
    const basePrice = it.price || it.product.price;
    const finalPrice = it.product.discount && it.product.discount > 0
      ? Math.round(basePrice * (100 - it.product.discount) / 100)
      : basePrice;
    return s + (finalPrice || 0) * it.quantity;
  }, 0);

  const selectedShippingFee = selectedCartItems.reduce((acc, it, idx) => {
    const isFirstOccurrence = selectedCartItems.findIndex(i => i.product._id === it.product._id) === idx;
    if (!isFirstOccurrence) return acc;
    return acc + (it.product.shippingFee || 0);
  }, 0);

  const selectedItemsCount = selectedCartItems.reduce((s, it) => s + it.quantity, 0);

  function addToCart(
    product: IProduct,
    qty = 1,
    variationId?: string,
    color?: string,
    colorCode?: string,
    selectedImageIndex?: number,
    selectedSize?: string,
    selectedWeight?: string,
    price?: number
  ): string {
    if (!product) return '';

    const pid = product._id || (product as any).id;
    if (!pid) return '';

    const itemKey = `${pid}-${variationId || 'default'}-${selectedSize || ''}-${selectedWeight || ''}`;

    setItems(prev => {
      const exist = prev.find(it =>
        it.product._id === pid &&
        it.variationId === variationId &&
        it.selectedSize === selectedSize &&
        it.selectedWeight === selectedWeight
      );

      if (exist) {
        return prev.map(it =>
          it.product._id === pid && it.variationId === variationId && it.selectedSize === selectedSize && it.selectedWeight === selectedWeight
            ? {
              ...it,
              quantity: it.quantity + qty,
              selectedImageIndex: selectedImageIndex !== undefined ? selectedImageIndex : it.selectedImageIndex
            }
            : it
        );
      }

      return [
        ...prev,
        {
          product: { ...product, _id: pid, price: Number(product.price) || 0 },
          quantity: qty,
          variationId,
          selectedColor: color,
          selectedColorCode: colorCode,
          selectedImageIndex: selectedImageIndex !== undefined ? selectedImageIndex : 0,
          selectedSize,
          selectedWeight,
          price: price !== undefined ? price : Number(product.price) || 0
        }
      ];
    });

    // ✅ SAFE update
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.add(itemKey);
      return next;
    });

    return itemKey;
  }

  function removeFromCart(productId: string, variationId?: string, selectedSize?: string, selectedWeight?: string) {
    const itemKey = `${productId}-${variationId || 'default'}-${selectedSize || ''}-${selectedWeight || ''}`;

    setItems(prev =>
      prev.filter(it => getItemKey(it) !== itemKey)
    );

    setSelectedItems(prev => {
      const next = new Set(prev);
      next.delete(itemKey);
      return next;
    });
  }

  function updateQty(productId: string, qty: number, variationId?: string, selectedSize?: string, selectedWeight?: string) {
    setItems(prev => prev.map(it =>
      it.product._id === productId &&
        it.variationId === variationId &&
        it.selectedSize === selectedSize &&
        it.selectedWeight === selectedWeight
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
    const allKeys = items.map(getItemKey);

    if (selectedItems.size === allKeys.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allKeys));
    }
  };

  const totalAmount = items.reduce((s, it) => {
    const basePrice = it.price || it.product.price;
    const finalPrice = it.product.discount && it.product.discount > 0
      ? Math.round(basePrice * (100 - it.product.discount) / 100)
      : basePrice;
    return s + (finalPrice || 0) * it.quantity;
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