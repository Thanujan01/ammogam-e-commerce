import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { FolderTree } from 'lucide-react';
import { api } from '../../api/api';
import type { ICategory } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';

type ToastType = 'success' | 'error';

interface Toast {
  message: string;
  type: ToastType;
}

export default function AdminCategories() {
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; categoryId: string; categoryName: string }>({ open: false, categoryId: '', categoryName: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: '',
    color: '',
    bgColor: '',
    borderColor: '',
    textColor: '',
    promoText: '',
    mainSubcategories: [] as { title: string; items: string[] }[],
    featuredProducts: [] as { name: string; price: string; discount?: string; tag?: string; image: string }[]
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for management
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSubItem, setNewSubItem] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [newFP, setNewFP] = useState({ name: '', price: '', discount: '', tag: '', image: '📦' });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const normalized = data.map((c: any) => ({
        ...c,
        id: c._id,
        createdAt: c.createdAt ? c.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
      }));
      setCategoryList(normalized);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const openDialog = (category?: ICategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        icon: category.icon || '',
        color: category.color || '',
        bgColor: category.bgColor || '',
        borderColor: category.borderColor || '',
        textColor: category.textColor || '',
        promoText: category.promoText || '',
        mainSubcategories: category.mainSubcategories || [],
        featuredProducts: category.featuredProducts || []
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '', description: '', image: '', icon: '',
        color: '', bgColor: '', borderColor: '', textColor: '',
        promoText: '', mainSubcategories: [], featuredProducts: []
      });
    }
    setNewSectionTitle('');
    setNewSubItem('');
    setNewFP({ name: '', price: '', discount: '', tag: '', image: '📦' });
    setActiveSectionIndex(null);
    setDialogOpen(true);
  };

  const handleAddField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    setFormData(prev => ({
      ...prev,
      mainSubcategories: [...prev.mainSubcategories, { title: newSectionTitle.trim(), items: [] }]
    }));
    setNewSectionTitle('');
  };

  const handleAddSubItem = (sectionIndex: number) => {
    if (!newSubItem.trim()) return;
    const updated = [...formData.mainSubcategories];
    updated[sectionIndex].items.push(newSubItem.trim());
    setFormData(prev => ({ ...prev, mainSubcategories: updated }));
    setNewSubItem('');
  };

  const handleRemoveSection = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      mainSubcategories: prev.mainSubcategories.filter((_, i) => i !== idx)
    }));
  };

  const handleRemoveItem = (sectionIdx: number, itemIdx: number) => {
    const updated = [...formData.mainSubcategories];
    updated[sectionIdx].items = updated[sectionIdx].items.filter((_, i) => i !== itemIdx);
    setFormData(prev => ({ ...prev, mainSubcategories: updated }));
  };

  const handleAddFP = () => {
    if (!newFP.name || !newFP.price) return;
    setFormData(prev => ({
      ...prev,
      featuredProducts: [...prev.featuredProducts, newFP]
    }));
    setNewFP({ name: '', price: '', discount: '', tag: '', image: '📦' });
  };

  const handleRemoveFP = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      featuredProducts: prev.featuredProducts.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      showToast('Please enter a category name.', 'error');
      return;
    }

    try {
      // For legacy subCategories field consistency, flatten the mainSubcategories items
      const flatSubCategories = formData.mainSubcategories.flatMap(s => s.items.map(name => ({ name })));
      const payload = { ...formData, subCategories: flatSubCategories };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, payload);
        showToast(`${formData.name} updated successfully.`, 'success');
      } else {
        await api.post('/categories', payload);
        showToast(`${formData.name} added successfully.`, 'success');
      }
      fetchCategories();
      setDialogOpen(false);
    } catch (error) {
      console.error("Operation failed", error);
      showToast("Operation failed", 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const category = categoryList.find(c => c.id === id);
    setConfirmDialog({ open: true, categoryId: id, categoryName: category?.name || 'this category' });
  };

  const confirmDelete = async () => {
    const { categoryId, categoryName } = confirmDialog;
    setConfirmDialog({ open: false, categoryId: '', categoryName: '' });
    
    try {
      await api.delete(`/categories/${categoryId}`);
      fetchCategories();
      showToast(`${categoryName} deleted successfully.`, 'success');
    } catch (error) {
      console.error("Delete failed", error);
      showToast('Failed to delete category. Please try again.', 'error');
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
        console.error("Upload failed", error);
        showToast("Upload failed", 'error');
      }
    }
  };

  const filteredCategories = categoryList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg  ${
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
      <div className="bg-white rounded-xl p-6 ">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className='space-y-2'>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Category Management</h1>
            <p className="text-gray-400 flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Manage product hierarchy and visual themes
            </p>
            <span className="text-sm font-semibold  ">
              <span className="bg-primary1 text-white px-2 py-1 rounded">
                {categoryList.length}
              </span>
              <span className="text-gray-400 ml-2">
                Total Categories
              </span>
            </span>
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-primary1 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-xl transition-all"
            onClick={() => openDialog()}
          >
            <FiPlus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900">{categoryList.length}</p>
        </div>
      </div> */}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary1"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map(category => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
            <div className={`relative h-40 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200`}>
              {category.image ? (
                <img src={getImageUrl(category.image)} className="w-full h-full object-cover" alt={category.name} />
              ) : (
                <div className="text-4xl text-gray-600 font-bold">{category.name.charAt(0)}</div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => openDialog(category)} className="p-2 bg-primary1 text-white rounded-lg hover:bg-green-600 hover:text-white shadow-md transition-all">
                  <FiEdit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(category.id!)} className="p-2 bg-primary1 text-white rounded-lg hover:bg-red-600 hover:text-white shadow-md transition-all">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{category.promoText || category.description}</p>
              <div className="mt-4 flex flex-wrap gap-1">
                {category.mainSubcategories?.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-[10px] rounded-full">{s.title}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-y-auto ">
            <div className="sticky top-0 bg-primary1 px-6 py-4 rounded-t-2xl flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setDialogOpen(false)}><FiX size={24} /></button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 max-h-[80vh] overflow-y-auto">
              {/* Column 1: Basic Details & Branding */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold border-b pb-1 text-primary1 uppercase tracking-wider">Basic Info</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => handleAddField('name', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary1 outline-none"
                    placeholder="e.g. Mobile accessories"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Promo Text</label>
                  <input
                    type="text"
                    value={formData.promoText}
                    onChange={e => handleAddField('promoText', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary1 outline-none"
                    placeholder="e.g. Up to 50% OFF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => handleAddField('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary1 outline-none resize-none"
                    rows={3}
                  />
                </div>

                {/* <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Icon (Emoji/Class)</label>
                    <input type="text" value={formData.icon} onChange={e => handleAddField('icon', e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="FaMobileAlt" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Color Theme</label>
                    <input type="text" value={formData.color} onChange={e => handleAddField('color', e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="from-blue-500..." />
                  </div>
                </div> */}

                <div className="pt-4 border-t">
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Category Image</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => handleAddField('image', e.target.value)}
                      placeholder="Image URL"
                      className="w-full border rounded-lg px-3 py-2 text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">OR</span>
                      <input type="file" onChange={handleImageUpload} accept="image/*" className="text-[10px] w-full" />
                    </div>
                  </div>
                  {formData.image && (
                    <div className="mt-4 p-2 border rounded-lg bg-gray-50 flex justify-center">
                      <img src={getImageUrl(formData.image)} alt="Preview" className="h-20 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Hierarchy */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-bold border-b pb-1 text-primary1 uppercase tracking-wider mb-4">Hierarchy (Sections)</h3>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={e => setNewSectionTitle(e.target.value)}
                    placeholder="Title"
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                  />
                  <button onClick={handleAddSection} className="bg-primary1 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Add</button>
                </div>

                <div className="space-y-3">
                  {formData.mainSubcategories.map((section, sIdx) => (
                    <div key={sIdx} className="bg-white border rounded-lg p-2.5 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-primary1">{section.title}</span>
                        <button onClick={() => handleRemoveSection(sIdx)} className="text-red-400 hover:text-red-600"><FiTrash2 size={14} /></button>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {section.items.map((item, iIdx) => (
                          <span key={iIdx} className="bg-gray-100 text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                            {item}
                            <FiX className="cursor-pointer" size={8} onClick={() => handleRemoveItem(sIdx, iIdx)} />
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="item..."
                          className="flex-1 border-b text-[10px] outline-none py-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSubItem(sIdx);
                            }
                          }}
                          onChange={e => setNewSubItem(e.target.value)}
                          onFocus={() => setActiveSectionIndex(sIdx)}
                        />
                        {activeSectionIndex === sIdx && (
                          <button onClick={() => handleAddSubItem(sIdx)} className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded">Add</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Featured Products */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-bold border-b pb-1 text-primary1 uppercase tracking-wider mb-4">Featured Products</h3>

                <div className="space-y-2 mb-4 bg-white p-3 rounded-lg border">
                  <input type="text" placeholder="Name" value={newFP.name} onChange={e => setNewFP({ ...newFP, name: e.target.value })} className="w-full border-b text-xs py-1" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Price" value={newFP.price} onChange={e => setNewFP({ ...newFP, price: e.target.value })} className="border-b text-xs py-1" />
                    <input type="text" placeholder="Tag" value={newFP.tag || ''} onChange={e => setNewFP({ ...newFP, tag: e.target.value })} className="border-b text-xs py-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Discount" value={newFP.discount || ''} onChange={e => setNewFP({ ...newFP, discount: e.target.value })} className="border-b text-xs py-1" />
                    <input type="text" placeholder="Icon/Emoji" value={newFP.image} onChange={e => setNewFP({ ...newFP, image: e.target.value })} className="border-b text-xs py-1" />
                  </div>
                  <button onClick={handleAddFP} className="w-full bg-primary1 text-white py-1 rounded text-[10px] font-bold mt-2">Add Product</button>
                </div>

                <div className="space-y-2">
                  {formData.featuredProducts.map((fp, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded border text-[10px]">
                      <span className="font-bold">{fp.image} {fp.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-primary1">{fp.price}</span>
                        <button onClick={() => handleRemoveFP(idx)} className="text-red-400"><FiTrash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setDialogOpen(false)} className="px-6 py-2 border rounded-lg font-bold text-gray-600">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-2 bg-primary1 text-white rounded-lg font-bold shadow-lg hover:opacity-90 transition-opacity">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                Are you sure you want to delete <span className="font-semibold text-gray-900">{confirmDialog.categoryName}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog({ open: false, categoryId: '', categoryName: '' })}
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

