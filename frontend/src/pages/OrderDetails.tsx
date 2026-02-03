/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { getImageUrl } from '../utils/imageUrl';
import {
    FaBox, FaChevronLeft, FaChevronRight,
    FaPhoneAlt, FaCreditCard,
    FaExclamationCircle, FaReceipt, FaTruck,
    FaCheckCircle, FaClock, FaShareAlt,
    FaCopy, FaShoppingBag, FaCalendarAlt,
    FaUser, FaHome, FaCreditCard as FaCard,
    FaWhatsapp, FaFacebook, FaLink, FaStar
} from 'react-icons/fa';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [reviewingItem, setReviewingItem] = useState<any>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    // ✅ FIXED: Function to get the correct image for order item
    // ✅ FIXED: Function to get the correct image for order item
    // ✅ UPDATED: Function to get the correct image for order item with debugging
    const getItemImage = (item: any): string => {
        try {
            if (!item || !item.product) {
                console.log('No item or product found:', item);
                return '/placeholder.png';
            }

            // Debug log to see what data we have
            console.log('Order Item Data:', {
                itemId: item._id || item.product?._id,
                productName: item.product?.name,
                color: item.color,
                selectedImageIndex: item.selectedImageIndex,
                variationId: item.variationId,
                hasProductImage: !!item.product.image,
                hasVariations: !!item.product.variations,
                variationsCount: item.product.variations?.length,
                colorVariantsCount: item.product.colorVariants?.length
            });

            // 1️⃣ Check if selectedImageIndex exists (most important)
            if (item.selectedImageIndex !== undefined && item.selectedImageIndex !== null) {
                console.log(`Found selectedImageIndex: ${item.selectedImageIndex} for color: ${item.color}`);

                // Try to find the correct variation
                let targetVariation = null;

                // First, try by variationId if it exists
                if (item.variationId && item.product.variations && Array.isArray(item.product.variations)) {
                    targetVariation = item.product.variations.find((v: any) => v._id === item.variationId);
                    console.log('Looking for variation by variationId:', item.variationId, 'Found:', !!targetVariation);
                }

                // If not found by variationId, try by color
                if (!targetVariation && item.color && item.product.variations && Array.isArray(item.product.variations)) {
                    targetVariation = item.product.variations.find((v: any) =>
                        v.color === item.color ||
                        v.colorName === item.color ||
                        (v.colorCode && v.colorCode === item.colorCode)
                    );
                    console.log('Looking for variation by color:', item.color, 'Found:', !!targetVariation);
                }

                // If found variation, get the specific image
                if (targetVariation) {
                    const images = targetVariation.images || (targetVariation.image ? [targetVariation.image] : []);
                    console.log(`Variation has ${images.length} images`);

                    if (images.length > 0) {
                        const index = Math.min(item.selectedImageIndex, images.length - 1);
                        const selectedImage = images[index] || images[0];
                        console.log(`Using image at index ${index}: ${selectedImage}`);
                        return selectedImage;
                    }
                }

                // Try colorVariants as fallback
                if (item.color && item.product.colorVariants && Array.isArray(item.product.colorVariants)) {
                    const colorVariant = item.product.colorVariants.find((v: any) =>
                        v.colorName === item.color ||
                        v.color === item.color
                    );
                    if (colorVariant?.images?.length) {
                        const index = Math.min(item.selectedImageIndex, colorVariant.images.length - 1);
                        return colorVariant.images[index] || colorVariant.images[0];
                    }
                }
            }

            // 2️⃣ Fallback: Check if selectedImage is stored directly
            if (item.selectedImage) {
                console.log('Using directly stored selectedImage:', item.selectedImage);
                return item.selectedImage;
            }

            // 3️⃣ Fallback: Try to get first variation image based on color
            if (item.color && item.product.variations && Array.isArray(item.product.variations)) {
                const colorVariation = item.product.variations.find((v: any) =>
                    v.color === item.color ||
                    v.colorName === item.color
                );
                if (colorVariation) {
                    const images = colorVariation.images || (colorVariation.image ? [colorVariation.image] : []);
                    if (images.length > 0) {
                        console.log(`Using first image from color variation: ${images[0]}`);
                        return images[0];
                    }
                }
            }

            // 4️⃣ Fallback: Try colorVariants
            if (item.color && item.product.colorVariants && Array.isArray(item.product.colorVariants)) {
                const colorVariant = item.product.colorVariants.find((v: any) =>
                    v.colorName === item.color ||
                    v.color === item.color
                );
                if (colorVariant?.images?.length) {
                    console.log(`Using first image from color variant: ${colorVariant.images[0]}`);
                    return colorVariant.images[0];
                }
            }

            // 5️⃣ Fallback: Use product image
            if (item.product.image) {
                console.log('Using product image:', item.product.image);
                return item.product.image;
            }

            // 6️⃣ Ultimate fallback
            console.log('No image found, using placeholder');
            return '/placeholder.png';
        } catch (err) {
            console.error('Error getting item image:', err, item);
            return '/placeholder.png';
        }
    };

    // ✅ Function to get color code for order item
    const getItemColorCode = (item: any) => {
        if (item.colorCode) return item.colorCode;

        if (item.product.variations && item.variationId && item.product.variations.length > 0) {
            const variation = item.product.variations.find((v: any) => v._id === item.variationId);
            if (variation && variation.colorCode) {
                return variation.colorCode;
            }
        }

        return '#000000';
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <FaClock className="text-amber-600" /> },
            processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <FaBox className="text-blue-600" /> },
            shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: <FaTruck className="text-indigo-600" /> },
            delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <FaCheckCircle className="text-emerald-600" /> },
            cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <FaExclamationCircle className="text-red-600" /> },
        };
        return colors[status as keyof typeof colors] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: <FaBox className="text-gray-600" /> };
    };

    const getStatusSteps = (status: string) => {
        const steps = [
            { id: 1, name: 'Order Placed', status: 'completed', icon: <FaShoppingBag className="text-xs" /> },
            { id: 2, name: 'Payment Confirmed', status: order?.paymentStatus === 'paid' ? 'completed' : 'pending', icon: <FaCreditCard className="text-xs" /> },
            { id: 3, name: 'Processing', status: ['processing', 'shipped', 'delivered'].includes(status) ? 'completed' : 'pending', icon: <FaBox className="text-xs" /> },
            { id: 4, name: 'Shipped', status: ['shipped', 'delivered'].includes(status) ? 'completed' : 'pending', icon: <FaTruck className="text-xs" /> },
            { id: 5, name: 'Delivered', status: status === 'delivered' ? 'completed' : 'pending', icon: <FaCheckCircle className="text-xs" /> },
        ];
        return steps;
    };

    const copyOrderId = () => {
        navigator.clipboard.writeText(order?._id || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnWhatsApp = () => {
        const message = `Check out my order #${order?._id?.slice(-8).toUpperCase()}\nStatus: ${order?.status}\nTotal: $${order?.totalAmount?.toLocaleString()}\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        setShowShareModal(false);
    };

    const shareOnFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        setShowShareModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-amber-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-200">
                    <FaExclamationCircle className="text-4xl text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    We couldn't find the order you're looking for. It may have been deleted or the link is incorrect.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const statusColor = getStatusColor(order.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Simple Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Share Via:</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-center gap-6">
                                <button
                                    onClick={shareOnWhatsApp}
                                    className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors"
                                    title="Share on WhatsApp"
                                >
                                    <FaWhatsapp className="text-2xl text-emerald-600" />
                                </button>

                                <button
                                    onClick={shareOnFacebook}
                                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                                    title="Share on Facebook"
                                >
                                    <FaFacebook className="text-2xl text-blue-600" />
                                </button>

                                <button
                                    onClick={copyLink}
                                    className={`p-3 rounded-full transition-colors ${copied ? 'bg-emerald-100' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    title={copied ? 'Link Copied!' : 'Copy URL'}
                                >
                                    <FaLink className={`text-2xl ${copied ? 'text-emerald-600' : 'text-gray-600'}`} />
                                </button>
                            </div>

                            {/* Order info */}
                            <div className="pt-4 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-600 mb-1">
                                    Order #{order?._id?.slice(-8).toUpperCase()}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {copied ? '✓ Link copied to clipboard' : 'Click icons to share'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 sm:p-3 hover:bg-amber-50 rounded-xl transition-all group mt-1"
                            >
                                <FaChevronLeft className="text-gray-600 group-hover:text-amber-600 text-sm sm:text-base" />
                            </button>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order Details</h1>
                                    <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border ${statusColor.bg} ${statusColor.text} ${statusColor.border} flex items-center gap-2 w-fit`}>
                                        {statusColor.icon}
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-400 text-xs" />
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <button
                                        onClick={copyOrderId}
                                        className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2 transition-colors w-fit"
                                    >
                                        <FaCopy className="text-xs" />
                                        {copied ? 'Copied!' : 'Copy ID'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-2 sm:mt-0">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
                            >
                                <FaShareAlt className="text-sm" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - Order Items & Summary */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Order Progress - FIXED FOR MOBILE */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
                                <div className="p-2 sm:p-2.5 bg-amber-100 rounded-lg">
                                    <FaTruck className="text-amber-600 text-sm sm:text-base" />
                                </div>
                                Order Progress
                            </h2>

                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute left-0 right-0 top-4 sm:top-8 h-1 bg-gray-200">
                                    <div
                                        className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                                        style={{
                                            width: order.status === 'pending' ? '20%' :
                                                order.status === 'processing' ? '40%' :
                                                    order.status === 'shipped' ? '80%' : '100%'
                                        }}
                                    ></div>
                                </div>

                                {/* Steps - Responsive for mobile without scrolling */}
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start">
                                        {getStatusSteps(order.status).map((step) => (
                                            <div key={step.id} className="flex flex-col items-center w-1/5 px-1 sm:px-0">
                                                <div className={`w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 border-3 sm:border-4 transition-all duration-300 ${step.status === 'completed'
                                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-600'
                                                    : 'bg-white border-gray-300 text-gray-400'
                                                    }`}>
                                                    {step.icon}
                                                </div>
                                                <div className="text-center w-full">
                                                    <p className={`text-[9px] xs:text-[10px] sm:text-xs font-medium ${step.status === 'completed' ? 'text-emerald-700' : 'text-gray-500'} leading-tight`}>
                                                        {step.name}
                                                    </p>
                                                    <p className="text-[8px] xs:text-[9px] sm:text-xs text-gray-400 mt-0.5">Step {step.id}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="p-2 sm:p-2.5 bg-blue-100 rounded-lg">
                                        <FaShoppingBag className="text-blue-600 text-sm sm:text-base" />
                                    </div>
                                    Order Items ({order.items.length})
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.items.map((item: any, idx: number) => {
                                    const itemColorCode = getItemColorCode(item);

                                    return (
                                        <div key={idx} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex gap-4 sm:gap-6">
                                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 p-2 sm:p-3 flex-shrink-0">
                                                    <img
                                                        src={getImageUrl(getItemImage(item))}
                                                        className="w-full h-full object-contain"
                                                        alt={item.product?.name || 'Product Image'}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2 truncate">
                                                                {item.product?.name || 'Unknown Product'}
                                                            </h3>
                                                            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span className="hidden sm:inline">•</span>
                                                                <span className="text-xs sm:text-sm">${item.price.toLocaleString()} each</span>
                                                            </div>
                                                            {/* Display selected color if available */}
                                                            {item.color && (
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs text-gray-500">Color:</span>
                                                                    <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                                                                        <div
                                                                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300 shadow-sm"
                                                                            style={{ backgroundColor: itemColorCode }}
                                                                        />
                                                                        <span className="text-xs font-medium text-gray-700">{item.color}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {/* Display selected size/weight if available */}
                                                            {(item.selectedSize || item.selectedWeight) && (
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs text-gray-500">{item.selectedSize ? 'Size:' : 'Weight:'}</span>
                                                                    <div className="bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                                                                        <span className="text-xs font-medium text-indigo-700">{item.selectedSize || item.selectedWeight}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-base sm:text-lg font-bold text-gray-900">
                                                                ${(item.price * item.quantity).toLocaleString()}
                                                            </div>
                                                            <div className="text-xs sm:text-sm text-gray-500 sm:hidden">
                                                                ${item.price.toLocaleString()} each
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {item.status && (
                                                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(item.status).bg} ${getStatusColor(item.status).text} ${getStatusColor(item.status).border} w-fit`}>
                                                                {getStatusColor(item.status).icon}
                                                                {item.status}
                                                            </span>

                                                            {order.status === 'delivered' && (
                                                                <button
                                                                    onClick={() => setReviewingItem(item)}
                                                                    className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-all border border-amber-200 w-full sm:w-auto"
                                                                >
                                                                    <FaStar className="text-amber-500 text-xs" />
                                                                    Write a Review
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary & Details */}
                    <div className="space-y-6 sm:space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
                                <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-lg">
                                    <FaReceipt className="text-emerald-600 text-sm sm:text-base" />
                                </div>
                                Order Summary
                            </h2>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                                        ${(order.totalAmount - (order.shippingFee || 0)).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600 text-sm sm:text-base">Shipping</span>
                                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                                        ${(order.shippingFee || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-200">
                                    <span className="text-base sm:text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-xl sm:text-2xl font-bold text-amber-700">
                                        ${order.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
                                <div className="p-2 sm:p-2.5 bg-blue-100 rounded-lg">
                                    <FaUser className="text-blue-600 text-sm sm:text-base" />
                                </div>
                                Customer Information
                            </h2>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 bg-amber-50 rounded-lg">
                                        <FaUser className="text-amber-600 text-sm" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Customer Name</p>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">{order.shippingAddress.name}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 bg-amber-50 rounded-lg">
                                        <FaHome className="text-amber-600 text-sm" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Shipping Address</p>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base leading-tight break-words">
                                            {order.shippingAddress.address}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 bg-amber-50 rounded-lg">
                                        <FaPhoneAlt className="text-amber-600 text-sm" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Phone Number</p>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">{order.shippingAddress.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
                                <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-lg">
                                    <FaCard className="text-emerald-600 text-sm sm:text-base" />
                                </div>
                                Payment Information
                            </h2>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm sm:text-base">Payment Method</span>
                                    <span className="font-medium text-gray-900 text-sm sm:text-base">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm sm:text-base">Payment Status</span>
                                    <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${order.paymentStatus === 'paid'
                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}>
                                        {order.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm sm:text-base">Transaction ID</span>
                                    <span className="font-mono text-xs sm:text-sm text-gray-900 truncate max-w-[100px] sm:max-w-none">{order._id.slice(-12)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewingItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-white mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Write a Review</h3>
                            <button
                                onClick={() => setReviewingItem(null)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100">
                                <img src={getImageUrl(getItemImage(reviewingItem))} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" alt="" />
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 text-sm line-clamp-1">{reviewingItem.product?.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Your Rating</label>
                                <div className="flex justify-center gap-2 sm:gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <FaStar className={`text-2xl sm:text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent!'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Feedback</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your honest experience with this product..."
                                    className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm resize-none"
                                />
                            </div>

                            <button
                                onClick={async () => {
                                    if (!comment.trim()) return alert("Please write a comment");
                                    setSubmittingReview(true);
                                    try {
                                        await api.post('/reviews', {
                                            productId: reviewingItem.product?._id || reviewingItem.product?.id,
                                            orderId: order._id,
                                            rating,
                                            comment
                                        });
                                        alert("Review submitted successfully!");
                                        setReviewingItem(null);
                                        setComment('');
                                        setRating(5);
                                    } catch (err: any) {
                                        alert(err.response?.data?.message || "Failed to submit review");
                                    } finally {
                                        setSubmittingReview(false);
                                    }
                                }}
                                disabled={submittingReview}
                                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold sm:font-black shadow-lg shadow-amber-600/20 active:scale-95 transition-all text-base sm:text-lg disabled:opacity-50"
                            >
                                {submittingReview ? 'Submitting...' : 'Post Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <div className="bg-white border-t border-gray-200 py-4 sm:py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-center sm:text-left order-2 sm:order-1">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Order ID: <span className="font-mono text-gray-900 text-xs sm:text-sm">{order._id}</span>
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 order-1 sm:order-2 mb-2 sm:mb-0">
                            <button
                                onClick={() => navigate('/orders')}
                                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                View All Orders
                                <FaChevronRight className="text-xs" />
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                Continue Shopping
                                <FaShoppingBag className="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}