/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'seller';
  address?: string;
  phone?: string;
  createdAt?: string;
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
  seller?: {
    _id: string;
    name: string;
    businessName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
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