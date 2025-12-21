import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaArrowRight, FaTruck, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
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

    // Automatic redirect after 5 seconds if verified
    useEffect(() => {
        if (!verifying && !error && orderId) {
            const timer = setTimeout(() => {
                navigate(`/orders/${orderId}`);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [verifying, error, orderId, navigate]);

    if (verifying) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-2xl font-black text-gray-900">Verifying Payment...</h2>
                    <p className="text-gray-500">Please don't refresh the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 p-8 sm:p-12 text-center border border-white overflow-hidden relative">

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

                    <div className="relative z-10">
                        {error ? (
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <FaExclamationTriangle className="text-5xl text-red-500" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <FaCheckCircle className="text-5xl text-emerald-500" />
                            </div>
                        )}

                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                            {error ? 'Payment Issue' : 'Order Confirmed!'}
                        </h1>
                        <div className="text-gray-500 font-medium mb-12 max-w-sm mx-auto">
                            {error ? error : (
                                <div className="space-y-4">
                                    <p>Your order <span className="text-gray-900 font-bold">#{orderId?.slice(-6).toUpperCase()}</span> has been placed successfully.</p>
                                    {order && (
                                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 animate-fadeIn">
                                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Total Paid</p>
                                            <p className="text-2xl font-black text-gray-900">$ {order.totalAmount.toLocaleString()}</p>
                                        </div>
                                    )}
                                    <p className="text-sm">We'll notify you when it's on its way.</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">Redirecting to order details in 5 seconds...</p>
                                </div>
                            )}
                        </div>

                        {!error && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-left group hover:bg-white hover:shadow-lg transition-all">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform">
                                        <FaTruck />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">Fast Delivery</h4>
                                    <p className="text-xs text-gray-400">Your package will arrive in 3-5 business days</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-left group hover:bg-white hover:shadow-lg transition-all">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">Live Tracking</h4>
                                    <p className="text-xs text-gray-400">Track your order status anytime in your dashboard</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to={`/orders/${orderId}`}
                                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                Track Order
                                <FaArrowRight className="text-sm" />
                            </Link>
                            <Link
                                to="/products"
                                className="flex-1 bg-amber-50 text-amber-900 py-4 rounded-2xl font-black text-lg hover:bg-amber-100 transition-all flex items-center justify-center gap-3"
                            >
                                <FaShoppingBag className="text-sm" />
                                Shop More
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        Need help? Contact our support at <span className="text-amber-600">hello@ammogam.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
