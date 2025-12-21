import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface SellerProtectedProps {
    children: React.ReactNode;
}

export default function SellerProtected({ children }: SellerProtectedProps) {
    const auth = useContext(AuthContext);

    if (auth?.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!auth?.user || auth.user.role !== 'seller') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
