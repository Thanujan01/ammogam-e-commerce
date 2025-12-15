import { useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Package } from 'lucide-react';
import { products as mockProducts, categories, type Product } from '../../data/mockData';
import ProductStats from '../../components/AdminProducts/ProductStats';
import ProductFilters from '../../components/AdminProducts/ProductFilters';
import ProductCard from '../../components/AdminProducts/ProductCard';
import ProductDialog from '../../components/AdminProducts/ProductDialog';

export default function AdminProducts() {
  const [productList, setProductList] = useState<Product[]>(mockProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', image: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        image: product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill all required fields.');
      return;
    }

    if (editingProduct) {
      setProductList(prev =>
        prev.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) || 0 }
            : p
        )
      );
      alert(`${formData.name} updated successfully.`);
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        category: formData.category,
        image: formData.image || '/placeholder.svg',
        sales: 0,
      };
      setProductList(prev => [...prev, newProduct]);
      alert(`${formData.name} added successfully.`);
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const product = productList.find(p => p.id === id);
    setProductList(prev => prev.filter(p => p.id !== id));
    alert(`${product?.name} deleted.`);
  };

  const handleImageChange = () => {
    
  };
  //  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setFormData(prev => ({ ...prev, image: reader.result as string }));
  //     };
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };

  const filteredProducts = productList.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
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
      <div className="bg-white  p-6 ">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Manage your entire product catalog
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-primary1 hover:bg-gray-50 text-white px-6 py-3 rounded-lg font-semibold shadow-xl hover:shadow-lg transition-all"
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
        onImageChange={handleImageChange}
      />
    </div>
  );
}