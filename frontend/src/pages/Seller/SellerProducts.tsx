import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Package } from 'lucide-react';
import { api } from '../../api/api';
import type { IProduct, ICategory } from '../../types';
import ProductStats from '../../components/AdminProducts/ProductStats';
import ProductFilters from '../../components/AdminProducts/ProductFilters';
import ProductCard from '../../components/AdminProducts/ProductCard';
import ProductDialog, { type ColorVariant } from '../../components/AdminProducts/ProductDialog';

export default function SellerProducts() {
    const [productList, setProductList] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
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
        colorVariants: []
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<string>('all');

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
                colorVariants: product.colorVariants || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '', description: '', price: '', stock: '', category: '',
                mainSubcategory: '', subCategory: '', image: '', brand: '', discount: '', badge: '',
                colorVariants: []
            });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.category) {
            alert('Please fill all required fields.');
            return;
        }

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0,
                colorVariants: formData.colorVariants || []
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                alert('Product updated successfully.');
            } else {
                await api.post('/products', payload);
                alert('Product added successfully.');
            }
            fetchData();
            setDialogOpen(false);
        } catch (error) {
            console.error("Operation failed", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProductList(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const uploadData = new FormData();
            uploadData.append('file', file);
            try {
                const res = await api.post('/uploads/image', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setFormData(prev => ({ ...prev, image: res.data.url }));
            } catch (error) {
                console.error("Image upload failed", error);
            }
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
                onImageChange={handleImageChange}
            />
        </div>
    );
}
