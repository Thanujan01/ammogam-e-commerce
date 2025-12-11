import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api/api';

export default function UserDashboard(){
  const auth = useContext(AuthContext)!;
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(()=> {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">My Dashboard</h1>
      <div className="mt-4">
        <h3 className="font-semibold">Profile</h3>
        <div>{auth.user?.name} — {auth.user?.email}</div>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold">Orders</h3>
        {orders.length === 0 ? <div>No orders yet</div> : (
          <ul>
            {orders.map(o => <li key={o._id} className="border-b py-2">#{o._id} — Rs {o.totalAmount} — {o.status}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
