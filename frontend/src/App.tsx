import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login'; // single login page
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';

import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
// import AdminCategories from './pages/Admin/AdminCategories';
// import AdminOrders from './pages/Admin/AdminOrders';

import ProtectedRoute from './components/ProtectedRoute';
import AdminProtected from './components/AdminProtected';

function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<ProductList/>} />
          <Route path="/products/:id" element={<ProductDetail/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard/></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminProtected><AdminDashboard/></AdminProtected>} />
          <Route path="/admin/products" element={<AdminProtected><AdminProducts/></AdminProtected>} />
          {/* <Route path="/admin/categories" element={<AdminProtected><AdminCategories/></AdminProtected>} />
          <Route path="/admin/orders" element={<AdminProtected><AdminOrders/></AdminProtected>} /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
