import { useContext } from 'react';
import { api } from '../api/api';
import { getImageUrl } from '../utils/imageUrl';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import {
    FaHeart, FaTrash, FaShoppingCart, FaChevronRight,
    FaRegHeart, FaGem, FaFire, FaCrown
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const cart = useContext(CartContext)!;
    const { wishlist, loading, toggleWishlist, fetchWishlist } = useContext(WishlistContext)!;

    const removeItem = async (productId: string) => {
        await toggleWishlist(productId);
    };

    const clearAll = async () => {
        try {
            await api.delete('/wishlist/clear');
            await fetchWishlist();
        } catch (error) {
            console.error("Failed to clear wishlist", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }


    const products = wishlist || [];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b py-8 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-xl shadow-sm">
                            <FaHeart />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
                            <p className="text-gray-500 font-medium">Items you've saved for later</p>
                        </div>
                    </div>
                    {products.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 font-bold text-sm"
                        >
                            <FaTrash />
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {products.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-red-50 text-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaRegHeart className="text-4xl" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Found something you like? Tap on the heart icon to save it here!</p>
                        <Link to="/products" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg shadow-gray-900/10">
                            Start Shopping
                            <FaChevronRight className="text-sm" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.filter((p: any) => p !== null).map((product: any) => (
                            <div key={product._id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 relative">
                                {/* Badge if any */}
                                {product.badge && (
                                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-gray-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {product.badge === 'New' && <FaGem className="text-amber-400" />}
                                        {product.badge === 'Sale' && <FaFire className="text-orange-400" />}
                                        {product.badge === 'Bestseller' && <FaCrown className="text-yellow-400" />}
                                        {product.badge}
                                    </div>
                                )}

                                <button
                                    onClick={() => removeItem(product._id)}
                                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    <FaTrash className="text-sm" />
                                </button>

                                <Link to={`/products/${product._id}`}>
                                    <div className="aspect-square bg-gray-50 p-6 overflow-hidden">
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                </Link>

                                <div className="p-6">
                                    <div className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">
                                        {product.category?.name || 'Category'}
                                    </div>
                                    <Link to={`/products/${product._id}`}>
                                        <h4 className="font-bold text-gray-900 mb-4 line-clamp-1 group-hover:text-amber-600 transition-colors">
                                            {product.name}
                                        </h4>
                                    </Link>

                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-xl font-black text-gray-900">
                                                $ {product.price.toLocaleString()}
                                            </div>
                                            {product.discount > 0 && (
                                                <div className="text-xs text-gray-400 line-through">
                                                    $ {(product.price / (1 - product.discount / 100)).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => cart.addToCart(product)}
                                            className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-amber-600 transition-all shadow-lg shadow-gray-900/20 active:scale-95"
                                        >
                                            <FaShoppingCart className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
