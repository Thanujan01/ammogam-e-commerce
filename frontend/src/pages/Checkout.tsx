import  { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout(){
  const cart = useContext(CartContext)!;
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  async function placeOrder() {
    try {
      const items = cart.items.map(it => ({ product: it.product._id, quantity: it.quantity, price: it.product.price }));
      const res = await api.post('/orders', { items, totalAmount: cart.totalAmount, address });
      console.log('Order placed:', res.data);
      cart.clearCart();
      navigate('/dashboard');
      alert('Order placed');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Checkout</h1>
      <div className="max-w-md">
        <label className="block mb-2">Delivery Address</label>
        <textarea className="border w-full p-2" value={address} onChange={(e)=> setAddress(e.target.value)} />
        <div className="mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={placeOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
