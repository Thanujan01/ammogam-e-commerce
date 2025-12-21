import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiPackage, FiUser, FiMapPin, FiPhone, FiMail, FiCreditCard } from 'react-icons/fi';
import { api } from '../../api/api';
import { getImageUrl } from '../../utils/imageUrl';

export default function AdminSellerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [seller, setSeller] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // We can get seller info from the list if we pass state, but let's fetch for freshness
            // Actually our sellers/all returns them. Let's assume we can fetch specific if we have an endpoint.
            // For now, let's fetch all and filter or add a specific get route if needed.
            // Let's add a backend route for specific seller if not exists.

            // Re-using existing endpoints
            const [pRes, oRes, sRes] = await Promise.all([
                api.get(`/sellers/${id}/products`),
                api.get(`/sellers/${id}/orders`),
                api.get(`/sellers/${id}`)
            ]);

            setProducts(pRes.data);
            setOrders(oRes.data);
            setSeller(sRes.data);

        } catch (error) {
            console.error("Failed to fetch seller details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="p-8 text-center text-gray-500">
                <h2 className="text-2xl font-bold">Seller not found</h2>
                <button onClick={() => navigate('/admin/sellers')} className="mt-4 text-blue-600 font-bold">Back to Sellers</button>
            </div>
        );
    }

    const totalRevenue = orders.reduce((acc, order) => {
        return acc + order.items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
    }, 0);

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                <button onClick={() => navigate('/admin/sellers')} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-6 font-bold text-sm uppercase tracking-widest">
                    <FiArrowLeft /> Back to Sellers
                </button>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl font-black text-blue-600 border border-blue-100 shadow-sm">
                            {seller.businessName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{seller.businessName}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">Approved Seller</span>
                                <span className="text-gray-400 font-bold text-sm">Joined {new Date(seller.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="bg-gray-50 border border-gray-100 px-6 py-4 rounded-3xl text-center min-w-[140px]">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                            <p className="text-2xl font-black text-emerald-600">$ {totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 px-6 py-4 rounded-3xl text-center min-w-[140px]">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Admin Commission (5%)</p>
                            <p className="text-2xl font-black text-blue-600">$ {(totalRevenue * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 px-6 py-4 rounded-3xl text-center min-w-[140px]">
                            <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Seller Payout (95%)</p>
                            <p className="text-2xl font-black text-green-600">$ {(totalRevenue * 0.95).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 px-6 py-4 rounded-3xl text-center min-w-[140px]">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Products</p>
                            <p className="text-2xl font-black text-blue-600">{products.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar: Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Personal Details</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <FiUser />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner Name</p>
                                    <p className="font-bold text-gray-900">{seller.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <FiMail />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="font-bold text-gray-900 truncate">{seller.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <FiPhone />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="font-bold text-gray-900">{seller.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Business Location</h3>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                                <FiMapPin />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                                    {seller.businessAddress}
                                </p>
                                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tax / Registration ID</p>
                                    <p className="font-mono text-sm font-black text-blue-600">{seller.taxId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main: Products & Orders Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bank Details Section - Moved to top of main column */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-[2rem] shadow-sm p-8">
                        <h3 className="text-xs font-black text-green-700 uppercase tracking-[0.2em] mb-8">Bank Account Details</h3>
                        {seller.bankName || seller.accountNumber ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-green-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bank Name</p>
                                    <p className="font-bold text-gray-900">{seller.bankName || 'Not provided'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-green-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Holder Name</p>
                                    <p className="font-bold text-gray-900">{seller.accountHolderName || 'Not provided'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-green-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                                    <p className="font-mono font-black text-gray-900">{seller.accountNumber || 'Not provided'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-green-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">IFSC Code</p>
                                    <p className="font-mono font-black text-gray-900">{seller.ifscCode || 'Not provided'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-green-100 md:col-span-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Branch Name</p>
                                    <p className="font-bold text-gray-900">{seller.branchName || 'Not provided'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-2xl border border-green-100 text-center">
                                <FiCreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-500">No bank details provided yet</p>
                                <p className="text-xs text-gray-400 mt-1">Seller needs to update their profile</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`flex-1 py-6 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'products' ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <FiPackage /> Products ({products.length})
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex-1 py-6 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <FiShoppingBag /> Orders ({orders.length})
                                </div>
                            </button>
                        </div>

                        <div className="p-8">
                            {activeTab === 'products' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {products.length === 0 ? (
                                        <div className="col-span-2 py-12 text-center text-gray-400">
                                            <FiPackage className="text-4xl mx-auto mb-4 opacity-20" />
                                            <p className="font-bold">No products uploaded yet.</p>
                                        </div>
                                    ) : (
                                        products.map(product => (
                                            <div key={product._id} className="group bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-blue-200 transition-all hover:shadow-md">
                                                <div className="flex gap-4">
                                                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-100 p-2 flex-shrink-0">
                                                        <img src={getImageUrl(product.image)} className="w-full h-full object-contain" alt={product.name} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-gray-900 text-sm truncate">{product.name}</h4>
                                                        <p className="text-xs text-gray-500 font-bold mt-1">$ {product.price.toLocaleString()}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {product.stock > 0 ? `${product.stock} STK` : 'Out of Stock'}
                                                            </span>
                                                            <span className="text-[8px] font-black uppercase text-gray-400 italic">
                                                                {product.category?.name || 'No Category'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.length === 0 ? (
                                        <div className="py-12 text-center text-gray-400">
                                            <FiShoppingBag className="text-4xl mx-auto mb-4 opacity-20" />
                                            <p className="font-bold">No orders received for this seller yet.</p>
                                        </div>
                                    ) : (
                                        orders.map(order => (
                                            <div key={order._id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-200/50 pb-4 mb-4">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                                                        <p className="font-black text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seller Income</p>
                                                        <p className="font-black text-emerald-600 text-sm">$ {order.items.reduce((s: number, it: any) => s + (it.price * it.quantity), 0).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    {order.items.map((item: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between text-xs">
                                                            <span className="text-gray-600 font-bold flex items-center gap-2">
                                                                <span className="w-5 h-5 bg-white border border-gray-100 rounded-md flex items-center justify-center text-[10px]">{item.quantity}</span>
                                                                {item.product?.name}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-md font-black uppercase text-[8px] border ${item.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                                item.status === 'shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                                    'bg-amber-100 text-amber-700 border-amber-200'
                                                                }`}>
                                                                {item.status || 'pending'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                                                    <div className="text-[10px] font-bold text-gray-400">
                                                        Customer: <span className="text-gray-900">{order.user?.name}</span>
                                                    </div>
                                                    <Link to={`/admin/orders`} className="text-[10px] font-black uppercase text-blue-600 hover:underline">View in Master List</Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
