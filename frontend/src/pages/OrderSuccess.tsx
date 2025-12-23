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

    // Automatic redirect after 8 seconds if verified
    useEffect(() => {
        if (!verifying && !error && orderId) {
            const timer = setTimeout(() => {
                navigate(`/orders/${orderId}`);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [verifying, error, orderId, navigate]);

    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-orange-200 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Processing Payment</h2>
                    <p className="text-gray-600 mb-6">We're verifying your payment details. This may take a moment.</p>
                    <div className="space-y-3">
                        <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 animate-progress"></div>
                        </div>
                        <p className="text-sm text-orange-600">Please do not refresh or close this page</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
            {/* Header Navigation */}
            <div className="bg-white border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-md">
                                <FaShoppingBag className="text-white text-lg" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Order Confirmation</h1>
                                <p className="text-sm text-gray-500">Thank you for your purchase</p>
                            </div>
                        </div>
                        <Link 
                            to="/dashboard" 
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Success Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            {error ? (
                                                <FaExclamationTriangle className="text-2xl text-red-300" />
                                            ) : (
                                                <FaCheckCircle className="text-2xl text-emerald-300" />
                                            )}
                                            <h2 className="text-2xl font-bold">
                                                {error ? 'Payment Issue' : 'Order Confirmed!'}
                                            </h2>
                                        </div>
                                        <p className="text-orange-100">
                                            {error ? 'We encountered an issue with your payment' : 'Your order has been successfully placed'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-orange-200 mb-1">Order ID</div>
                                        <div className="text-lg font-mono font-bold text-white">
                                            #{orderId?.slice(-8).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8">
                                {error ? (
                                    <div className="text-center py-8">
                                        <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-200">
                                            <FaExclamationTriangle className="text-3xl text-red-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Payment Verification Failed</h3>
                                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                            {error} Please contact our support team for assistance.
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            <Link 
                                                to="/support" 
                                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-red-200 transition-all"
                                            >
                                                Contact Support
                                            </Link>
                                            <Link 
                                                to="/cart" 
                                                className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                                            >
                                                Return to Cart
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Success Message */}
                                        <div className="text-center py-6">
                                            <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 animate-pulse">
                                                <FaCheckCircle className="text-4xl text-emerald-500" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h3>
                                            <p className="text-gray-600 max-w-lg mx-auto">
                                                Your order has been received and is being processed. You'll receive a confirmation email shortly.
                                            </p>
                                        </div>

                                        {/* Order Summary */}
                                        {order && (
                                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="text-center">
                                                        <div className="text-sm text-orange-700 mb-2">Total Amount</div>
                                                        <div className="text-3xl font-bold text-gray-900">
                                                            ${order.totalAmount.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-orange-700 mb-2">Payment Method</div>
                                                        <div className="font-medium text-gray-900 flex items-center justify-center gap-2">
                                                            <FaCreditCard className="text-orange-500" />
                                                            {order.paymentMethod || 'Credit Card'}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-orange-700 mb-2">Order Status</div>
                                                        <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium inline-block">
                                                            Confirmed
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* What's Next */}
                                        <div className="border-t border-orange-200 pt-8">
                                            <h4 className="text-lg font-bold text-gray-900 mb-6">What Happens Next</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="text-center p-6 border border-orange-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all">
                                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <FaBox className="text-orange-600 text-lg" />
                                                    </div>
                                                    <h5 className="font-semibold text-gray-900 mb-2">Order Processing</h5>
                                                    <p className="text-sm text-orange-600">We're preparing your items for shipment</p>
                                                </div>
                                                <div className="text-center p-6 border border-orange-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all">
                                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <FaTruck className="text-amber-600 text-lg" />
                                                    </div>
                                                    <h5 className="font-semibold text-gray-900 mb-2">Shipping</h5>
                                                    <p className="text-sm text-amber-600">Your order will be shipped within 24 hours</p>
                                                </div>
                                                <div className="text-center p-6 border border-orange-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all">
                                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <FaMapMarkerAlt className="text-emerald-600 text-lg" />
                                                    </div>
                                                    <h5 className="font-semibold text-gray-900 mb-2">Delivery</h5>
                                                    <p className="text-sm text-emerald-600">Expected delivery in 3-5 business days</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Redirect Notice */}
                                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-amber-100 rounded-lg">
                                                    <FaArrowRight className="text-amber-600" />
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 mb-1">Automatic Redirect</h5>
                                                    <p className="text-sm text-orange-700">
                                                        You will be redirected to your order details page in a few seconds. 
                                                        <span className="text-amber-700 font-medium ml-2">(Redirecting in 8 seconds...)</span>
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
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                            <div className="space-y-4">
                                <Link 
                                    to={`/orders/${orderId}`}
                                    className="flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <FaBox className="text-orange-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">View Order Details</h4>
                                            <p className="text-sm text-orange-600">Track and manage your order</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-orange-500 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link 
                                    to="/products"
                                    className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <FaShoppingBag className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Continue Shopping</h4>
                                            <p className="text-sm text-emerald-600">Browse more products</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link 
                                    to="/dashboard"
                                    className="flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <FaCreditCard className="text-orange-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Account Dashboard</h4>
                                            <p className="text-sm text-orange-600">Manage your account</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-orange-500 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Support Information */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                            <p className="text-sm text-orange-700 mb-6">
                                Our support team is available to assist you with any questions about your order.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <FaEnvelope className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-orange-600">Email Support</p>
                                        <p className="font-medium text-gray-900">support@example.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <FaPhone className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-orange-600">Phone Support</p>
                                        <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download Invoice */}
                        {!error && (
                            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <FaCreditCard className="text-orange-600 text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Order Invoice</h4>
                                        <p className="text-sm text-orange-600">Download your order receipt</p>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-200 transition-all">
                                    Download Invoice
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-orange-200 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <p className="text-sm text-orange-700 mb-4">
                            Order ID: <span className="font-mono text-gray-900">{orderId}</span>
                        </p>
                        <p className="text-xs text-orange-600">
                            © {new Date().getFullYear()} Your Company Name. All rights reserved.
                            <span className="mx-2">•</span>
                            <Link to="/privacy" className="hover:text-orange-600">Privacy Policy</Link>
                            <span className="mx-2">•</span>
                            <Link to="/terms" className="hover:text-orange-600">Terms of Service</Link>
                        </p>
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