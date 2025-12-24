import { useState, type ChangeEvent } from 'react';
import type { ICategory } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi';

export interface ColorVariant {
  colorName: string;
  colorCode: string;
  stock: number;
  image?: string;
}

interface ProductDialogProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: string;
    mainSubcategory?: string;
    subCategory?: string;
    image: string;
    brand?: string;
    discount?: string;
    badge?: string;
    colorVariants?: ColorVariant[];
  };
  categories: ICategory[];
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: string, value: any) => void;
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
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    formData.colorVariants || []
  );
  const [showColorSection, setShowColorSection] = useState(
    (formData.colorVariants?.length || 0) > 0
  );

  if (!isOpen) return null;

  const handleAddColorVariant = () => {
    const newVariant: ColorVariant = {
      colorName: '',
      colorCode: '#000000',
      stock: 0,
      image: ''
    };
    const updated = [...colorVariants, newVariant];
    setColorVariants(updated);
    onChange('colorVariants', updated);
  };

  const handleRemoveColorVariant = (index: number) => {
    const updated = colorVariants.filter((_, i) => i !== index);
    setColorVariants(updated);
    onChange('colorVariants', updated);
    if (updated.length === 0) {
      setShowColorSection(false);
    }
  };

  const handleColorVariantChange = (index: number, field: keyof ColorVariant, value: any) => {
    const updated = [...colorVariants];
    updated[index] = { ...updated[index], [field]: value };
    setColorVariants(updated);
    onChange('colorVariants', updated);
  };

  const handleColorImageUpload = async (index: number, file: File) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    try {
      const response = await fetch('/api/uploads/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadData
      });
      
      if (response.ok) {
        const data = await response.json();
        handleColorVariantChange(index, 'image', data.url);
      }
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

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
                onChange={e => {
                  onChange('category', e.target.value);
                  onChange('mainSubcategory', '');
                  onChange('subCategory', '');
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hierarchical Selection: Section (Main Subcategory) and Item (Sub Category) */}
            {(() => {
              const selectedCat = categories.find(c => c.id === formData.category);
              if (selectedCat?.mainSubcategories?.length) {
                const selectedSection = selectedCat.mainSubcategories.find(s => s.title === (formData as any).mainSubcategory);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Section (Title) *</label>
                      <select
                        value={(formData as any).mainSubcategory || ''}
                        onChange={e => {
                          onChange('mainSubcategory', e.target.value);
                          onChange('subCategory', '');
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all bg-white"
                      >
                        <option value="">Select a section</option>
                        {selectedCat.mainSubcategories.map((sub, idx) => (
                          <option key={idx} value={sub.title}>
                            {sub.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Category (Item) *</label>
                      <select
                        value={formData.subCategory || ''}
                        disabled={!(formData as any).mainSubcategory}
                        onChange={e => onChange('subCategory', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select an item</option>
                        {selectedSection?.items.map((item, idx) => (
                          <option key={idx} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              } else if (selectedCat?.subCategories?.length) {
                // Fallback for categories without grouping
                return (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Category</label>
                    <select
                      value={formData.subCategory || ''}
                      onChange={e => onChange('subCategory', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all bg-white"
                    >
                      <option value="">Select a sub category</option>
                      {selectedCat.subCategories.map((sub, idx) => (
                        <option key={idx} value={sub.name}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              return null;
            })()}
            {/* Brand, Discount, Badge */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={e => onChange('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
                  placeholder="Brand Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount %</label>
                <input
                  type="number"
                  value={formData.discount || ''}
                  onChange={e => onChange('discount', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Badge</label>
                <select
                  value={formData.badge || ''}
                  onChange={e => onChange('badge', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all bg-white"
                >
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Bestseller">Bestseller</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>

              {/* URL Input */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Image URL</p>
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => onChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
                />
              </div>

              {/* File Upload */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Or Upload File</p>
                <input
                  type="file"
                  onChange={onImageChange}
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary1 file:text-white hover:file:bg-primary1/90"
                />
              </div>

              {formData.image && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Preview:</p>
                  <img src={getImageUrl(formData.image)} alt="preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
                </div>
              )}
            </div>

            {/* Color Variants Section */}
            <div className="border-t pt-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Color Variants (Optional)</h3>
                  <p className="text-xs text-gray-500 mt-1">Add different colors available for this product</p>
                </div>
                {!showColorSection && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowColorSection(true);
                      handleAddColorVariant();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium transition-all"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Color Variants
                  </button>
                )}
              </div>

              {showColorSection && (
                <div className="space-y-4">
                  {colorVariants.map((variant, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">
                          Color #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(index)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Color Name *
                          </label>
                          <input
                            type="text"
                            value={variant.colorName}
                            onChange={(e) => handleColorVariantChange(index, 'colorName', e.target.value)}
                            placeholder="e.g., Red, Blue, Black"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Stock Quantity *
                          </label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleColorVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Color Code
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={variant.colorCode}
                              onChange={(e) => handleColorVariantChange(index, 'colorCode', e.target.value)}
                              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                            />
                            <input
                              type="text"
                              value={variant.colorCode}
                              onChange={(e) => handleColorVariantChange(index, 'colorCode', e.target.value)}
                              placeholder="#000000"
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Variant Image (Optional)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleColorImageUpload(index, file);
                              }}
                              className="hidden"
                              id={`color-image-${index}`}
                            />
                            <label
                              htmlFor={`color-image-${index}`}
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-gray-600"
                            >
                              <FiImage className="w-4 h-4" />
                              Upload
                            </label>
                          </div>
                          {variant.image && (
                            <img
                              src={getImageUrl(variant.image)}
                              alt={variant.colorName}
                              className="mt-2 w-16 h-16 object-cover rounded border border-gray-200"
                            />
                          )}
                        </div>
                      </div>

                      {/* Alternative: Image URL input */}
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Or enter image URL
                        </label>
                        <input
                          type="text"
                          value={variant.image || ''}
                          onChange={(e) => handleColorVariantChange(index, 'image', e.target.value)}
                          placeholder="https://example.com/red-dress.jpg"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddColorVariant}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary1 hover:text-primary1 hover:bg-orange-50 transition-all font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Another Color
                  </button>
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
