/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ColorVariation {
  _id: string;
  color: string;
  colorName: string;
  colorCode: string;
  images: string[];
  stock: number;
  price?: number;
  sku?: string;
  variantType?: 'size' | 'weight' | 'none';
  sizes?: { size: string; stock: number; price: number }[];
  weights?: { weight: string; stock: number; price: number }[];
}

export interface ColorVariant {
  colorName: string;
  colorCode: string;
  variantType: 'size' | 'weight' | 'none';
  sizes?: { size: string; stock: number; price: number }[];
  weights?: { weight: string; stock: number; price: number }[];
  stock: number;
  images: string[];
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'seller';
  address?: string;
  phone?: string;
  businessName?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProduct {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: any;
  categoryId?: string;
  mainSubcategory?: string;
  subCategory?: string;
  image?: string;
  images?: string[];
  discount?: number;
  rating?: number;
  sold?: number;
  sales?: number;
  badge?: string;
  brand?: string;
  variations?: ColorVariation[];
  colorVariants?: ColorVariant[];
  hasVariations?: boolean;
  defaultColor?: string;
  specifications?: Array<{ key: string; value: string }>;
  tags?: string[];
  isActive?: boolean;
  seller?: {
    _id: string;
    name: string;
    businessName?: string;
    rating?: number;
  };
  createdAt?: string;
  updatedAt?: string;
  // Additional fields for enhanced UI
  shippingFee?: number;
  warranty?: string;
  returnPolicy?: string;
  certified?: boolean;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  selectedColor?: string;
  selectedColorCode?: string;
  variationId?: string;
  selectedImage?: string;
  selectedImageIndex?: number;
  selectedSize?: string;
  selectedWeight?: string;
  price: number;
}

export interface ICategory {
  _id: string;
  id?: string;
  name: string;
  icon?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  image?: string;
  promoText?: string;
  mainSubcategories?: {
    title: string;
    items: string[];
  }[];
  featuredProducts?: {
    name: string;
    price: string;
    discount?: string;
    tag?: string;
    image: string;
  }[];
  subCategories: { name: string }[];
  description?: string;
  productCount?: number;
  createdAt?: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  items: Array<{
    product: IProduct;
    quantity: number;
    price: number;
    color?: string;
    variationId?: string;
    selectedSize?: string;
    selectedWeight?: string;
  }>;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface IWishlistItem {
  product: IProduct;
  addedAt: string;
}