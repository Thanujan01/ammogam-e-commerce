import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import { getImageUrl } from '../../utils/imageUrl';
import { FaBox, FaShoppingCart, FaChartLine } from 'react-icons/fa';

export default function SellerDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/products/seller/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching seller stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const totalRevenue = stats?.totalRevenue || 0;
    const adminCommission = totalRevenue * 0.05;
    const sellerEarnings = totalRevenue * 0.95;

    const statCards = [
        { label: 'Total Products', value: stats?.totalProducts || 0, icon: <FaBox />, color: 'bg-blue-500' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FaShoppingCart />, color: 'bg-indigo-500' },
        { label: 'Products Sold', value: stats?.totalProductsSold || 0, icon: <FaChartLine />, color: 'bg-amber-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
                <div className="text-sm text-gray-500">Welcome back to your seller panel</div>
            </div>

            {/* Commission Breakdown Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 p-8 rounded-3xl shadow-lg">
                <h2 className="text-lg font-black text-gray-800 mb-6 uppercase tracking-wider">Revenue & Commission Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
                        <p className="text-3xl font-black text-emerald-600">$ {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-gray-500 mt-2">From all your sales</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
                        <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-2">Platform Fee (5%)</p>
                        <p className="text-3xl font-black text-orange-600">$ {adminCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-gray-500 mt-2">Admin commission</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
                        <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">Your Earnings (95%)</p>
                        <p className="text-3xl font-black text-green-600">$ {sellerEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-gray-500 mt-2">Amount to be paid</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`${stat.color} text-white p-4 rounded-xl text-2xl`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Products</h2>
                    <div className="space-y-4">
                        {stats?.products?.length > 0 ? (
                            stats.products.map((product: any) => (
                                <div key={product._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={getImageUrl(product.image)} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                                            <p className="text-xs text-gray-500">$ {product.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                        {product.stock} in stock
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No products yet</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            to="/seller/products"
                            className="p-4 border-2 border-emerald-100 bg-emerald-50 rounded-xl text-emerald-700 font-bold hover:bg-emerald-100 transition-colors flex flex-col items-center gap-2"
                        >
                            <FaBox className="text-2xl" />
                            <span>Add Product</span>
                        </Link>
                        <Link
                            to="/seller/orders"
                            className="p-4 border-2 border-blue-100 bg-blue-50 rounded-xl text-blue-700 font-bold hover:bg-blue-100 transition-colors flex flex-col items-center gap-2"
                        >
                            <FaShoppingCart className="text-2xl" />
                            <span>View Orders</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
