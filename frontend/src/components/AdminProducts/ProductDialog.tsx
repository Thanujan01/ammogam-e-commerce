import { useState, useRef, useEffect } from 'react';
import type { ICategory } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';
import { FiPlus, FiTrash2, FiImage, FiX } from 'react-icons/fi';
import { api } from '../../api/api';

export interface SizeOption {
  size: string;
  stock: number;
  price: number;
}

export interface WeightOption {
  weight: string;
  stock: number;
  price: number;
}

export interface ColorVariant {
  colorName: string;
  colorCode: string;
  variantType: 'size' | 'weight' | 'none';
  sizes?: SizeOption[];
  weights?: WeightOption[];
  stock: number;
  images: string[];
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
    shippingFee?: string;
    colorVariants?: ColorVariant[];
  };
  categories: ICategory[];
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: string, value: any) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export default function ProductDialog({
  isOpen,
  isEditing,
  formData,
  categories,
  onClose,
  onSubmit,
  onChange,
  showToast,
}: ProductDialogProps) {
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    formData.colorVariants || []
  );
  const [showColorSection, setShowColorSection] = useState(
    (formData.colorVariants?.length || 0) > 0
  );
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sectionSearch, setSectionSearch] = useState('');
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [subCategorySearch, setSubCategorySearch] = useState('');
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);

  // Maintain local references for file inputs to reset them
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync colorVariants state when formData changes (important for edit mode)
  useEffect(() => {
    if (formData.colorVariants) {
      setColorVariants(formData.colorVariants);
      setShowColorSection(formData.colorVariants.length > 0);
    } else {
      setColorVariants([]);
      setShowColorSection(false);
    }
    // Reset category search when dialog opens
    if (isOpen) {
      const selectedCat = categories.find(c => c.id === formData.category);
      setCategorySearch(selectedCat?.name || '');

      // Reset section search
      setSectionSearch((formData as any).mainSubcategory || '');

      // Reset subcategory search
      setSubCategorySearch(formData.subCategory || '');
    } else {
      setCategorySearch('');
      setSectionSearch('');
      setSubCategorySearch('');
    }
  }, [formData.colorVariants, isOpen, formData.category, formData.subCategory, categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown-container')) {
        setShowCategoryDropdown(false);
      }
      if (!target.closest('.section-dropdown-container')) {
        setShowSectionDropdown(false);
      }
      if (!target.closest('.subcategory-dropdown-container')) {
        setShowSubCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown || showSectionDropdown || showSubCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCategoryDropdown, showSectionDropdown, showSubCategoryDropdown]);

  if (!isOpen) return null;

  const handleAddColorVariant = () => {
    const newVariant: ColorVariant = {
      colorName: '',
      colorCode: '#000000',
      variantType: 'none',
      sizes: [],
      weights: [],
      stock: 0,
      images: []
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

    // If variantType changes, reset specific options
    if (field === 'variantType') {
      if (value === 'none') {
        updated[index].sizes = [];
        updated[index].weights = [];
      } else if (value === 'size') {
        updated[index].weights = [];
        if (!updated[index].sizes || updated[index].sizes.length === 0) {
          updated[index].sizes = [{ size: '', stock: 0, price: 0 }];
        }
      } else if (value === 'weight') {
        updated[index].sizes = [];
        if (!updated[index].weights || updated[index].weights.length === 0) {
          updated[index].weights = [{ weight: '', stock: 0, price: 0 }];
        }
      }
    }

    setColorVariants(updated);
    onChange('colorVariants', updated);
  };

  const handleAddSizeOption = (variantIndex: number) => {
    const updated = [...colorVariants];
    const sizes = updated[variantIndex].sizes || [];
    updated[variantIndex].sizes = [...sizes, { size: '', stock: 0, price: 0 }];
    setColorVariants(updated);
    onChange('colorVariants', updated);
  };

  const handleRemoveSizeOption = (variantIndex: number, sizeIndex: number) => {
    const updated = [...colorVariants];
    updated[variantIndex].sizes = updated[variantIndex].sizes?.filter((_, i) => i !== sizeIndex);
    setColorVariants(updated);
    onChange('colorVariants', updated);
  };

  const handleSizeOptionChange = (variantIndex: number, sizeIndex: number, field: keyof SizeOption, value: any) => {
    const updated = [...colorVariants];
    if (updated[variantIndex].sizes) {
      updated[variantIndex].sizes![sizeIndex] = { ...updated[variantIndex].sizes![sizeIndex], [field]: value };
      setColorVariants(updated);
      onChange('colorVariants', updated);
    }
  };

  const handleAddWeightOption = (variantIndex: number) => {
    const updated = [...colorVariants];
    const weights = updated[variantIndex].weights || [];
    updated[variantIndex].weights = [...weights, { weight: '', stock: 0, price: 0 }];
    setColorVariants(updated);
    onChange('colorVariants', updated);
  };

  const handleRemoveWeightOption = (variantIndex: number, weightIndex: number) => {
    const updated = [...colorVariants];
    updated[variantIndex].weights = updated[variantIndex].weights?.filter((_, i) => i !== weightIndex);
    setColorVariants(updated);
    onChange('colorVariants', updated);
  };

  const handleWeightOptionChange = (variantIndex: number, weightIndex: number, field: keyof WeightOption, value: any) => {
    const updated = [...colorVariants];
    if (updated[variantIndex].weights) {
      updated[variantIndex].weights![weightIndex] = { ...updated[variantIndex].weights![weightIndex], [field]: value };
      setColorVariants(updated);
      onChange('colorVariants', updated);
    }
  };

  const handleColorImageUpload = async (index: number, file: File) => {
    if (colorVariants[index].images.length >= 5) {
      showToast("Maximum 5 images allowed per color variant.", 'error');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await api.post('/uploads/image', uploadData);

      if (response.data && response.data.url) {
        const updatedImages = [...colorVariants[index].images, response.data.url];
        handleColorVariantChange(index, 'images', updatedImages);
      }
    } catch (error) {
      console.error('Image upload failed', error);
      showToast('Failed to upload image. Please check your connection and try again.', 'error');
    }
  };

  const handleRemoveVariantImage = (variantIndex: number, imageIndex: number) => {
    const updatedImages = colorVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
    handleColorVariantChange(variantIndex, 'images', updatedImages);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary1 px-6 py-4 rounded-t-2xl z-10 w-full flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {isEditing ? 'Update product details' : 'Fill in details to add a new product'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
            title="Close"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-5">
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <FiPlus className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Overall Stock</p>
                  <p className="text-2xl font-black text-indigo-900 leading-none mt-1">
                    {colorVariants.reduce((sum, v) => {
                      if (v.variantType === 'size' && v.sizes) {
                        return sum + v.sizes.reduce((s, size) => s + (size.stock || 0), 0);
                      } else if (v.variantType === 'weight' && v.weights) {
                        return sum + v.weights.reduce((w, weight) => w + (weight.stock || 0), 0);
                      }
                      return sum + (v.stock || 0);
                    }, 0)} <span className="text-sm font-medium opacity-60">Items</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Colors</p>
                <p className="text-2xl font-black text-indigo-900 leading-none mt-1">{colorVariants.length}</p>
              </div>
            </div>

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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.shippingFee || ''}
                onChange={e => onChange('shippingFee', e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
              />
            </div>
            <div className="relative category-dropdown-container">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <div className="relative">
                <input
                  type="text"
                  value={categorySearch || categories.find(c => c.id === formData.category)?.name || ''}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setShowCategoryDropdown(true);
                  }}
                  onFocus={() => setShowCategoryDropdown(true)}
                  placeholder="Search or select a category"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
                />
                {showCategoryDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categories
                      .filter(cat =>
                        cat.name.toLowerCase().startsWith(categorySearch.toLowerCase())
                      )
                      .map(cat => (
                        <div
                          key={cat.id}
                          onClick={() => {
                            onChange('category', cat.id);
                            onChange('mainSubcategory', '');
                            onChange('subCategory', '');
                            setCategorySearch(cat.name);
                            setShowCategoryDropdown(false);
                          }}
                          className={`px-4 py-2.5 cursor-pointer hover:bg-primary1/10 transition-colors ${formData.category === cat.id ? 'bg-primary1/20 font-semibold' : ''
                            }`}
                        >
                          {cat.name}
                        </div>
                      ))}
                    {categories.filter(cat => cat.name.toLowerCase().startsWith(categorySearch.toLowerCase())).length === 0 && (
                      <div className="px-4 py-2.5 text-gray-500 text-sm text-center">
                        No categories found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formData.category && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('category', '');
                    onChange('mainSubcategory', '');
                    onChange('subCategory', '');
                    setCategorySearch('');
                  }}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Hierarchical Selection: Section (Main Subcategory) and Item (Sub Category) */}
            {(() => {
              const selectedCat = categories.find(c => c.id === formData.category);
              if (selectedCat?.mainSubcategories?.length) {
                const selectedSection = selectedCat.mainSubcategories.find(s => s.title === (formData as any).mainSubcategory);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative section-dropdown-container">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Section (Title) *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={sectionSearch}
                          onChange={(e) => {
                            setSectionSearch(e.target.value);
                            setShowSectionDropdown(true);
                          }}
                          onFocus={() => setShowSectionDropdown(true)}
                          placeholder="Search or select a section"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all"
                        />
                        {showSectionDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {selectedCat.mainSubcategories
                              .filter(sub =>
                                sub.title.toLowerCase().startsWith(sectionSearch.toLowerCase())
                              )
                              .map((sub, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    onChange('mainSubcategory', sub.title);
                                    onChange('subCategory', '');
                                    setSectionSearch(sub.title);
                                    setSubCategorySearch('');
                                    setShowSectionDropdown(false);
                                  }}
                                  className={`px-4 py-2.5 cursor-pointer hover:bg-primary1/10 transition-colors ${(formData as any).mainSubcategory === sub.title ? 'bg-primary1/20 font-semibold' : ''
                                    }`}
                                >
                                  {sub.title}
                                </div>
                              ))}
                            {selectedCat.mainSubcategories.filter(sub => sub.title.toLowerCase().startsWith(sectionSearch.toLowerCase())).length === 0 && (
                              <div className="px-4 py-2.5 text-gray-500 text-sm text-center">
                                No sections found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {(formData as any).mainSubcategory && (
                        <button
                          type="button"
                          onClick={() => {
                            onChange('mainSubcategory', '');
                            onChange('subCategory', '');
                            setSectionSearch('');
                            setSubCategorySearch('');
                          }}
                          className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="relative subcategory-dropdown-container">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Category (Item) *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={subCategorySearch}
                          onChange={(e) => {
                            setSubCategorySearch(e.target.value);
                            setShowSubCategoryDropdown(true);
                          }}
                          onFocus={() => setShowSubCategoryDropdown(true)}
                          disabled={!(formData as any).mainSubcategory}
                          placeholder="Search or select an item"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        {showSubCategoryDropdown && selectedSection && !(formData as any).mainSubcategory === false && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {selectedSection.items
                              .filter(item =>
                                item.toLowerCase().startsWith(subCategorySearch.toLowerCase())
                              )
                              .map((item, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    onChange('subCategory', item);
                                    setSubCategorySearch(item);
                                    setShowSubCategoryDropdown(false);
                                  }}
                                  className={`px-4 py-2.5 cursor-pointer hover:bg-primary1/10 transition-colors ${formData.subCategory === item ? 'bg-primary1/20 font-semibold' : ''
                                    }`}
                                >
                                  {item}
                                </div>
                              ))}
                            {selectedSection.items.filter(item => item.toLowerCase().startsWith(subCategorySearch.toLowerCase())).length === 0 && (
                              <div className="px-4 py-2.5 text-gray-500 text-sm text-center">
                                No items found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {formData.subCategory && (
                        <button
                          type="button"
                          onClick={() => {
                            onChange('subCategory', '');
                            setSubCategorySearch('');
                          }}
                          className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
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
            <div className="grid grid-cols-2 gap-4">
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
              {/* <div>
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
              </div> */}
            </div>


            {/* Color Variants Section */}
            <div className="border-t pt-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Color Variants</h3>
                  <p className="text-xs text-gray-500 mt-1">Add colors and their specific images (Max 5 per color)</p>
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
                      <div className="flex items-center justify-between mb-3 bg-white p-2 rounded-lg border border-gray-100">
                        <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: variant.colorCode }}></span>
                          Color Variant #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(index)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-all"
                          title="Remove Variant"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
                            Color Code
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={variant.colorCode}
                              onChange={(e) => handleColorVariantChange(index, 'colorCode', e.target.value)}
                              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer p-1 bg-white"
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
                            Variant Type
                          </label>
                          <select
                            value={variant.variantType}
                            onChange={(e) => handleColorVariantChange(index, 'variantType', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none bg-white"
                          >
                            <option value="none">None (Standard Stock)</option>
                            <option value="size">Size Based</option>
                            <option value="weight">Weight Based</option>
                          </select>
                        </div>

                        {variant.variantType === 'none' && (
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
                        )}
                      </div>

                      {/* Size Options */}
                      {variant.variantType === 'size' && (
                        <div className="mb-4 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Size Options</h4>
                            <button
                              type="button"
                              onClick={() => handleAddSizeOption(index)}
                              className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors flex items-center gap-1"
                            >
                              <FiPlus size={10} /> Add Size
                            </button>
                          </div>
                          <div className="space-y-2">
                            {variant.sizes?.map((sizeOpt, sIdx) => (
                              <div key={sIdx} className="grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-4">
                                  <label className="block text-[10px] text-gray-500 mb-0.5">Size</label>
                                  <input
                                    type="text"
                                    value={sizeOpt.size}
                                    onChange={(e) => handleSizeOptionChange(index, sIdx, 'size', e.target.value)}
                                    placeholder="e.g. S, M, L"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="block text-[10px] text-gray-500 mb-0.5">Stock</label>
                                  <input
                                    type="number"
                                    value={sizeOpt.stock}
                                    onChange={(e) => handleSizeOptionChange(index, sIdx, 'stock', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="block text-[10px] text-gray-500 mb-0.5">Price Add-on</label>
                                  <input
                                    type="number"
                                    value={sizeOpt.price}
                                    onChange={(e) => handleSizeOptionChange(index, sIdx, 'price', parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                                  />
                                </div>
                                <div className="col-span-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSizeOption(index, sIdx)}
                                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-md transition-all"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Weight Options */}
                      {variant.variantType === 'weight' && (
                        <div className="mb-4 bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wider">Weight Options</h4>
                            <button
                              type="button"
                              onClick={() => handleAddWeightOption(index)}
                              className="text-[10px] bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition-colors flex items-center gap-1"
                            >
                              <FiPlus size={10} /> Add Weight
                            </button>
                          </div>
                          <div className="space-y-2">
                            {variant.weights?.map((weightOpt, wIdx) => (
                              <div key={wIdx} className="grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-4">
                                  <label className="block text-[10px] text-gray-500 mb-0.5">Weight</label>
                                  <input
                                    type="text"
                                    value={weightOpt.weight}
                                    onChange={(e) => handleWeightOptionChange(index, wIdx, 'weight', e.target.value)}
                                    placeholder="e.g. 500g, 1kg"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="block text-[10px] text-gray-500 mb-0.5">Stock</label>
                                  <input
                                    type="number"
                                    value={weightOpt.stock}
                                    onChange={(e) => handleWeightOptionChange(index, wIdx, 'stock', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="block text-[10px] text-gray-500 mb-0.5">Price Add-on</label>
                                  <input
                                    type="number"
                                    value={weightOpt.price}
                                    onChange={(e) => handleWeightOptionChange(index, wIdx, 'price', parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                  />
                                </div>
                                <div className="col-span-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveWeightOption(index, wIdx)}
                                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-md transition-all"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Multiple Images Section */}
                      <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-xs font-bold text-gray-700">
                            Variant Images ({variant.images.length}/5)
                          </label>
                        </div>

                        {/* Image URL Input */}
                        {variant.images.length < 5 && (
                          <div className="mb-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter image URL"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary1 focus:border-primary1 outline-none"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    const url = input.value.trim();
                                    if (url && variant.images.length < 5) {
                                      const updatedImages = [...variant.images, url];
                                      handleColorVariantChange(index, 'images', updatedImages);
                                      input.value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                  const url = input.value.trim();
                                  if (url && variant.images.length < 5) {
                                    const updatedImages = [...variant.images, url];
                                    handleColorVariantChange(index, 'images', updatedImages);
                                    input.value = '';
                                  }
                                }}
                                className="px-3 py-2 bg-primary1/10 text-primary1 rounded-lg text-xs font-medium hover:bg-primary1/20 transition-all"
                              >
                                Add URL
                              </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Or upload a file:</p>
                          </div>
                        )}

                        {/* File Upload */}
                        {variant.images.length < 5 && (
                          <div className="mb-3">
                            <input
                              ref={(el) => { fileInputRefs.current[index] = el; }}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleColorImageUpload(index, file);
                                  if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = '';
                                }
                              }}
                              className="hidden"
                              id={`color-image-${index}`}
                            />
                            <label
                              htmlFor={`color-image-${index}`}
                              className="cursor-pointer flex items-center justify-center gap-2 w-full text-xs bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 px-3 py-2.5 rounded-lg font-medium hover:bg-gray-100 hover:border-primary1 hover:text-primary1 transition-all"
                            >
                              <FiImage className="w-4 h-4" />
                              Upload Image File
                            </label>
                          </div>
                        )}

                        {/* Image Preview Grid */}
                        {variant.images.length > 0 ? (
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {variant.images.map((imgUrl, imgIndex) => (
                              <div key={imgIndex} className="relative w-20 h-20 flex-shrink-0 group">
                                <img
                                  src={getImageUrl(imgUrl)}
                                  alt={`Var ${imgIndex}`}
                                  className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantImage(index, imgIndex)}
                                  className="absolute -top-1.5 -right-1.5 bg-white text-red-500 rounded-full p-0.5 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FiX className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-gray-50 rounded border border-dashed border-gray-200">
                            <p className="text-xs text-gray-400">No images added for this color yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddColorVariant}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary1 hover:text-primary1 hover:bg-orange-50 transition-all font-medium text-sm flex items-center justify-center gap-2 group"
                  >
                    <div className="bg-gray-200 group-hover:bg-primary1 group-hover:text-white rounded-full p-1 transition-colors">
                      <FiPlus className="w-4 h-4" />
                    </div>
                    Add Another Color Variant
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
