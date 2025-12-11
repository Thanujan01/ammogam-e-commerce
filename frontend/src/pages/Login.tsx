import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const auth = useContext(AuthContext)!;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.login(email, password);
      // redirect based on role
      const role = auth.user?.role;
      if (role === 'admin') nav('/admin');
      else nav('/dashboard');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required className="border w-full p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" required className="border w-full p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-3 text-sm">Use same login for both admin & customer. Admins must be created in DB or seeded.</p>
    </div>
  );
}
