import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { Chart } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

export default function AdminDashboard(){
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0 });

  useEffect(()=> {
    // placeholder: call admin stats endpoint when ready
    api.get('/orders').then(r => {
      setStats(prev => ({ ...prev, totalOrders: r.data.length }));
    }).catch(()=>{});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="p-4 border rounded">Total Revenue <div className="text-lg font-bold">Rs {stats.totalRevenue}</div></div>
        <div className="p-4 border rounded">Total Orders <div className="text-lg font-bold">{stats.totalOrders}</div></div>
        <div className="p-4 border rounded">Total Users <div className="text-lg font-bold">{stats.totalUsers}</div></div>
      </div>
    </div>
  );
}
