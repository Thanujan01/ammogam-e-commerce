import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlus, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Package } from 'lucide-react';
import { api } from '../../api/api';
import type { IProduct, ICategory } from '../../types';
import ProductStats from '../../components/AdminProducts/ProductStats';
import ProductFilters from '../../components/AdminProducts/ProductFilters';
import ProductCard from '../../components/AdminProducts/ProductCard';
import ProductDialog, { type ColorVariant } from '../../components/AdminProducts/ProductDialog';

type ToastType = 'success' | 'error';

interface Toast {
  message: string;
  type: ToastType;
}

export default function SellerProducts() {
    const [productList, setProductList] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; productId: string; productName: string }>({ open: false, productId: '', productName: '' });
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        price: string;
        stock: string;
        category: string;
        subCategory: string;
        mainSubcategory: string;
        image: string;
        brand: string;
        discount: string;
        badge: string;
        shippingFee: string;
        colorVariants?: ColorVariant[];
    }>({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        subCategory: '',
        mainSubcategory: '',
        image: '',
        brand: '',
        discount: '',
        badge: '',
        shippingFee: '',
        colorVariants: []
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<string>('all');

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products/seller/my-products'),
                api.get('/categories')
            ]);

            setCategories(categoriesRes.data.map((c: any) => ({ ...c, id: c._id })));

            const normalizedProducts = productsRes.data.map((p: any) => ({
                ...p,
                id: p._id,
                category: p.category ? p.category.name : 'Uncategorized',
                categoryId: p.category ? p.category._id : '',
            }));
            setProductList(normalizedProducts);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    // Auto-select product if ID is in URL
    useEffect(() => {
        const productId = searchParams.get('id');
        if (productId && productList.length > 0) {
            const product = productList.find(p => p.id === productId || (p as any)._id === productId);
            if (product) {
                openDialog(product);
            }
        }
    }, [searchParams, productList]);

    const openDialog = (product?: any) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                stock: product.stock.toString(),
                category: product.categoryId || '',
                mainSubcategory: product.mainSubcategory || '',
                subCategory: product.subCategory || '',
                image: product.image || '',
                brand: product.brand || '',
                discount: product.discount?.toString() || '',
                badge: product.badge || '',
                shippingFee: product.shippingFee?.toString() || '',
                colorVariants: product.colorVariants || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '', description: '', price: '', stock: '', category: '',
                mainSubcategory: '', subCategory: '', image: '', brand: '', discount: '', badge: '',
                shippingFee: '',
                colorVariants: []
            });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.category) {
            showToast('Please fill all required fields.', 'error');
            return;
        }

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                shippingFee: parseFloat(formData.shippingFee) || 0,
                stock: parseInt(formData.stock) || 0,
                colorVariants: formData.colorVariants || []
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                showToast('Product updated successfully.', 'success');
            } else {
                await api.post('/products', payload);
                showToast('Product added successfully.', 'success');
            }
            fetchData();
            setDialogOpen(false);
        } catch (error) {
            console.error("Operation failed", error);
            showToast('Operation failed. Please try again.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const product = productList.find(p => p.id === id);
        setConfirmDialog({ open: true, productId: id, productName: product?.name || 'this product' });
    };

    const confirmDelete = async () => {
        const { productId, productName } = confirmDialog;
        setConfirmDialog({ open: false, productId: '', productName: '' });
        
        try {
            await api.delete(`/products/${productId}`);
            setProductList(prev => prev.filter(p => p.id !== productId));
            showToast(`${productName} deleted successfully.`, 'success');
        } catch (error) {
            console.error("Delete failed", error);
            showToast('Failed to delete product. Please try again.', 'error');
        }
    };



    const filteredProducts = productList.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        const matchesStock = stockFilter === 'all' || (stockFilter === 'low' && p.stock < 10);
        return matchesSearch && matchesCategory && matchesStock;
    });

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
                        toast.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                    }`}>
                        {toast.type === 'success' ? (
                            <FiCheckCircle className="w-5 h-5" />
                        ) : (
                            <FiAlertCircle className="w-5 h-5" />
                        )}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Package className="text-primary1" />
                            My Products
                        </h1>
                        <p className="text-gray-500 mt-2">Manage and list your products for sale</p>
                    </div>
                    <button
                        onClick={() => openDialog()}
                        className="flex items-center justify-center gap-2 bg-primary1 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95"
                    >
                        <FiPlus className="w-5 h-5" />
                        Add New Product
                    </button>
                </div>
            </div>

            <ProductStats
                totalProducts={productList.length}
                lowStockCount={productList.filter(p => (Number(p.stock) || 0) < 10).length}
                categoriesCount={new Set(productList.map(p => p.category)).size}
                totalValue={productList.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0)}
            />

            <ProductFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                stockFilter={stockFilter}
                setStockFilter={setStockFilter}
                categories={categories}
                filteredCount={filteredProducts.length}
                totalCount={productList.length}
                onReset={() => { setSearchQuery(''); setCategoryFilter('all'); setStockFilter('all'); }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={openDialog}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <ProductDialog
                isOpen={dialogOpen}
                isEditing={!!editingProduct}
                formData={formData}
                categories={categories}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleSubmit}
                onChange={(field, val) => setFormData(prev => ({ ...prev, [field]: val }))}
                showToast={showToast}
            />

            {/* Confirmation Dialog */}
            {confirmDialog.open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiAlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Confirm Deletion</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">{confirmDialog.productName}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmDialog({ open: false, productId: '', productName: '' })}
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
