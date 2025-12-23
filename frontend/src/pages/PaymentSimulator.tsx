import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { CartContext } from '../contexts/CartContext';
import { getImageUrl } from '../utils/imageUrl';
import {
    FaCreditCard, FaLock, FaCcVisa,
    FaCcMastercard, FaSpinner, FaCheckCircle, FaChevronLeft,
    FaShieldAlt, FaShippingFast, FaReceipt, FaCcAmex, FaCcDiscover,
    FaEye, FaEyeSlash
} from 'react-icons/fa';

// Card type definitions
const CARD_TYPES = {
    visa: {
        name: 'Visa',
        icon: FaCcVisa,
        color: 'text-blue-900',
        bgColor: 'bg-blue-50',
        testData: {
            cardNumber: '4242 4242 4242 4242',
            cvv: '123',
            expiry: '12/28'
        }
    },
    mastercard: {
        name: 'Mastercard',
        icon: FaCcMastercard,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        testData: {
            cardNumber: '5555 5555 5555 4444',
            cvv: '456',
            expiry: '06/29'
        }
    },
    amex: {
        name: 'American Express',
        icon: FaCcAmex,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        testData: {
            cardNumber: '3782 822463 10005',
            cvv: '789',
            expiry: '09/30'
        }
    },
    discover: {
        name: 'Discover',
        icon: FaCcDiscover,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        testData: {
            cardNumber: '6011 6011 6011 6611',
            cvv: '321',
            expiry: '03/27'
        }
    }
};

