import  { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import type { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext)!;
  if (!auth.user) return <Navigate to="/login" replace />;
  return children;
}
