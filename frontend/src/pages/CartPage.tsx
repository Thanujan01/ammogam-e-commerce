import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage(){
  const cart = useContext(CartContext)!;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/products" className="text-blue-600">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {cart.items.map(it => (
              <div key={it.product._id} className="flex items-center gap-4 border-b py-3">
                <img src={it.product.image || '/placeholder.png'} className="w-20 h-20 object-cover" />
                <div className="flex-1">
                  <div className="font-semibold">{it.product.name}</div>
                  <div>Rs {it.product.price}</div>
                </div>
                <div>
                  <input type="number" className="border px-2 w-20" value={it.quantity} onChange={(e)=> cart.updateQty(it.product._id, Math.max(1, Number(e.target.value)))} />
                  <button className="block mt-2 text-sm text-red-600" onClick={()=> cart.removeFromCart(it.product._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="mt-2">Total: Rs {cart.totalAmount}</div>
            <Link to="/checkout" className="block mt-4 bg-green-600 text-white text-center px-4 py-2 rounded">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}