export default function PaymentSimulator() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const cart = useContext(CartContext)!;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [selectedCard, setSelectedCard] = useState<string>('visa');
    const [showCvv, setShowCvv] = useState(false);
    
    // Form fields
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [country, setCountry] = useState('Sri Lanka');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get('/orders/my');
                const currentOrder = res.data.find((o: any) => o._id === orderId);
                setOrder(currentOrder);
                // Pre-fill cardholder name with user's name if available
                if (currentOrder?.user?.name) {
                    setCardholderName(currentOrder.user.name);
                }
            } catch (error) {
                console.error("Failed to fetch order", error);
            }
        };
        fetchOrder();
    }, [orderId]);

    // Auto-fill with test data when card type is selected
    useEffect(() => {
        const cardType = CARD_TYPES[selectedCard as keyof typeof CARD_TYPES];
        setCardNumber(cardType.testData.cardNumber);
        setExpiryDate(cardType.testData.expiry);
        setCvv(cardType.testData.cvv);
    }, [selectedCard]);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        // Format with spaces every 4 digits
        const parts = [];
        for (let i = 0; i < value.length; i += 4) {
            parts.push(value.substring(i, i + 4));
        }
        setCardNumber(parts.join(' ').trim());
    };

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        // Format as MM/YY
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        setExpiryDate(value);
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        setCvv(value.substring(0, 4)); // Max 4 digits for Amex
    };

    const handleSimulatePayment = async () => {
        // Validate form
        if (!cardNumber.trim() || cardNumber.replace(/\s+/g, '').length < 16) {
            alert('Please enter a valid 16-digit card number');
            return;
        }
        if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            alert('Please enter a valid expiry date (MM/YY)');
            return;
        }
        if (!cvv || cvv.length < 3) {
            alert('Please enter a valid CVV');
            return;
        }
        if (!cardholderName.trim()) {
            alert('Please enter cardholder name');
            return;
        }

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

    const selectedCardType = CARD_TYPES[selectedCard as keyof typeof CARD_TYPES];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold text-sm transition-colors duration-200 group"
                    >
                        <FaChevronLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                        <span>Return to Ammogam</span>
                    </button>
                    
                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
                            <p className="text-gray-600 mt-1">Secure checkout powered by Ammogam</p>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg">
                            <FaShieldAlt />
                            <span className="text-sm font-semibold">100% Secure</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Order Summary */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                <FaReceipt className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                                <p className="text-sm text-gray-500">Order #: {orderId?.slice(-8)}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-6 mb-8">
                            <h3 className="font-semibold text-gray-900">Items in Order</h3>
                            {order?.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 p-3 hover:bg-orange-50 rounded-lg transition-colors">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                        <img 
                                            src={getImageUrl(item.product?.image)} 
                                            alt={item.product?.name}
                                            className="w-12 h-12 object-contain" 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 line-clamp-2">{item.product?.name}</h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">${order?.totalAmount?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold text-green-600">FREE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-semibold">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                <div>
                                    <div className="text-2xl font-bold text-orange-600">
                                        ${order?.totalAmount?.toFixed(2)}
                                    </div>
                                    <p className="text-xs text-gray-500 text-right">USD</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-8 p-4 bg-orange-50 rounded-xl">
                            <div className="flex items-center gap-3 mb-3">
                                <FaShippingFast className="text-orange-500" />
                                <span className="font-semibold text-gray-900">Delivery Information</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Estimated delivery: 3-5 business days
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Payment Details */}
                    <div className="space-y-8">
                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                    <FaCreditCard className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                                    <p className="text-sm text-gray-500">Choose your card type and enter details</p>
                                </div>
                            </div>

                            {/* Card Type Selection */}
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Select Card Type</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(CARD_TYPES).map(([key, card]) => {
                                        const Icon = card.icon;
                                        const isSelected = selectedCard === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedCard(key)}
                                                className={`
                                                    p-4 rounded-xl border-2 transition-all duration-200
                                                    flex flex-col items-center justify-center gap-2
                                                    ${isSelected 
                                                        ? `border-orange-500 ${card.bgColor} shadow-md` 
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }
                                                    active:scale-95
                                                `}
                                            >
                                                <Icon className={`text-2xl ${card.color}`} />
                                                <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {card.name}
                                                </span>
                                                {isSelected && (
                                                    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Card Details */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Card Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <selectedCardType.icon className={`text-xl ${selectedCardType.color}`} />
                                        </div>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            placeholder="0000 0000 0000 0000"
                                            maxLength={19}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Test card: {selectedCardType.testData.cardNumber}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            value={expiryDate}
                                            onChange={handleExpiryDateChange}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Test: {selectedCardType.testData.expiry}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            CVV
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCvv ? "text" : "password"}
                                                value={cvv}
                                                onChange={handleCvvChange}
                                                placeholder="123"
                                                maxLength={4}
                                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all pr-12"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCvv(!showCvv)}
                                                    className="text-gray-400 hover:text-orange-600 transition-colors"
                                                >
                                                    {showCvv ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                                <FaLock className="text-sm text-gray-400" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Test: {selectedCardType.testData.cvv}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={cardholderName}
                                        onChange={(e) => setCardholderName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Country
                                    </label>
                                    <select 
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all appearance-none"
                                    >
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleSimulatePayment}
                                    disabled={loading || success}
                                    className={`
                                        w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
                                        flex items-center justify-center gap-3
                                        ${success
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                                            : loading
                                            ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-lg'
                                            : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 hover:shadow-2xl hover:shadow-orange-500/30 active:scale-[0.99] shadow-lg'
                                        }
                                        disabled:opacity-70 disabled:cursor-not-allowed
                                    `}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin text-xl" />
                                            <span>Processing Payment...</span>
                                        </>
                                    ) : success ? (
                                        <>
                                            <FaCheckCircle className="animate-pulse" />
                                            <span>Payment Successful!</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaLock />
                                            <span>Pay ${order?.totalAmount?.toFixed(2)}</span>
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
                                    <FaShieldAlt className="text-orange-500" />
                                    <span className="text-xs font-semibold">
                                        Secured with 256-bit SSL encryption
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <FaLock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                                        <p className="text-xs text-gray-500">PCI DSS compliant</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <FaShieldAlt className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Money Back</p>
                                        <p className="text-xs text-gray-500">30-day guarantee</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <FaCreditCard className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Encrypted</p>
                                        <p className="text-xs text-gray-500">Bank-level security</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div>
                            <h4 className="font-bold text-gray-900">Ammogam Store</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                © {new Date().getFullYear()} All rights reserved.
                            </p>
                        </div>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <span className="text-sm text-gray-600">Accepted Payments:</span>
                            <div className="flex gap-3">
                                <FaCcVisa className="text-2xl text-blue-900" />
                                <FaCcMastercard className="text-2xl text-red-600" />
                                <FaCcAmex className="text-2xl text-blue-500" />
                                <FaCcDiscover className="text-2xl text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}