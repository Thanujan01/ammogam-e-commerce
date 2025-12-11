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
