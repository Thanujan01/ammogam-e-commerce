import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api';
import type { IProduct } from '../types';
import { CartContext } from '../contexts/CartContext';

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const cart = useContext(CartContext)!;

  useEffect(()=> {
    if (!id) return;
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(console.error);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="md:flex gap-6">
      <img src={product.image || '/placeholder.png'} className="w-full md:w-1/2 h-80 object-cover rounded" />
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="mt-3">{product.description}</p>
        <div className="mt-6">
          <div className="text-xl font-semibold">Rs {product.price}</div>
          <div className="mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => cart.addToCart(product)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
