import { useContext, useState } from 'react';
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
    FaBox,
    FaPercentage,
    FaBusinessTime,
    FaClipboardCheck, 
    FaFileInvoiceDollar, 
    FaShareAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const cart = useContext(CartContext)!;
    const { wishlist, loading, toggleWishlist, fetchWishlist } = useContext(WishlistContext)!;
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'date' | 'price-high-low' | 'price-low-high' | 'name-a-z' | 'name-z-a'>('date');

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-[#e67e00] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaHeart className="text-[#e67e00] animate-pulse text-xl" />
                    </div>
                </div>
                <p className="mt-6 text-gray-600 font-medium">Loading your corporate wishlist...</p>
                <p className="text-sm text-gray-500 mt-2">Preparing detailed product analysis</p>
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
            {/* Enterprise Header */}
            <div className="bg-gradient-to-r from-[#e67e00] via-[#e67e00] to-[#e67e00] border-b border-[#e67e00]/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                                    <FaHeart className="text-white text-2xl" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                    {products.length}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    Corporate Wishlist
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-[#FCFAF9FF]">
                                    <span className="flex items-center gap-1">
                                        <FaClipboardCheck />
                                        Professional Procurement
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaFileInvoiceDollar />
                                        Budget Management
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaBusinessTime />
                                        Team Collaboration
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-xs text-[#FFFDFAFF] uppercase tracking-wider">WISHLIST VALUE</div>
                                <div className="text-2xl font-bold text-white">
                                    ${products.reduce((sum, p) => sum + (p?.price || 0), 0).toLocaleString()}
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/20"></div>
                            <Link 
                                to="/products" 
                                className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 flex items-center gap-2 text-sm font-medium"
                            >
                                <FaPlus className="text-xs" />
                                Add More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Executive Dashboard */}
            {/* <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-gray-500 text-sm font-medium">Total Items</div>
                            <FaBox className="text-[#e67e00]" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{products.length}</div>
                        <div className="text-xs text-gray-500 mt-2">Saved for procurement</div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-gray-500 text-sm font-medium">Total Value</div>
                            <FaChartLine className="text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            ${products.reduce((sum, p) => sum + (p?.price || 0), 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Current market price</div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-gray-500 text-sm font-medium">Potential Savings</div>
                            <FaPercentage className="text-red-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            ${products.reduce((sum, p) => {
                                const discount = p?.discount || 0;
                                return sum + (p?.price * discount / 100 || 0);
                            }, 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">With current discounts</div>
                    </div>
                </div>
            </div> */}

            {/* Control Panel */}
            {products.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
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
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <FaFilter className="text-gray-500" />
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="border-0 bg-transparent text-sm font-medium text-gray-700 focus:ring-0"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {products.length === 0 ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-12 text-center">
                            <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#e67e00]/10 to-[#e67e00]/20 rounded-full"></div>
                                    <FaRegHeart className="absolute inset-0 m-auto text-[#e67e00]/40 text-5xl" />
                                    <div className="absolute -inset-4 border-2 border-[#e67e00]/10 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Professional Wishlist Empty
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Your corporate procurement list is currently empty. Start building your professional collection by saving products for team review.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/products" 
                                    className="inline-flex items-center justify-center gap-3 bg-[#e67e00] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#d47300] transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <FaShoppingCart className="text-lg" />
                                    Browse Products Catalog
                                    <FaChevronRight className="text-sm" />
                                </Link>
                                <Link 
                                    to="/" 
                                    className="inline-flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-300 shadow-sm"
                                >
                                    <FaChartLine />
                                    View Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedProducts.filter((p: any) => p !== null).map((product: any) => (
                            <div key={product._id} className="bg-white rounded-xl border border-gray-200 hover:border-[#e67e00]/50 transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="p-6">
                                    {/* Header with Checkbox and Category */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(product._id)}
                                                onChange={() => toggleSelectItem(product._id)}
                                                className="mt-1 w-4 h-4 text-[#e67e00] border-gray-300 rounded focus:ring-[#e67e00]"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-[#e67e00] uppercase tracking-wider mb-1">
                                                    {product.category?.name || 'PRODUCT'}
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 leading-tight">
                                                    {product.name}
                                                </h4>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(product._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Remove from list"
                                        >
                                            <FaTrash className="text-sm" />
                                        </button>
                                    </div>

                                    {/* Product Image - Made larger */}
                                    <Link to={`/products/${product._id}`}>
                                        <div className="relative h-56 bg-gray-50 rounded-lg overflow-hidden mb-5 group">
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </Link>

                                    {/* Product Name Below Image */}
                                    <div className="mb-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-1 mb-3">
                                            <FaStar className="text-yellow-400" />
                                            <span className="font-semibold text-gray-700">{product.rating || '4.5'}</span>
                                            <span className="text-gray-400 mx-1">|</span>
                                            <span className="text-gray-500 text-sm">★★★★★</span>
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div className="space-y-3 mb-5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">Weight</div>
                                            <div className="text-sm font-medium text-gray-900">2.5 kg</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">Color</div>
                                            <div className="text-sm font-medium text-gray-900">Black/White</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">Dimensions</div>
                                            <div className="text-sm font-medium text-gray-900">30×20×15 cm</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">Stock</div>
                                            <div className="text-sm font-medium text-green-600">In Stock</div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-5">
                                        <div className="text-3xl font-bold text-gray-900 mb-2">
                                            ${product.price.toLocaleString()}
                                        </div>
                                        {product.discount > 0 && (
                                            <div className="text-sm text-gray-500">
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
                                            className="flex-1 bg-[#e67e00] text-white py-3 rounded-lg font-semibold hover:bg-[#d47300] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaShoppingCart />
                                            Add to Cart
                                        </button>
                                        <button className="px-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <FaShareAlt className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 px-6 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === products.length}
                                            onChange={selectAll}
                                            className="w-4 h-4 text-[#e67e00] border-gray-300 rounded focus:ring-[#e67e00]"
                                        />
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Unit Price</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedProducts.filter((p: any) => p !== null).map((product: any, index: number) => (
                                    <tr key={product._id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[#e67e00]/5`}>
                                        <td className="py-4 px-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(product._id)}
                                                onChange={() => toggleSelectItem(product._id)}
                                                className="w-4 h-4 text-[#e67e00] border-gray-300 rounded focus:ring-[#e67e00]"
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={getImageUrl(product.image)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{product.name}</div>
                                                    
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <FaStar className="text-yellow-400 text-xs" />
                                                        <span className="text-sm">{product.rating || '4.5'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-medium text-gray-900">{product.category?.name}</div>
                                            <div className="text-xs text-gray-500">Primary Category</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-lg font-bold text-gray-900">${product.price.toLocaleString()}</div>
                                            {product.discount > 0 && (
                                                <div className="text-sm text-red-600">
                                                    Save {product.discount}%
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                <FaCheckCircle className="mr-1" />
                                                Available
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => cart.addToCart(product)}
                                                    className="px-3 py-1.5 bg-[#e67e00] text-white text-sm font-medium rounded hover:bg-[#d47300] transition-colors flex items-center gap-1"
                                                >
                                                    <FaShoppingCart />
                                                    Cart
                                                </button>
                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                                                >
                                                    <FaEye />
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => removeItem(product._id)}
                                                    className="px-3 py-1.5 border border-red-300 text-red-600 text-sm font-medium rounded hover:bg-red-50 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Procurement Summary Section */}
                {products.length > 0 && (
                    <div className="mt-12">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Procurement Summary</h3>
                                <p className="text-gray-600 mb-6">Review and manage your selected items.</p>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <button
                                        onClick={addAllToCart}
                                        disabled={selectedItems.length === 0}
                                        className={`px-5 py-3 bg-[#e67e00] text-white text-sm font-medium rounded-lg hover:bg-[#d47300] transition-colors flex items-center gap-2 ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FaShoppingCart className="text-sm" />
                                        Add Selected to Cart (${selectedItems.length === 0 ? '0' : selectedTotal.toLocaleString()})
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="px-5 py-3 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                                    >
                                        <FaTrash className="text-sm" />
                                        Clear Entire Wishlist
                                    </button>
                                    {/* <Link
                                        to="/cart"
                                        className="px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                    >
                                        Proceed to Checkout
                                        <FaChevronRight className="text-xs" />
                                    </Link> */}
                                </div>
                                
                                {/* Divider Line */}
                                <hr className="my-6 border-gray-300" />
                                
                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-700 mb-1">Selected Items</div>
                                        <div className="text-2xl font-bold text-gray-900">{selectedItems.length}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-700 mb-1">Total Value</div>
                                        <div className="text-2xl font-bold text-gray-900">${selectedTotal.toLocaleString()}</div>
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