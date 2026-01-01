import { useContext, useState, useEffect } from 'react';
import { api } from '../api/api';
import { getImageUrl } from '../utils/imageUrl';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import {
    FaHeart, 
    FaTrash, 
    FaShoppingCart, 
    FaChevronRight,
    FaRegHeart, 
    FaStar, 
    FaEye,
    FaCheckCircle, 
    FaPlus, 
    FaFilter,
    FaChartLine, 
    FaBusinessTime,
    FaClipboardCheck, 
    FaFileInvoiceDollar, 
    FaShareAlt,
    FaTimes,
    FaFacebook,
    FaWhatsapp,
    FaLink,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const cart = useContext(CartContext)!;
    const { wishlist, loading, toggleWishlist, fetchWishlist } = useContext(WishlistContext)!;
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'date' | 'price-high-low' | 'price-low-high' | 'name-a-z' | 'name-z-a'>('date');
    const [shareProduct, setShareProduct] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    // const [isMobile, setIsMobile] = useState(false);

    // Check for mobile screen size
    // useEffect(() => {
    //     const checkMobile = () => {
    //         setIsMobile(window.innerWidth < 768);
    //     };
        
    //     checkMobile();
    //     window.addEventListener('resize', checkMobile);
        
    //     return () => {
    //         window.removeEventListener('resize', checkMobile);
    //     };
    // }, []);

    // ✅ FIX: Scroll to top when component mounts
    useEffect(() => {
        // Scroll to top on initial load
        window.scrollTo(0, 0);
        
        // Also handle browser back/forward navigation
        const handlePopState = () => {
            window.scrollTo(0, 0);
        };
        
        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // ✅ FIX: Additional scroll for smoother experience
    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const removeItem = async (productId: string) => {
        await toggleWishlist(productId);
    };

    const clearAll = async () => {
        try {
            await api.delete('/wishlist/clear');
            await fetchWishlist();
            setSelectedItems([]);
        } catch (error) {
            console.error("Failed to clear wishlist", error);
        }
    };

    const addAllToCart = () => {
        wishlist?.forEach(product => {
            if (product) cart.addToCart(product);
        });
    };

    const toggleSelectItem = (productId: string) => {
        setSelectedItems(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const selectAll = () => {
        if (selectedItems.length === wishlist?.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(wishlist?.map(p => p?._id).filter(Boolean) as string[]);
        }
    };

    const handleShareClick = (product: any) => {
        setShareProduct(product);
        setCopied(false);
    };

    const closeShareModal = () => {
        setShareProduct(null);
    };

    const copyToClipboard = () => {
        const productUrl = `${window.location.origin}/products/${shareProduct?._id}`;
        navigator.clipboard.writeText(productUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

    const shareOnSocialMedia = (platform: string) => {
        const productUrl = `${window.location.origin}/products/${shareProduct?._id}`;
        const productName = shareProduct?.name || 'Check out this product';
        const text = `Check out "${productName}" on our store!`;

        let url = '';
        
        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + productUrl)}`;
                break;
            default:
                return;
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-[#e67e00] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaHeart className="text-[#e67e00] animate-pulse text-xl" />
                    </div>
                </div>
                <p className="mt-6 text-gray-600 font-medium text-center">Loading your corporate wishlist...</p>
                <p className="text-sm text-gray-500 mt-2 text-center">Preparing detailed product analysis</p>
            </div>
        );
    }

    const products = wishlist || [];
    
    // Sorting function
    const sortedProducts = [...products].sort((a, b) => {
        if (!a || !b) return 0;
        switch (sortBy) {
            case 'price-high-low':
                return b.price - a.price;
            case 'price-low-high':
                return a.price - b.price;
            case 'name-a-z':
                return a.name.localeCompare(b.name);
            case 'name-z-a':
                return b.name.localeCompare(a.name);
            default: // 'date' or any other
                return 0;
        }
    });

    const selectedTotal = selectedItems.reduce((total, id) => {
        const product = products.find(p => p?._id === id);
        return total + (product?.price || 0);
    }, 0);

    const selectedSavings = selectedItems.reduce((total, id) => {
        const product = products.find(p => p?._id === id);
        const discount = product?.discount || 0;
        return total + (product?.price * discount / 100 || 0);
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Share Modal - Mobile Responsive */}
            {shareProduct && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <div className="flex justify-end p-4 sticky top-0 bg-white z-10">
                            <button
                                onClick={closeShareModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close share modal"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Title - Centered */}
                        <div className="px-4 sm:px-6 pt-0 pb-6 text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Share Via:</h3>
                            <div className="text-lg font-semibold text-gray-800 mb-1 truncate px-4">
                                {shareProduct.name || 'Magnetic Silicone Case'}
                            </div>
                            <p className="text-sm text-gray-500">Click icons to share</p>
                        </div>

                        {/* Social Media Icons Grid */}
                        <div className="px-4 sm:px-8 pb-8">
                            <div className="flex justify-center gap-4 sm:gap-6 mb-8 flex-wrap">
                                {/* Facebook */}
                                <button
                                    onClick={() => shareOnSocialMedia('facebook')}
                                    className="flex flex-col items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-all"
                                    aria-label="Share on Facebook"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1877F2] rounded-full flex items-center justify-center mb-2">
                                        <FaFacebook className="text-white text-xl sm:text-2xl" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">Facebook</span>
                                </button>
                                
                                {/* WhatsApp */}
                                <button
                                    onClick={() => shareOnSocialMedia('whatsapp')}
                                    className="flex flex-col items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-all"
                                    aria-label="Share on WhatsApp"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full flex items-center justify-center mb-2">
                                        <FaWhatsapp className="text-white text-xl sm:text-2xl" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">WhatsApp</span>
                                </button>
                                
                                {/* Copy URL */}
                                <button
                                    onClick={copyToClipboard}
                                    className="flex flex-col items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-all"
                                    aria-label="Copy product URL"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                        {copied ? (
                                            <FaCheckCircle className="text-white text-xl sm:text-2xl" />
                                        ) : (
                                            <FaLink className="text-white text-xl sm:text-2xl" />
                                        )}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                        {copied ? 'Copied!' : 'Copy URL'}
                                    </span>
                                </button>
                            </div>

                            {/* Copy Link Section */}
                            {/* <div className="border-t border-gray-200 pt-4">
                                <div className="text-xs sm:text-sm text-gray-600 mb-2">Or copy link:</div>
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${window.location.origin}/products/${shareProduct._id}`}
                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded bg-gray-50 truncate"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full sm:w-auto px-3 py-2 bg-gray-800 text-white text-xs sm:text-sm rounded hover:bg-gray-900 transition-colors whitespace-nowrap"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            )}

            {/* Enterprise Header - Mobile Responsive */}
            <div className="bg-gradient-to-r from-[#e67e00] via-[#e67e00] to-[#e67e00] border-b border-[#e67e00]/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                                    <FaHeart className="text-white text-lg sm:text-2xl" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                    {products.length}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                                    Corporate Wishlist
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#FCFAF9FF]">
                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                        <FaClipboardCheck className="hidden sm:inline" />
                                        Professional Procurement
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                        <FaFileInvoiceDollar className="hidden sm:inline" />
                                        Budget Management
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                        <FaBusinessTime className="hidden sm:inline" />
                                        Team Collaboration
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-normal">
                            <div className="text-right">
                                <div className="text-xs text-[#FFFDFAFF] uppercase tracking-wider">WISHLIST VALUE</div>
                                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                    ${products.reduce((sum, p) => sum + (p?.price || 0), 0).toLocaleString()}
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/20 hidden sm:block"></div>
                            <Link 
                                to="/products" 
                                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 flex items-center gap-2 text-xs sm:text-sm font-medium whitespace-nowrap"
                            >
                                <FaPlus className="text-xs" />
                                <span className="hidden sm:inline">Add More</span>
                                <span className="sm:hidden">Add</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Panel */}
            {products.length > 0 && (
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === products.length}
                                        onChange={selectAll}
                                        className="w-4 h-4 text-[#e67e00] border-gray-300 rounded focus:ring-[#e67e00]"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Select All ({selectedItems.length}/{products.length})
                                    </span>
                                </div>
                                
                                {selectedItems.length > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e67e00]/10 rounded-lg">
                                        <span className="text-sm font-medium text-[#e67e00]">
                                            Selected: ${selectedTotal.toLocaleString()}
                                        </span>
                                        {selectedSavings > 0 && (
                                            <span className="text-sm font-medium text-green-600">
                                                Save ${selectedSavings.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mt-3 sm:mt-0">
                                <div className="flex items-center gap-2">
                                    <FaFilter className="text-gray-500 hidden sm:block" />
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="border-0 bg-transparent text-sm font-medium text-gray-700 focus:ring-0 w-full sm:w-auto"
                                    >
                                        <option value="date">Date Added</option>
                                        <option value="price-high-low">Price: High to Low</option>
                                        <option value="price-low-high">Price: Low to High</option>
                                        <option value="name-a-z">Product Name: A to Z</option>
                                        <option value="name-z-a">Product Name: Z to A</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#e67e00]' : 'text-gray-600'}`}
                                    >
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#e67e00]' : 'text-gray-600'}`}
                                    >
                                        List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-16">
                {products.length === 0 ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 md:p-12 text-center">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#e67e00]/10 to-[#e67e00]/20 rounded-full"></div>
                                    <FaRegHeart className="absolute inset-0 m-auto text-[#e67e00]/40 text-3xl sm:text-5xl" />
                                    <div className="absolute -inset-2 sm:-inset-4 border-2 border-[#e67e00]/10 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                Professional Wishlist Empty
                            </h3>
                            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                                Your corporate procurement list is currently empty. Start building your professional collection by saving products for team review.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                <Link 
                                    to="/products" 
                                    className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-[#e67e00] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-[#d47300] transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    <FaShoppingCart className="text-base sm:text-lg" />
                                    Browse Products Catalog
                                    <FaChevronRight className="text-xs sm:text-sm" />
                                </Link>
                                <Link 
                                    to="/" 
                                    className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-300 shadow-sm text-sm sm:text-base"
                                >
                                    <FaChartLine />
                                    View Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {sortedProducts.filter((p: any) => p !== null).map((product: any) => (
                            <div key={product._id} className="bg-white rounded-xl border border-gray-200 hover:border-[#e67e00]/50 transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="p-4 sm:p-6">
                                    {/* Header with Checkbox and Category */}
                                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                                        <div className="flex items-start gap-2 sm:gap-3 max-w-[80%]">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(product._id)}
                                                onChange={() => toggleSelectItem(product._id)}
                                                className="mt-1 w-4 h-4 text-[#e67e00] border-gray-300 rounded focus:ring-[#e67e00] flex-shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <div className="text-xs font-semibold text-[#e67e00] uppercase tracking-wider mb-1 truncate">
                                                    {product.category?.name || 'PRODUCT'}
                                                </div>
                                                <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">
                                                    {product.name}
                                                </h4>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(product._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                                            title="Remove from list"
                                            aria-label="Remove from wishlist"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </div>

                                    {/* Product Image */}
                                    <Link to={`/products/${product._id}`}>
                                        <div className="relative h-40 sm:h-48 md:h-56 bg-gray-50 rounded-lg overflow-hidden mb-4 sm:mb-5 group">
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </Link>

                                    {/* Product Name Below Image */}
                                    <div className="mb-4 sm:mb-5">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-1 mb-2 sm:mb-3">
                                            <FaStar className="text-yellow-400 text-sm sm:text-base" />
                                            <span className="font-semibold text-gray-700 text-sm sm:text-base">{product.rating || '4.5'}</span>
                                            <span className="text-gray-400 mx-1 hidden sm:inline">|</span>
                                            <span className="text-gray-500 text-xs sm:text-sm hidden sm:inline">★★★★★</span>
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs sm:text-sm text-gray-500">Stock</div>
                                            <div className="text-xs sm:text-sm font-medium text-green-600">In Stock</div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4 sm:mb-5">
                                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                                            ${product.price.toLocaleString()}
                                        </div>
                                        {product.discount > 0 && (
                                            <div className="text-xs sm:text-sm text-gray-500">
                                                <span className="line-through mr-2">
                                                    ${(product.price / (1 - product.discount / 100)).toLocaleString()}
                                                </span>
                                                <span className="text-red-600 font-semibold">
                                                    Save {product.discount}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button - Centered */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => cart.addToCart(product)}
                                            className="flex-1 bg-[#e67e00] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#d47300] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                        >
                                            <FaShoppingCart className="text-sm" />
                                            <span className="hidden sm:inline">Add to Cart</span>
                                            <span className="sm:hidden">Add</span>
                                        </button>
                                        <button 
                                            onClick={() => handleShareClick(product)}
                                            className="px-3 py-2.5 sm:px-3 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
                                            title="Share this product"
                                            aria-label="Share product"
                                        >
                                            <FaShareAlt className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // ✅ FIXED: Mobile-friendly list view
                    <>
                        {/* Desktop Table View - Hidden on Mobile */}
                        <div className="hidden sm:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-4 px-4 sm:px-6 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.length === products.length}
                                                    onChange={selectAll}
                                                    className="w-4 h-4 text-[#e67e00] border-gray-300 rounded focus:ring-[#e67e00]"
                                                />
                                            </th>
                                            <th className="py-4 px-4 sm:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                                            <th className="py-4 px-4 sm:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                                            <th className="py-4 px-4 sm:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Unit Price</th>
                                            <th className="py-4 px-4 sm:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="py-4 px-4 sm:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedProducts.filter((p: any) => p !== null).map((product: any, index: number) => (
                                            <tr key={product._id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[#e67e00]/5`}>
                                                <td className="py-4 px-4 sm:px-6">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(product._id)}
                                                        onChange={() => toggleSelectItem(product._id)}
                                                        className="w-4 h-4 text-[#e67e00] border-gray-300 rounded focus:ring-[#e67e00]"
                                                    />
                                                </td>
                                                <td className="py-4 px-4 sm:px-6">
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={getImageUrl(product.image)}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.name}</div>
                                                            
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <FaStar className="text-yellow-400 text-xs" />
                                                                <span className="text-xs sm:text-sm">{product.rating || '4.5'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 sm:px-6">
                                                    <div className="text-sm font-medium text-gray-900 truncate">{product.category?.name}</div>
                                                    <div className="text-xs text-gray-500 hidden sm:block">Primary Category</div>
                                                </td>
                                                <td className="py-4 px-4 sm:px-6">
                                                    <div className="text-base sm:text-lg font-bold text-gray-900">${product.price.toLocaleString()}</div>
                                                    {product.discount > 0 && (
                                                        <div className="text-xs sm:text-sm text-red-600">
                                                            Save {product.discount}%
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 sm:px-6">
                                                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                        <FaCheckCircle className="mr-1 hidden sm:inline" />
                                                        Available
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 sm:px-6">
                                                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                        <button
                                                            onClick={() => cart.addToCart(product)}
                                                            className="px-2 sm:px-3 py-1 bg-[#e67e00] text-white text-xs sm:text-sm font-medium rounded hover:bg-[#d47300] transition-colors flex items-center gap-1"
                                                        >
                                                            <FaShoppingCart className="text-xs" />
                                                            <span className="hidden sm:inline">Cart</span>
                                                        </button>
                                                        <Link
                                                            to={`/products/${product._id}`}
                                                            className="px-2 sm:px-3 py-1 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                                                        >
                                                            <FaEye className="text-xs" />
                                                            <span className="hidden sm:inline">View</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleShareClick(product)}
                                                            className="px-2 sm:px-3 py-1 border border-blue-300 text-blue-600 text-xs sm:text-sm font-medium rounded hover:bg-blue-50 transition-colors"
                                                            title="Share"
                                                            aria-label="Share product"
                                                        >
                                                            <FaShareAlt className="text-xs" />
                                                        </button>
                                                        <button
                                                            onClick={() => removeItem(product._id)}
                                                            className="px-2 sm:px-3 py-1 border border-red-300 text-red-600 text-xs sm:text-sm font-medium rounded hover:bg-red-50 transition-colors"
                                                            aria-label="Remove from wishlist"
                                                        >
                                                            <FaTrash className="text-xs" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile List View - Hidden on Desktop */}
                        <div className="sm:hidden space-y-3">
                            {sortedProducts.filter((p: any) => p !== null).map((product: any) => (
                                <div key={product._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(product._id)}
                                                onChange={() => toggleSelectItem(product._id)}
                                                className="mt-1 w-4 h-4 text-[#e67e00] border-gray-300 rounded focus:ring-[#e67e00] flex-shrink-0"
                                            />
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={getImageUrl(product.image)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-semibold text-[#e67e00] uppercase tracking-wider mb-1">
                                                        {product.category?.name || 'PRODUCT'}
                                                    </div>
                                                    <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <FaStar className="text-yellow-400 text-xs" />
                                                        <span className="text-xs font-semibold text-gray-700">{product.rating || '4.5'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">${product.price.toLocaleString()}</div>
                                            {product.discount > 0 && (
                                                <div className="text-xs text-red-600">
                                                    Save {product.discount}%
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => cart.addToCart(product)}
                                                className="px-3 py-2 bg-[#e67e00] text-white text-xs font-medium rounded hover:bg-[#d47300] transition-colors flex items-center gap-1"
                                            >
                                                <FaShoppingCart className="text-xs" />
                                                <span>Cart</span>
                                            </button>
                                            <button
                                                onClick={() => handleShareClick(product)}
                                                className="px-3 py-2 border border-blue-300 text-blue-600 text-xs font-medium rounded hover:bg-blue-50 transition-colors"
                                                title="Share"
                                                aria-label="Share product"
                                            >
                                                <FaShareAlt className="text-xs" />
                                            </button>
                                            <button
                                                onClick={() => removeItem(product._id)}
                                                className="px-3 py-2 border border-red-300 text-red-600 text-xs font-medium rounded hover:bg-red-50 transition-colors"
                                                aria-label="Remove from wishlist"
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Procurement Summary Section */}
                {products.length > 0 && (
                    <div className="mt-8 sm:mt-12">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Procurement Summary</h3>
                                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Review and manage your selected items.</p>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <button
                                        onClick={addAllToCart}
                                        disabled={selectedItems.length === 0}
                                        className={`px-4 sm:px-5 py-2.5 sm:py-3 bg-[#e67e00] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#d47300] transition-colors flex items-center justify-center gap-2 ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FaShoppingCart className="text-xs sm:text-sm" />
                                        Add Selected to Cart (${selectedItems.length === 0 ? '0' : selectedTotal.toLocaleString()})
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaTrash className="text-xs sm:text-sm" />
                                        Clear Entire Wishlist
                                    </button>
                                </div>
                                
                                {/* Divider Line */}
                                <hr className="my-4 sm:my-6 border-gray-300" />
                                
                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Selected Items</div>
                                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{selectedItems.length}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Total Value</div>
                                        <div className="text-xl sm:text-2xl font-bold text-gray-900">${selectedTotal.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}