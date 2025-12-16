import { useEffect, useState } from 'react';
import { api } from '../api/api';
import ProductCard from '../components/ProductCard';
import type { IProduct } from '../types';

export default function ProductList(){
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(()=> {
    api.get('/products').then(r => setProducts(r.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
