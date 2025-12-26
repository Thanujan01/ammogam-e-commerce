import { useState, useEffect } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Package } from 'lucide-react';
import { api } from '../../api/api';
import type { IProduct, ICategory } from '../../types';
import { useLocation } from 'react-router-dom';
import ProductStats from '../../components/AdminProducts/ProductStats';
import ProductFilters from '../../components/AdminProducts/ProductFilters';
import ProductCard from '../../components/AdminProducts/ProductCard';
import ProductDialog, { type ColorVariant } from '../../components/AdminProducts/ProductDialog';

export default function AdminProducts() {
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

  const location = useLocation();

  useEffect(() => {
    fetchData().then((data) => {
      if (data) {
        const searchParams = new URLSearchParams(location.search);
        const productId = searchParams.get('id');
        if (productId) {
          const product = data.find((p: any) => p.id === productId);
          if (product) {
            openDialog(product);
          }
        }
      }
    });
  }, [location]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);

      const normalizedCategories = categoriesRes.data.map((c: any) => ({
        ...c,
        id: c._id,
        createdAt: c.createdAt ? c.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
      }));
      setCategories(normalizedCategories);

      const normalizedProducts = productsRes.data.map((p: any) => ({
        ...p,
        id: p._id,
        category: p.category ? p.category.name : 'Uncategorized',
        categoryId: p.category ? p.category._id : '',
        image: p.image || '',
        subCategory: p.subCategory || '',
        brand: p.brand || '',
        discount: p.discount || 0,
        badge: p.badge || '',
        seller: p.seller || null
      }));
      setProductList(normalizedProducts);
      return normalizedProducts;
    } catch (error) {
      console.error("Failed to fetch data", error);
      return null;
    }
  };

  const openDialog = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.categoryId || '',
        mainSubcategory: product.mainSubcategory || '',
        subCategory: product.subCategory || '',
        image: product.image,
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
      alert('Please fill all required fields.');
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
        alert(`${formData.name} updated successfully.`);
      } else {
        await api.post('/products', payload);
        alert(`${formData.name} added successfully.`);
      }
      fetchData();
      setDialogOpen(false);
    } catch (error) {
      console.error("Operation failed", error);
      alert("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProductList(prev => prev.filter(p => p.id !== id));
      alert(`Product deleted.`);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };



  const filteredProducts = productList.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    // For category filter, we match against the display name (p.category)
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && p.stock < 20) ||
      (stockFilter === 'medium' && p.stock >= 20 && p.stock < 50) ||
      (stockFilter === 'high' && p.stock >= 50);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = productList.filter(p => p.stock < 20).length;
  const totalValue = productList.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStockFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl  p-6 ">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Manage your entire product catalog
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-primary1 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-xl hover:shadow-lg transition-all"
            onClick={() => openDialog()}
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <ProductStats
        totalProducts={productList.length}
        lowStockCount={lowStockCount}
        categoriesCount={categories.length}
        totalValue={totalValue}
      />

      {/* Filters */}
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
        onReset={handleResetFilters}
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={openDialog}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search query</p>
        </div>
      )}

      {/* Product Dialog */}
      <ProductDialog
        isOpen={dialogOpen}
        isEditing={!!editingProduct}
        formData={formData}
        categories={categories}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        onChange={handleFormChange}
      />
    </div>
  );
}