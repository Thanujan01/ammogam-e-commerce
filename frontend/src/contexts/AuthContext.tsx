import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api, setAuthToken } from '../api/api';

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'seller';
  phone?: string;
  address?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (payload: any) => Promise<void>;
  updateUser: (userData: User) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const r = localStorage.getItem('ammogam_user'); return r ? JSON.parse(r) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ammogam_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(token ?? undefined);
    setLoading(false);
  }, [token]);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    const { token: t, user } = data;
    localStorage.setItem('ammogam_token', t);
    localStorage.setItem('ammogam_user', JSON.stringify(user));
    setToken(t);
    setUser(user);
    setAuthToken(t);
    return user;
  }

  async function register(payload: any) {
    await api.post('/auth/register', payload);
    // auto login after registration
    await login(payload.email, payload.password);
  }

  function logout() {
    localStorage.removeItem('ammogam_token');
    localStorage.removeItem('ammogam_user');
    setToken(null);
    setUser(null);
    setAuthToken(undefined);
  }

  function updateUser(userData: User) {
    localStorage.setItem('ammogam_user', JSON.stringify(userData));
    setUser(userData);
  }

  return <AuthContext.Provider value={{ user, token, loading, login, logout, register, updateUser }}>{children}</AuthContext.Provider>;
};
