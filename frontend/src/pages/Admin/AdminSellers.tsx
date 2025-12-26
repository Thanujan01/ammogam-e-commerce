import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCheck, FiX, FiEye, FiExternalLink, FiTrash2, FiEdit } from 'react-icons/fi';
import { Store, UserCheck, Clock, StoreIcon } from 'lucide-react';
import { api } from '../../api/api';

interface Seller {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isApproved: boolean;
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    taxId: string;
    createdAt: string;
}

export default function AdminSellers() {
    const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
    const [approvedSellers, setApprovedSellers] = useState<Seller[]>([]);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
    const [loading, setLoading] = useState(true);
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        businessAddress: '',
        businessPhone: '',
        taxId: ''
    });

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const pendingRes = await api.get('/sellers/pending');
            const approvedRes = await api.get('/sellers/all');
            setPendingSellers(pendingRes.data);
            setApprovedSellers(approvedRes.data);
        } catch (error) {
            console.error("Failed to fetch sellers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (confirm('Are you sure you want to approve this seller?')) {
            try {
                await api.post(`/sellers/approve/${id}`);
                alert('Seller approved successfully. The seller can now login.');
                await fetchSellers();
            } catch (error: any) {
                console.error("Failed to approve seller", error);
                alert('Failed to approve seller: ' + (error?.response?.data?.message || error.message));
            }
        }
    };

    const handleReject = async (id: string) => {
        if (confirm('Are you sure you want to reject and remove this seller request?')) {
            try {
                await api.post(`/sellers/reject/${id}`);
                alert('Seller request rejected');
                await fetchSellers();
            } catch (error: any) {
                console.error("Failed to reject seller", error);
                alert('Failed to reject seller: ' + (error?.response?.data?.message || error.message));
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to permanently delete this seller? This action cannot be undone.')) {
            try {
                await api.delete(`/sellers/${id}`);
                alert('Seller deleted successfully');
                await fetchSellers();
            } catch (error: any) {
                console.error("Failed to delete seller", error);
                alert('Failed to delete seller: ' + (error?.response?.data?.message || error.message));
            }
        }
    };

    const handleEdit = (seller: Seller) => {
        setSelectedSeller(seller);
        setEditFormData({
            name: seller.name,
            email: seller.email,
            phone: seller.phone,
            businessName: seller.businessName,
            businessAddress: seller.businessAddress,
            businessPhone: seller.businessPhone,
            taxId: seller.taxId
        });
        setEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSeller) return;

        try {
            await api.put(`/sellers/${selectedSeller._id}`, editFormData);
            alert('Seller updated successfully');
            setEditModalOpen(false);
            await fetchSellers();
        } catch (error: any) {
            console.error("Failed to update seller", error);
            alert('Failed to update seller: ' + (error?.response?.data?.message || error.message));
        }
    };

    const filteredPending = pendingSellers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredApproved = approvedSellers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentSellers = activeTab === 'pending' ? filteredPending : filteredApproved;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 ">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className='space-y-2'>
                        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Seller Management</h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <StoreIcon className="w-4 h-4" />
                            Manage product hierarchy and visual themes
                        </p>
                    </div>
                </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6  border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Sellers</p>
                            <p className="text-3xl font-bold">{pendingSellers.length + approvedSellers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Store className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
                            <p className="text-3xl font-bold text-yellow-600">{pendingSellers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6  border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Approved Sellers</p>
                            <p className="text-3xl font-bold text-green-600">{approvedSellers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header & Tabs */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            {/* <h1 className="text-2xl font-bold text-gray-800">Seller Management</h1> */}
                            <div className="flex mt-4 bg-gray-100 p-1 rounded-lg w-fit">
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Pending Requests ({pendingSellers.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('approved')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'approved' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Approved Sellers ({approvedSellers.length})
                                </button>
                            </div>
                        </div>

                        <div className="relative w-full lg:w-96">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search sellers by name, business or email..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left">Seller / Business</th>
                                    <th className="px-6 py-4 text-left">Contact Info</th>
                                    <th className="px-6 py-4 text-left">Tax ID</th>
                                    <th className="px-6 py-4 text-left">Requested Date</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentSellers.map(seller => (
                                    <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{seller.name}</p>
                                                <p className="text-sm text-blue-600 font-medium">{seller.businessName}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <p className="text-gray-700">{seller.email}</p>
                                            <p className="text-gray-500">{seller.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                            {seller.taxId}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(seller.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSeller(seller);
                                                        setModalOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye className="w-5 h-5" />
                                                </button>
                                                {activeTab === 'approved' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`/admin/sellers/${seller._id}`)}
                                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="View Portfolio & Orders"
                                                        >
                                                            <FiExternalLink className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(seller)}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                            title="Edit Seller"
                                                        >
                                                            <FiEdit className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(seller._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Seller"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {activeTab === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(seller._id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <FiCheck className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(seller._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <FiX className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(seller)}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                            title="Edit Seller"
                                                        >
                                                            <FiEdit className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(seller._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Seller"
                                                        >
                                                            <FiTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {!loading && currentSellers.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <Store className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No {activeTab} sellers found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Seller Details Modal */}
            {modalOpen && selectedSeller && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="bg-primary1 to-indigo-700 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Seller Application Details</h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                                            <p className="text-gray-900 font-semibold">{selectedSeller.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                                            <p className="text-gray-900 font-semibold">{selectedSeller.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                            <p className="text-gray-900 font-semibold">{selectedSeller.phone}</p>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Business Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Business Name</p>
                                            <p className="text-blue-600 font-bold">{selectedSeller.businessName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Tax ID / Reg Number</p>
                                            <p className="font-mono text-gray-900 font-semibold">{selectedSeller.taxId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Business Phone</p>
                                            <p className="text-gray-900 font-semibold">{selectedSeller.businessPhone}</p>
                                        </div>
                                    </div>
                                </section>
                                <section className="md:col-span-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Business Address</h4>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <p className="text-gray-700 leading-relaxed">{selectedSeller.businessAddress}</p>
                                    </div>
                                </section>
                            </div>

                            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                >
                                    Close
                                </button>
                                {activeTab === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleReject(selectedSeller._id);
                                                setModalOpen(false);
                                            }}
                                            className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium"
                                        >
                                            Reject Request
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleApprove(selectedSeller._id);
                                                setModalOpen(false);
                                            }}
                                            className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md transition-all font-medium"
                                        >
                                            Approve Seller
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Seller Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <form onSubmit={handleUpdate}>
                            <div className="bg-amber-600 p-6 text-white flex justify-between items-center">
                                <h3 className="text-xl font-bold">Edit Seller Information</h3>
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="hover:bg-white/20 p-2 rounded-full transition-colors"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Email Address</label>
                                        <input
                                            type="email"
                                            value={editFormData.email}
                                            onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Phone</label>
                                        <input
                                            type="text"
                                            value={editFormData.phone}
                                            onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Business Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.businessName}
                                            onChange={e => setEditFormData({ ...editFormData, businessName: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Business Phone</label>
                                        <input
                                            type="text"
                                            value={editFormData.businessPhone}
                                            onChange={e => setEditFormData({ ...editFormData, businessPhone: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Tax ID</label>
                                        <input
                                            type="text"
                                            value={editFormData.taxId}
                                            onChange={e => setEditFormData({ ...editFormData, taxId: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-600">Business Address</label>
                                    <textarea
                                        value={editFormData.businessAddress}
                                        onChange={e => setEditFormData({ ...editFormData, businessAddress: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <div className="p-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 shadow-lg transition-all font-semibold active:scale-95"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
