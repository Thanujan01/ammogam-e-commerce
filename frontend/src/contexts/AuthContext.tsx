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
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (payload: any) => Promise<void>; // No auto login
  updateUser: (userData: User) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('ammogam_token');
      const storedUser = localStorage.getItem('ammogam_user');

      if (storedToken && storedUser) {
        // Only set auth if both token and user exist
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        setAuthToken(storedToken);
      } else {
        // Ensure clean state if no valid auth
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(undefined);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    const { token: t, user } = data;
    
    localStorage.setItem('ammogam_token', t);
    localStorage.setItem('ammogam_user', JSON.stringify(user));
    
    setToken(t);
    setUser(user);
    setIsAuthenticated(true);
    setAuthToken(t);
    
    return user;
  }

  async function register(payload: any) {
    // Only register, NO auto login
    await api.post('/auth/register', payload);
    // That's it! Don't call login() here
  }

  function logout() {
    localStorage.removeItem('ammogam_token');
    localStorage.removeItem('ammogam_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(undefined);
  }

  function updateUser(userData: User) {
    localStorage.setItem('ammogam_user', JSON.stringify(userData));
    setUser(userData);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};