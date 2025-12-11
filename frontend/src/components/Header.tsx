import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';

export default function Header(){
  const auth = useContext(AuthContext)!;
  const cart = useContext(CartContext)!;
  const nav = useNavigate();

  return (
    <header className="bg-white shadow">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-semibold">{import.meta.env.VITE_APP_TITLE}</Link>
        <nav className="space-x-4">
          <Link to="/products" className="hover:underline">Products</Link>
          <Link to="/cart" className="hover:underline">Cart ({cart.items.length})</Link>
          {auth.user ? (
            <>
              <span>Hi, {auth.user.name}</span>
              {auth.user.role === 'admin' && <Link to="/admin" className="ml-2">Admin</Link>}
              <button className="ml-2 text-sm underline" onClick={() => { auth.logout(); nav('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="ml-2">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
