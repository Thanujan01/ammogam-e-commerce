/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  address?: string;
  phone?: string;
  createdAt?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: any;
  image?: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  address?: string;
  phone?: string;
  createdAt?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: any;
  image?: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

// Add to your existing types.ts or create a new file
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  image?: string;
  subcategories: ISubCategory[];
}

export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  image?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  stock: number;
  discount?: number;
  rating?: number;
  sold?: number;
  shipping?: boolean;
  shippingCost?: number;
  brand?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}