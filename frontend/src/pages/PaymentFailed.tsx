import { useParams, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaArrowLeft, FaRedo, FaExclamationTriangle, FaCreditCard } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function PaymentFailed() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(30);

    // Countdown timer for auto-redirect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            navigate('/checkout');
        }
    }, [countdown, navigate]);

    const retryPayment = () => {
        navigate('/checkout', { state: { retryPayment: true } });
    };

    const goToHome = () => {
        navigate('/');
    };

    const contactSupport = () => {
        navigate('/contact');
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
            <div className="max-w-lg w-full mx-auto">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-100 border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-8 md:p-10 text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
                        
                        {/* Main icon */}
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30">
                                <FaTimesCircle className="text-5xl text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Payment Unsuccessful</h1>
                            <p className="text-orange-100 font-medium">Order Reference: #{orderId?.slice(-10).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-10">
                        {/* Status Message */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 rounded-full px-6 py-3 mb-6">
                                <FaExclamationTriangle className="text-red-500" />
                                <span className="text-red-700 font-semibold">Payment Could Not Be Processed</span>
                            </div>
                            
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                We were unable to complete your payment transaction. This could be due to insufficient funds, incorrect card details, or bank security restrictions.
                            </p>
                        </div>

                      

                        {/* Action Buttons */}
                        <div className="space-y-4 mb-8">
                            <button
                                onClick={retryPayment}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                            >
                                <FaRedo className="text-xl group-hover:rotate-180 transition-transform duration-500" />
                                <span>Try Payment Again</span>
                            </button>
                            
                            <button
                                onClick={goToHome}
                                className="w-full bg-white border-2 border-orange-200 hover:border-orange-300 text-gray-900 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-orange-50 flex items-center justify-center gap-3"
                            >
                                <FaArrowLeft className="text-orange-500" />
                                Return to Homepage
                            </button>
                        </div>

                        {/* Countdown Timer */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-3 bg-orange-50 px-6 py-3 rounded-full border border-orange-200">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-700 font-medium">
                                    Auto-redirect in{' '}
                                    <span className="text-orange-600 font-bold text-xl">{countdown}</span> seconds
                                </span>
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="text-center border-t border-gray-100 pt-6">
                            <p className="text-gray-600 text-sm mb-4">
                                Your order is temporarily reserved. Complete payment within 30 minutes to secure your items.
                            </p>
                            <button 
                                onClick={contactSupport}
                                className="text-orange-600 hover:text-orange-700 font-medium text-sm underline decoration-orange-300 hover:decoration-orange-500 transition-colors"
                            >
                                Need assistance? Contact our support team
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-500">
                                Transaction ID: <span className="font-mono font-bold text-gray-700">{orderId}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                                Secure Payment Gateway • SSL Encrypted
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative dots */}
                <div className="flex justify-center gap-2 mt-8">
                    <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-60"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-60"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-60"></div>
                </div>
            </div>
        </div>
    );
}