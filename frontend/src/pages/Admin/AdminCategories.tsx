import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import { FolderTree } from 'lucide-react';
import { categories as mockCategories, type Category } from '../../data/mockData';

export default function AdminCategories() {
  const [categoryList, setCategoryList] = useState<Category[]>(mockCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const openDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        image: category.image || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert('Please enter a category name.');
      return;
    }

    if (editingCategory) {
      setCategoryList(prev =>
        prev.map(c =>
          c.id === editingCategory.id
            ? { 
                ...c, 
                name: formData.name, 
                description: formData.description,
                image: formData.image 
              }
            : c
        )
      );
      alert(`${formData.name} updated successfully.`);
    } else {
      const newCategory: Category = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description,
        productCount: 0,
        image: formData.image || '/placeholder.svg',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCategoryList(prev => [...prev, newCategory]);
      alert(`${formData.name} added successfully.`);
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const category = categoryList.find(c => c.id === id);
    if (category && category.productCount > 0) {
      alert(`Cannot delete ${category.name} as it has ${category.productCount} products. Please reassign or delete products first.`);
      return;
    }
    setCategoryList(prev => prev.filter(c => c.id !== id));
    alert(`${category?.name} deleted.`);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const filteredCategories = categoryList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProducts = categoryList.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-black">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Category Management</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Organize your products with categories
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-primary1 hover:bg-gray-50 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => openDialog()}
          >
            <FiPlus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categoryList.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg Products/Category</p>
              <p className="text-2xl font-bold text-gray-900">
                {categoryList.length > 0 ? (totalProducts / categoryList.length).toFixed(1) : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">📊</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Status</p>
              <p className="text-2xl font-bold text-green-600">All Active</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-green-600">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="px-6 py-3 border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 rounded-lg font-medium transition-all text-sm"
          >
            Clear Search
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredCategories.length} of {categoryList.length} categories
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map(category => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Category Image/Icon */}
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 h-40 flex items-center justify-center overflow-hidden">
              {category.image && category.image !== '/placeholder.svg' ? (
                <img
                  src={category.image}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={category.name}
                />
              ) : (
                <FolderTree className="w-16 h-16 text-green-600 opacity-50 group-hover:scale-110 transition-transform duration-300" />
              )}
              
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => openDialog(category)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-md"
                  title="Edit"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-md"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Count Badge */}
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary1 text-white text-xs font-semibold shadow-md">
                {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
              </span>
            </div>

            {/* Category Details */}
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary1 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
                {category.description || 'No description available'}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => openDialog(category)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No categories found</h3>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your search query or create a new category</p>
          <button
            onClick={() => openDialog()}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            <FiPlus className="w-5 h-5" />
            Add First Category
          </button>
        </div>
      )}

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-primary1 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <p className="text-primary1 text-sm mt-1">
                {editingCategory ? 'Update category details' : 'Fill in details to add a new category'}
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., CCTV Cameras"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all resize-none"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Image (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary1 file:text-white hover:file:bg-primary1"
                  />
                  {formData.image && (
                    <div className="mt-3">
                      <img
                        src={formData.image}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 bg-primary1 hover:from-primary2 hover:to-primary3 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={handleSubmit}
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
