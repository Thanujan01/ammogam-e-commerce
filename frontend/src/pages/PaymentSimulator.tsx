import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { CartContext } from '../contexts/CartContext';
import { getImageUrl } from '../utils/imageUrl';
import {
    FaCreditCard, FaLock, FaCcVisa,
    FaCcMastercard, FaSpinner, FaCheckCircle, FaChevronLeft
} from 'react-icons/fa';

export default function PaymentSimulator() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const cart = useContext(CartContext)!;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get('/orders/my');
                const currentOrder = res.data.find((o: any) => o._id === orderId);
                setOrder(currentOrder);
            } catch (error) {
                console.error("Failed to fetch order", error);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handleSimulatePayment = async () => {
        setLoading(true);
        try {
            // API call to update order status to paid
            await api.put(`/orders/${orderId}/pay`);

            // Simulate processing time
            setTimeout(() => {
                setSuccess(true);
                cart.clearCart();
                setLoading(false);

                // Redirect to success after 2 seconds
                setTimeout(() => {
                    navigate(`/order-success/${orderId}`);
                }, 1500);
            }, 2500);
        } catch (error) {
            console.error(error);
            alert('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col md:flex-row">

            {/* Left side: Order Summary (Stripe Style) */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm mb-12 transition-all">
                    <FaChevronLeft className="text-xs" />
                    Back to Ammogam
                </button>

                <div className="max-w-md w-full animate-fadeIn">
                    <div className="flex items-center gap-2 mb-8 opacity-60">
                        <span className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-black text-xs">S</span>
                        <span className="font-black text-indigo-600 tracking-tighter text-xl italic uppercase">Stripe</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-black ml-2 uppercase tracking-widest">Test Mode</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-gray-500 font-bold mb-1">Pay Ammogam Store</h1>
                        <div className="text-5xl font-black text-gray-900 tracking-tighter">
                            $ {order?.totalAmount?.toLocaleString() || '...'}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {order?.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-white rounded border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    <img src={getImageUrl(item.product?.image)} className="w-8 h-8 object-contain" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{item.product?.name}</div>
                                    <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                                </div>
                                <div className="text-sm font-bold text-gray-900">
                                    $ {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}

                        <div className="pt-6 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>$ {order?.totalAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 font-medium">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-gray-900 pt-2">
                                <span>Total Due</span>
                                <span>$ {order?.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Payment Details */}
            <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center animate-slideUp">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Payment Details</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Email</label>
                            <input type="text" readOnly value={order?.user?.email || 'customer@example.com'} className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:outline-none" />
                        </div>

                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Card Information</label>
                            <div className="border border-gray-200 rounded-lg overflow-hidden ring-offset-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                                    <FaCreditCard className="text-gray-400" />
                                    <input type="text" readOnly value="4242 4242 4242 4242" className="flex-1 bg-transparent text-gray-900 font-medium focus:outline-none" />
                                    <div className="flex gap-1">
                                        <FaCcVisa className="text-indigo-600 text-lg" />
                                        <FaCcMastercard className="text-gray-300 text-lg" />
                                    </div>
                                </div>
                                <div className="flex">
                                    <input type="text" readOnly value="MM / YY" className="w-1/2 px-4 py-3 border-r border-gray-100 bg-transparent text-gray-900 font-medium focus:outline-none" />
                                    <input type="text" readOnly value="CVC" className="w-1/2 px-4 py-3 bg-transparent text-gray-900 font-medium focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Name on card</label>
                            <input type="text" readOnly value={order?.user?.name || 'Full Name'} className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-transparent text-gray-900 font-medium" />
                        </div>

                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Country or Region</label>
                            <select disabled className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-transparent text-gray-900 font-medium appearance-none">
                                <option>Sri Lanka</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleSimulatePayment}
                            disabled={loading || success}
                            className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${success
                                ? 'bg-green-500 text-white shadow-green-500/30'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin text-xl" />
                                    <span>Processing...</span>
                                </>
                            ) : success ? (
                                <>
                                    <FaCheckCircle className="animate-bounce" />
                                    <span>Payment Complete</span>
                                </>
                            ) : (
                                <>
                                    Pay $ {order?.totalAmount?.toLocaleString()}
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <FaLock className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Stripe</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
