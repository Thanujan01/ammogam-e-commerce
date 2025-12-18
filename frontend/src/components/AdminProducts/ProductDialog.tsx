import type { ChangeEvent } from 'react';
import { type Category } from '../../data/mockData';

interface ProductDialogProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: string;
    image: string;
  };
  categories: Category[];
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: string, value: string) => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProductDialog({
  isOpen,
  isEditing,
  formData,
  categories,
  onClose,
  onSubmit,
  onChange,
  onImageChange,
}: ProductDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary1 px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-primary1 text-sm mt-1">
            {isEditing ? 'Update product details' : 'Fill in details to add a new product'}
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => onChange('name', e.target.value)}
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => onChange('description', e.target.value)}
                placeholder="Enter product description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => onChange('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={e => onChange('stock', e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={e => onChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
              <input 
                type="file" 
                onChange={onImageChange} 
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary1 file:text-white hover:file:bg-primary1" 
              />
              {formData.image && (
                <div className="mt-3">
                  <img src={formData.image} alt="preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-6 py-2.5 bg-primary1 hover:from-primary2 hover:to-primary3 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all" 
              onClick={onSubmit}
            >
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
