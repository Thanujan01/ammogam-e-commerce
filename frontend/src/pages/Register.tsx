import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const auth = useContext(AuthContext)!;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e: React.FormEvent){
    e.preventDefault();
    try {
      await auth.register({ name, email, password });
      nav('/');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="border w-full p-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border w-full p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="border w-full p-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
