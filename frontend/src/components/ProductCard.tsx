import React from 'react';
import { Link } from 'react-router-dom';
import type { IProduct } from '../types';

export default function ProductCard({ product }: { product: IProduct }) {
  const image = product.image || '/placeholder.png';
  return (
    <div className="border rounded-md p-4 flex flex-col">
      <img src={image} alt={product.name} className="h-40 object-cover mb-3 rounded" />
      <h3 className="font-semibold">{product.name}</h3>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold">Rs {product.price}</span>
        <Link to={`/products/${product._id}`} className="text-sm underline">View</Link>
      </div>
    </div>
  );
}
