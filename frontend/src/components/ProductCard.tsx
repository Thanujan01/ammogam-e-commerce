import { createContext, useEffect, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { IProduct, ICartItem } from '../types';
import { api } from '../api/api';

type CartContextType = {
  items: ICartItem[];
  addToCart: (product: IProduct, quantity?: number, variationId?: string, color?: string, colorCode?: string) => void;
  removeFromCart: (productId: string, variationId?: string) => void;
  updateQty: (productId: string, quantity: number, variationId?: string) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
  shippingFee: number;
  feePerAdditionalItem: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  calculateShipping: () => number;
  getItemQuantity: (productId: string, variationId?: string) => number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ICartItem[]>(() => {
    try {
      const raw = localStorage.getItem('ammogam_cart');
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });
  
  const [shippingFee, setShippingFee] = useState(10);
  const [feePerAdditionalItem, setFeePerAdditionalItem] = useState(2);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100);

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data) {
          setShippingFee(res.data.shippingFee || 10);
          setFeePerAdditionalItem(res.data.feePerAdditionalItem || 2);
          setFreeShippingThreshold(res.data.freeShippingThreshold || 100);
        }
      } catch (error) {
        console.error('Failed to load shipping settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ammogam_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Sync product prices with backend periodically
  useEffect(() => {
    const syncProductPrices = async () => {
      if (items.length === 0) return;
      
      try {
        const productIds = items.map(item => item.product._id);
        const res = await api.post('/products/batch', { ids: productIds });
        const updatedProducts = res.data;
        
        if (updatedProducts && Array.isArray(updatedProducts)) {
          setItems(prev => prev.map(item => {
            const updatedProduct = updatedProducts.find(p => p._id === item.product._id);
            if (updatedProduct && updatedProduct.price !== undefined && updatedProduct.price !== item.product.price) {
              return {
                ...item,
                product: {
                  ...item.product,
                  price: updatedProduct.price,
                  discount: updatedProduct.discount || 0,
                  stock: updatedProduct.stock || 0
                }
              };
            }
            return item;
          }));
        }
      } catch (error) {
        console.error('Failed to sync product prices:', error);
      }
    };

    // Sync every 5 minutes when cart has items
    if (items.length > 0) {
      const interval = setInterval(syncProductPrices, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [items.length]);

  // Add to cart with color variation support
  function addToCart(product: IProduct, quantity = 1, variationId?: string, color?: string, colorCode?: string) {
    if (!product || quantity <= 0) return;
    
    const productId = product._id || (product as any).id;
    if (!productId) {
      console.error('Product ID is missing');
      return;
    }

    // Process the product to ensure all fields are valid
    const processedProduct: IProduct = {
      ...product,
      _id: productId as string,
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0,
      discount: Number(product.discount) || 0,
    };

    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product._id === productId && 
        item.variationId === variationId
      );

      if (existingIndex >= 0) {
        // Update existing item
        return prev.map((item, index) => 
          index === existingIndex 
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                selectedColor: color || item.selectedColor,
                selectedColorCode: colorCode || item.selectedColorCode
              }
            : item
        );
      } else {
        // Add new item
        const variations = product.variations || [];
        const selectedVariation = variationId ? variations.find(v => v._id === variationId) : null;
        
        const newItem: ICartItem = {
          product: processedProduct,
          quantity,
          variationId,
          selectedColor: color,
          selectedColorCode: colorCode,
          selectedImage: selectedVariation?.images?.[0] || product.images?.[0]
        };
        return [...prev, newItem];
      }
    });
  }

  // Remove from cart with variation support
  function removeFromCart(productId: string, variationId?: string) {
    setItems(prev => prev.filter(item => 
      !(item.product._id === productId && item.variationId === variationId)
    ));
  }

  // Update quantity with variation support
  function updateQty(productId: string, quantity: number, variationId?: string) {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
      return;
    }
    
    setItems(prev => prev.map(item => 
      item.product._id === productId && item.variationId === variationId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    ));
  }

  // Clear entire cart
  function clearCart() {
    setItems([]);
  }

  // Calculate total amount
  const totalAmount = items.reduce((total, item) => {
    const price = item.product.discount && item.product.discount > 0
      ? Math.round(item.product.price * (100 - item.product.discount) / 100)
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);

  // Calculate total items count
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Check if free shipping applies
  const isFreeShipping = totalAmount >= freeShippingThreshold;

  // Calculate shipping cost
  const calculateShipping = () => {
    if (isFreeShipping) return 0;
    
    const baseFee = shippingFee;
    const additionalItems = Math.max(0, totalItems - 1);
    const additionalFees = additionalItems * feePerAdditionalItem;
    
    return baseFee + additionalFees;
  };

  // Get quantity for specific product variation
  const getItemQuantity = (productId: string, variationId?: string) => {
    const item = items.find(item => 
      item.product._id === productId && 
      item.variationId === variationId
    );
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    totalAmount,
    totalItems,
    shippingFee,
    feePerAdditionalItem,
    freeShippingThreshold,
    isFreeShipping,
    calculateShipping,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};