import { useParams, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function PaymentFailed() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 p-8 sm:p-12 text-center border border-white overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FaTimesCircle className="text-5xl text-red-500" />
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                            Payment Failed
                        </h1>
                        <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">
                            We couldn't process your payment for order <span className="text-gray-900 font-bold">#{orderId?.slice(-6).toUpperCase()}</span>. Please try again or choose a different payment method.
                        </p>

                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4 text-left mb-8">
                            <FaExclamationTriangle className="text-amber-600 text-xl shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-amber-900 text-sm">Common reasons:</h4>
                                <ul className="text-xs text-amber-800 space-y-1 mt-1 opacity-80">
                                    <li>• Insufficient funds or credit limit</li>
                                    <li>• Incorrect card details entered</li>
                                    <li>• Bank's security system blocked the transaction</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3"
                            >
                                <FaArrowLeft className="text-sm" />
                                Back to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
