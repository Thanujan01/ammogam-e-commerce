import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';
import { AuthContext } from './AuthContext';

interface WishlistContextType {
    wishlist: any[];
    wishlistCount: number;
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
    fetchWishlist: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext)!;

    const fetchWishlist = async () => {
        if (!user) {
            setWishlist([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.get('/wishlist');
            setWishlist(data.products || []);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const toggleWishlist = async (productId: string) => {
        if (!user) return;
        try {
            await api.post('/wishlist/toggle', { productId });
            // Optimized update: fetch again or update locally
            // Fetching again ensures we have the populated object if it's a new add
            await fetchWishlist();
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((p: any) => (p._id || p) === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistCount: wishlist.length,
            toggleWishlist,
            isInWishlist,
            loading,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
