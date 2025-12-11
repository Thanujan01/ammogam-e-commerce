import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import type { IProduct } from '../../types';

export default function AdminProducts(){
  const [products, setProducts] = useState<IProduct[]>([]);
  const [form, setForm] = useState<any>({ name: '', price: 0, stock: 0, description: '' });

  useEffect(()=> {
    api.get('/products').then(r => setProducts(r.data)).catch(console.error);
  }, []);

  async function createProduct() {
    try {
      const res = await api.post('/products', form);
      setProducts(prev => [res.data, ...prev]);
      setForm({ name:'', price:0, stock:0, description:''});
    } catch(err:any){ alert(err?.response?.data?.message || err.message); }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Products</h2>
      <div className="mt-4 grid gap-4">
        <div className="border p-4 rounded">
          <h3 className="font-semibold">Create Product</h3>
          <input className="border w-full p-2 mt-2" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
          <input className="border w-full p-2 mt-2" placeholder="Price" type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})}/>
          <input className="border w-full p-2 mt-2" placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})}/>
          <textarea className="border w-full p-2 mt-2" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={createProduct}>Create</button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Product list</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {products.map(p => (
              <div key={p._id} className="border p-3 rounded">
                <div className="flex justify-between">
                  <div>{p.name}</div>
                  <div>Rs {p.price}</div>
                </div>
                <div className="text-sm mt-2">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
