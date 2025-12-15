import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function AdminProtected({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext)!;
  if (!auth.user) return <Navigate to="/login" replace />;
  if (auth.user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
