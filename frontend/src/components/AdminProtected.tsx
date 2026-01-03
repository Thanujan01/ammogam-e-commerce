import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function AdminProtected({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext)!;

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#d97706] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!auth.user) return <Navigate to="/login" replace />;
  if (auth.user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
