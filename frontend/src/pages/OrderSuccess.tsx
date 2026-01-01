import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaArrowRight, FaTruck, FaMapMarkerAlt, FaExclamationTriangle, FaCreditCard, FaBox, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useEffect, useState, useContext } from 'react';
import { api } from '../api/api';
import { CartContext } from '../contexts/CartContext';

export default function OrderSuccess() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [verifying, setVerifying] = useState(!!sessionId);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);
    const [redirectCountdown, setRedirectCountdown] = useState(15);
    const cart = useContext(CartContext)!;

    useEffect(() => {
        // Clear cart on entry
        cart.clearCart();

        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${orderId}`);
                setOrder(res.data);
            } catch (err) {
                console.error("Failed to fetch order details", err);
            }
        };

        if (sessionId && orderId) {
            api.post('/payments/verify-payment', { session_id: sessionId, orderId })
                .then(() => {
                    setVerifying(false);
                    fetchOrder();
                })
                .catch(() => {
                    setError("Payment verification failed. Please contact support.");
                    setVerifying(false);
                });
        } else if (orderId) {
            fetchOrder();
        }
    }, [sessionId, orderId]);

    // Countdown timer for redirect
    useEffect(() => {
        if (!verifying && !error && orderId) {
            if (redirectCountdown > 0) {
                const timer = setTimeout(() => setRedirectCountdown(redirectCountdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                navigate(`/orders/${orderId}`);
            }
        }
    }, [verifying, error, orderId, navigate, redirectCountdown]);

    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#d97706]/5 to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="relative mb-6 sm:mb-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#d97706]/20 rounded-full"></div>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#d97706] border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Processing Payment</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">We're verifying your payment details. This may take a moment.</p>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="h-1.5 sm:h-2 bg-[#d97706]/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#d97706] to-[#b45309] animate-progress"></div>
                        </div>
                        <p className="text-xs sm:text-sm text-[#d97706]">Please do not refresh or close this page</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#d97706]/5 to-white">
            {/* Header Navigation */}
            <div className="bg-white border-b border-[#d97706]/20">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#d97706] to-[#b45309] rounded-lg shadow-md">
                                <FaShoppingBag className="text-white text-base sm:text-lg" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Order Confirmation</h1>
                                <p className="text-xs sm:text-sm text-gray-500">Thank you for your purchase</p>
                            </div>
                        </div>
                        <Link 
                            to="/dashboard" 
                            className="text-xs sm:text-sm text-[#d97706] hover:text-[#b45309] font-medium hover:bg-[#d97706]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors self-end sm:self-center"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {/* Main Success Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-[#d97706]/20 overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-[#d97706] to-[#b45309] px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                                    <div className="text-white">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                            {error ? (
                                                <FaExclamationTriangle className="text-lg sm:text-xl md:text-2xl text-red-300" />
                                            ) : (
                                                <FaCheckCircle className="text-lg sm:text-xl md:text-2xl text-emerald-300" />
                                            )}
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                                                {error ? 'Payment Issue' : 'Order Confirmed!'}
                                            </h2>
                                        </div>
                                        <p className="text-xs sm:text-sm md:text-base text-white/90">
                                            {error ? 'We encountered an issue with your payment' : 'Your order has been successfully placed'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs sm:text-sm text-white/80 mb-0.5 sm:mb-1">Order ID</div>
                                        <div className="text-sm sm:text-base md:text-lg font-mono font-bold text-white">
                                            #{orderId?.slice(-8).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 sm:p-6 md:p-8">
                                {error ? (
                                    <div className="text-center py-4 sm:py-6 md:py-8">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-red-200">
                                            <FaExclamationTriangle className="text-lg sm:text-xl md:text-3xl text-red-500" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Payment Verification Failed</h3>
                                        <p className="text-sm text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto">
                                            {error} Please contact our support team for assistance.
                                        </p>
                                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                                            <Link 
                                                to="/support" 
                                                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-red-200 transition-all text-sm sm:text-base"
                                            >
                                                Contact Support
                                            </Link>
                                            <Link 
                                                to="/cart" 
                                                className="px-4 sm:px-6 py-2 sm:py-3 border border-[#d97706] text-[#d97706] rounded-lg font-medium hover:bg-[#d97706]/10 transition-colors text-sm sm:text-base"
                                            >
                                                Return to Cart
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                        {/* Success Message */}
                                        <div className="text-center py-3 sm:py-4 md:py-6">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-emerald-200 animate-pulse">
                                                <FaCheckCircle className="text-2xl sm:text-3xl md:text-4xl text-emerald-500" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Thank You for Your Order!</h3>
                                            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
                                                Your order has been received and is being processed. You'll receive a confirmation email shortly.
                                            </p>
                                        </div>

                                        {/* Order Summary */}
                                        {order && (
                                            <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-[#d97706]/20">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                                    <div className="text-center">
                                                        <div className="text-xs sm:text-sm text-[#d97706] mb-1 sm:mb-2">Total Amount</div>
                                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                                                            ${order.totalAmount.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs sm:text-sm text-[#d97706] mb-1 sm:mb-2">Payment Method</div>
                                                        <div className="font-medium text-gray-900 flex items-center justify-center gap-1 sm:gap-2">
                                                            <FaCreditCard className="text-[#d97706] text-sm sm:text-base" />
                                                            <span className="text-sm sm:text-base">{order.paymentMethod || 'Credit Card'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs sm:text-sm text-[#d97706] mb-1 sm:mb-2">Order Status</div>
                                                        <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs sm:text-sm font-medium inline-block">
                                                            Confirmed
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* What's Next */}
                                        <div className="border-t border-[#d97706]/20 pt-4 sm:pt-6 md:pt-8">
                                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">What Happens Next</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                                <div className="text-center p-3 sm:p-4 md:p-6 border border-[#d97706]/20 rounded-lg sm:rounded-xl hover:border-[#d97706] hover:shadow-sm transition-all">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                                                        <FaBox className="text-[#d97706] text-sm sm:text-base md:text-lg" />
                                                    </div>
                                                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Order Processing</h5>
                                                    <p className="text-xs sm:text-sm text-[#d97706]">We're preparing your items for shipment</p>
                                                </div>
                                                <div className="text-center p-3 sm:p-4 md:p-6 border border-[#d97706]/20 rounded-lg sm:rounded-xl hover:border-[#d97706] hover:shadow-sm transition-all">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#d97706]/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                                                        <FaTruck className="text-[#d97706] text-sm sm:text-base md:text-lg" />
                                                    </div>
                                                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Shipping</h5>
                                                    <p className="text-xs sm:text-sm text-[#d97706]">Your order will be shipped within 24 hours</p>
                                                </div>
                                                <div className="text-center p-3 sm:p-4 md:p-6 border border-[#d97706]/20 rounded-lg sm:rounded-xl hover:border-[#d97706] hover:shadow-sm transition-all">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                                                        <FaMapMarkerAlt className="text-emerald-600 text-sm sm:text-base md:text-lg" />
                                                    </div>
                                                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Delivery</h5>
                                                    <p className="text-xs sm:text-sm text-emerald-600">Expected delivery in 3-5 business days</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Redirect Notice */}
                                        <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-[#d97706]/20">
                                            <div className="flex items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
                                                <div className="p-1.5 sm:p-2 md:p-3 bg-[#d97706]/10 rounded-lg flex-shrink-0 mt-0.5 sm:mt-0">
                                                    <FaArrowRight className="text-[#d97706] text-sm sm:text-base" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-sm sm:text-base font-semibold text-gray-900 mb-0.5 sm:mb-1">Automatic Redirect</h5>
                                                    <p className="text-xs sm:text-sm text-[#d97706]">
                                                        You will be redirected to your order details page in a few seconds.
                                                        <span className="text-[#d97706] font-medium ml-1 sm:ml-2">
                                                            (Redirecting in {redirectCountdown} seconds...)
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-[#d97706]/20 p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Quick Actions</h3>
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                <Link 
                                    to={`/orders/${orderId}`}
                                    className="flex items-center justify-between p-2.5 sm:p-3 md:p-4 bg-[#d97706]/5 hover:bg-[#d97706]/10 rounded-lg sm:rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="p-1 sm:p-1.5 md:p-2 bg-[#d97706]/10 rounded-lg">
                                            <FaBox className="text-[#d97706] text-sm sm:text-base" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">View Order Details</h4>
                                            <p className="text-xs sm:text-sm text-[#d97706] truncate">Track and manage your order</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-[#d97706] text-sm sm:text-base group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                </Link>

                                <Link 
                                    to="/products"
                                    className="flex items-center justify-between p-2.5 sm:p-3 md:p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg sm:rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="p-1 sm:p-1.5 md:p-2 bg-emerald-100 rounded-lg">
                                            <FaShoppingBag className="text-emerald-600 text-sm sm:text-base" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">Continue Shopping</h4>
                                            <p className="text-xs sm:text-sm text-emerald-600 truncate">Browse more products</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-emerald-500 text-sm sm:text-base group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                </Link>

                                <Link 
                                    to="/dashboard"
                                    className="flex items-center justify-between p-2.5 sm:p-3 md:p-4 bg-[#d97706]/5 hover:bg-[#d97706]/10 rounded-lg sm:rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="p-1 sm:p-1.5 md:p-2 bg-[#d97706]/10 rounded-lg">
                                            <FaCreditCard className="text-[#d97706] text-sm sm:text-base" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">Account Dashboard</h4>
                                            <p className="text-xs sm:text-sm text-[#d97706] truncate">Manage your account</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-[#d97706] text-sm sm:text-base group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                </Link>
                            </div>
                        </div>

                        {/* Support Information */}
                        <div className="bg-gradient-to-r from-[#d97706]/5 to-[#d97706]/10 rounded-xl sm:rounded-2xl border border-[#d97706]/20 p-3 sm:p-4 md:p-6">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Need Help?</h3>
                            <p className="text-xs sm:text-sm text-[#d97706] mb-3 sm:mb-4 md:mb-6">
                                Our support team is available to assist you with any questions about your order.
                            </p>
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-1 sm:p-1.5 md:p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                                        <FaEnvelope className="text-[#d97706] text-sm sm:text-base" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-[#d97706]">Email Support</p>
                                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate">support@example.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-1 sm:p-1.5 md:p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                                        <FaPhone className="text-[#d97706] text-sm sm:text-base" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm text-[#d97706]">Phone Support</p>
                                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download Invoice */}
                        {/* {!error && (
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-[#d97706]/20 p-3 sm:p-4 md:p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                                    <div className="p-1.5 sm:p-2 md:p-3 bg-[#d97706]/10 rounded-lg">
                                        <FaCreditCard className="text-[#d97706] text-base sm:text-lg md:text-xl" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm sm:text-base font-bold text-gray-900">Order Invoice</h4>
                                        <p className="text-xs sm:text-sm text-[#d97706]">Download your order receipt</p>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-[#d97706] to-[#b45309] text-white py-2 sm:py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#d97706]/20 transition-all text-sm sm:text-base">
                                    Download Invoice
                                </button>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes progress {
                    0% { width: 0%; }
                    50% { width: 50%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}