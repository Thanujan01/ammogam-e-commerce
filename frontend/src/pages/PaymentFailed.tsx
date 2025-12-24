import { useParams, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaArrowLeft, FaRedo, FaExclamationTriangle } from 'react-icons/fa';
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
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-100 border border-[#d97706]/10 overflow-hidden">
                    {/* Header Section - Reduced height */}
                    <div className="bg-gradient-to-r from-[#d97706] via-[#d97706] to-[#b45309] p-6 md:p-8 text-center relative overflow-hidden">
                        {/* Decorative elements - Smaller */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-12 -translate-y-12"></div>
                        <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rounded-full translate-x-14 translate-y-14"></div>
                        
                        {/* Main icon - Smaller */}
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                                <FaTimesCircle className="text-3xl text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Payment Unsuccessful</h2>
                            <p className="text-[#FFFEFDFF]/90 font-medium text-sm">Order Reference: #{orderId?.slice(-10).toUpperCase()}</p>
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
                                className="w-full bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                            >
                                <FaRedo className="text-xl group-hover:rotate-180 transition-transform duration-500" />
                                <span>Try Payment Again</span>
                            </button>
                            
                            <button
                                onClick={goToHome}
                                className="w-full bg-white border-2 border-[#d97706]/20 hover:border-[#d97706] text-gray-900 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-[#d97706]/5 flex items-center justify-center gap-3"
                            >
                                <FaArrowLeft className="text-[#d97706]" />
                                Return to Homepage
                            </button>
                        </div>

                        {/* Countdown Timer */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-3 bg-[#d97706]/5 px-6 py-3 rounded-full border border-[#d97706]/20">
                                <div className="w-2 h-2 bg-[#d97706] rounded-full animate-pulse"></div>
                                <span className="text-gray-700 font-medium">
                                    Auto-redirect in{' '}
                                    <span className="text-[#d97706] font-bold text-xl">{countdown}</span> seconds
                                </span>
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="text-center border-t border-[#d97706]/10 pt-6">
                            <p className="text-gray-600 text-sm mb-4">
                                Your order is temporarily reserved. Complete payment within 30 minutes to secure your items.
                            </p>
                            <button 
                                onClick={contactSupport}
                                className="text-[#d97706] hover:text-[#b45309] font-medium text-sm underline decoration-[#d97706]/30 hover:decoration-[#d97706] transition-colors"
                            >
                                Need assistance? Contact our support team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}